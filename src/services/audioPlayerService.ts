/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { store } from '../store/lawStore';
import { getLawById } from '../data/laws';
import { normalizeSlovakLegalTextForTTS } from './legislationService';

interface AudioCacheEntry {
  audioUrl?: string;
  blob?: Blob;
  normalizedText: string;
  source: 'gemini-tts' | 'web-speech-fallback';
}

class AudioPlayerService {
  private currentAudio: HTMLAudioElement | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private audioCache = new Map<string, AudioCacheEntry>();
  private prefetchQueue = new Set<string>();
  private progressInterval: number | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.currentAudio = new Audio();
      this.currentAudio.addEventListener('ended', () => this.handleTrackEnded());
      this.currentAudio.addEventListener('timeupdate', () => this.handleTimeUpdate());
      this.currentAudio.addEventListener('error', (e) => {
        console.warn('Audio playback error, falling back:', e);
        this.fallbackPlayWithWebSpeech();
      });
    }
  }

  private getCacheKey(docId: string, unitId: string): string {
    return `${docId}__${unitId}`;
  }

  /**
   * Fetches TTS audio data from backend /api/tts.
   */
  async fetchTts(docId: string, unitId: string): Promise<AudioCacheEntry> {
    const key = this.getCacheKey(docId, unitId);
    if (this.audioCache.has(key)) {
      return this.audioCache.get(key)!;
    }

    const law = getLawById(docId);
    const unit = law?.allUnits.find((u) => u.id === unitId);
    if (!unit || !law) {
      throw new Error('Paragraf nebol nájdený.');
    }

    // Build spoken text including legal reference and content
    const textToSpeak = `${unit.displayNumber} ${unit.title ? unit.title + '.' : ''} ${unit.fullText}`;

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToSpeak,
          voice: store.getSnapshot().playback.ttsVoice || 'Kore',
        }),
      });

      if (!response.ok) {
        throw new Error(`TTS server HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.audioBase64) {
        // Convert base64 to Blob URL
        const binary = atob(data.audioBase64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: data.mimeType || 'audio/wav' });
        const audioUrl = URL.createObjectURL(blob);

        const entry: AudioCacheEntry = {
          audioUrl,
          blob,
          normalizedText: data.normalizedText || textToSpeak,
          source: 'gemini-tts',
        };
        this.audioCache.set(key, entry);
        return entry;
      }

      // Web speech fallback
      const fallbackEntry: AudioCacheEntry = {
        normalizedText: data.normalizedText || normalizeSlovakLegalTextForTTS(textToSpeak),
        source: 'web-speech-fallback',
      };
      this.audioCache.set(key, fallbackEntry);
      return fallbackEntry;
    } catch (err) {
      console.warn('Backend TTS failed, using offline fallback:', err);
      const fallbackEntry: AudioCacheEntry = {
        normalizedText: normalizeSlovakLegalTextForTTS(textToSpeak),
        source: 'web-speech-fallback',
      };
      this.audioCache.set(key, fallbackEntry);
      return fallbackEntry;
    }
  }

  /**
   * Prefetches audio for the NEXT paragraph in background to achieve zero-latency playback.
   */
  async prefetchNext(docId: string, currentUnitId: string) {
    const law = getLawById(docId);
    if (!law) return;

    const currentIndex = law.allUnits.findIndex((u) => u.id === currentUnitId);
    if (currentIndex >= 0 && currentIndex < law.allUnits.length - 1) {
      const nextUnit = law.allUnits[currentIndex + 1];
      const nextKey = this.getCacheKey(docId, nextUnit.id);

      if (!this.audioCache.has(nextKey) && !this.prefetchQueue.has(nextKey)) {
        this.prefetchQueue.add(nextKey);
        try {
          await this.fetchTts(docId, nextUnit.id);
        } catch (e) {
          // ignore background prefetch errors
        } finally {
          this.prefetchQueue.delete(nextKey);
        }
      }
    }
  }

  /**
   * Starts playing a specific unit in a document.
   */
  async playUnit(docId: string, unitId: string) {
    this.stop();

    const law = getLawById(docId);
    const unit = law?.allUnits.find((u) => u.id === unitId);
    if (!law || !unit) return;

    store.setPlayback({
      documentId: docId,
      documentTitle: law.title,
      documentActNumber: law.actNumber,
      unitId: unit.id,
      unitDisplayNumber: unit.displayNumber,
      unitTitle: unit.title,
      isBuffering: true,
      isPlaying: true,
      currentTime: 0,
      duration: 0,
    });

    // Record reading history
    const unitIndex = law.allUnits.findIndex((u) => u.id === unit.id);
    const progressPercent = Math.round(((unitIndex + 1) / law.allUnits.length) * 100);
    store.recordHistory({
      documentId: law.id,
      documentTitle: law.title,
      documentActNumber: law.actNumber,
      unitId: unit.id,
      unitDisplayNumber: unit.displayNumber,
      unitTitle: unit.title,
      progressPercent,
      updatedAt: new Date().toISOString(),
    });

    try {
      const entry = await this.fetchTts(docId, unitId);
      store.setPlayback({ isBuffering: false });

      if (entry.source === 'gemini-tts' && entry.audioUrl && this.currentAudio) {
        this.currentAudio.src = entry.audioUrl;
        this.currentAudio.playbackRate = store.getSnapshot().playback.rate;
        await this.currentAudio.play();
        store.setPlayback({ isPlaying: true });
      } else {
        this.playWithWebSpeech(entry.normalizedText);
      }

      // Trigger prefetching of the next paragraph
      this.prefetchNext(docId, unitId);
    } catch (err) {
      console.error('Play unit error:', err);
      this.fallbackPlayWithWebSpeech();
    }
  }

  /**
   * Fallback using Web Speech API with Slovak voice
   */
  private playWithWebSpeech(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      store.setPlayback({ isPlaying: false, isBuffering: false });
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'sk-SK';
    utterance.rate = store.getSnapshot().playback.rate;

    // Pick Slovak voice if available in system
    const voices = window.speechSynthesis.getVoices();
    const skVoice = voices.find((v) => v.lang.startsWith('sk') || v.lang.includes('SK'));
    if (skVoice) {
      utterance.voice = skVoice;
    }

    // Estimate duration: approx 15 chars per second
    const estimatedDuration = Math.max(5, text.length / 15);
    store.setPlayback({
      duration: estimatedDuration,
      currentTime: 0,
      isPlaying: true,
      isBuffering: false,
    });

    let startTime = Date.now();
    this.progressInterval = window.setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      store.setPlayback({
        currentTime: Math.min(estimatedDuration, elapsed),
      });
      if (elapsed >= estimatedDuration) {
        if (this.progressInterval) clearInterval(this.progressInterval);
      }
    }, 250);

    utterance.onend = () => {
      if (this.progressInterval) clearInterval(this.progressInterval);
      this.handleTrackEnded();
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      if (this.progressInterval) clearInterval(this.progressInterval);
      store.setPlayback({ isPlaying: false });
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  private fallbackPlayWithWebSpeech() {
    const { documentId, unitId } = store.getSnapshot().playback;
    if (!documentId || !unitId) return;
    const law = getLawById(documentId);
    const unit = law?.allUnits.find((u) => u.id === unitId);
    if (!unit) return;
    const text = `${unit.displayNumber} ${unit.title ? unit.title + '.' : ''} ${unit.fullText}`;
    this.playWithWebSpeech(normalizeSlovakLegalTextForTTS(text));
  }

  resume() {
    if (this.currentAudio && this.currentAudio.src) {
      this.currentAudio.play();
      store.setPlayback({ isPlaying: true });
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        store.setPlayback({ isPlaying: true });
      } else {
        const { documentId, unitId } = store.getSnapshot().playback;
        if (documentId && unitId) {
          this.playUnit(documentId, unitId);
        }
      }
    }
  }

  pause() {
    if (this.currentAudio && !this.currentAudio.paused) {
      this.currentAudio.pause();
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
    if (this.progressInterval) clearInterval(this.progressInterval);
    store.setPlayback({ isPlaying: false });
  }

  stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
    store.setPlayback({ isPlaying: false, currentTime: 0 });
  }

  seek(seconds: number) {
    if (this.currentAudio && this.currentAudio.duration) {
      this.currentAudio.currentTime = Math.max(0, Math.min(this.currentAudio.duration, seconds));
      store.setPlayback({ currentTime: this.currentAudio.currentTime });
    }
  }

  skip(secondsDelta: number) {
    if (this.currentAudio && this.currentAudio.duration) {
      const newTime = Math.max(0, Math.min(this.currentAudio.duration, this.currentAudio.currentTime + secondsDelta));
      this.currentAudio.currentTime = newTime;
      store.setPlayback({ currentTime: newTime });
    }
  }

  setRate(rate: number) {
    if (this.currentAudio) {
      this.currentAudio.playbackRate = rate;
    }
    store.setPlayback({ rate });
    store.updateSettings({ playbackRate: rate });
  }

  nextUnit() {
    const { documentId, unitId } = store.getSnapshot().playback;
    if (!documentId || !unitId) return;

    const law = getLawById(documentId);
    if (!law) return;

    const currentIndex = law.allUnits.findIndex((u) => u.id === unitId);
    if (currentIndex >= 0 && currentIndex < law.allUnits.length - 1) {
      const next = law.allUnits[currentIndex + 1];
      this.playUnit(documentId, next.id);
    }
  }

  prevUnit() {
    const { documentId, unitId } = store.getSnapshot().playback;
    if (!documentId || !unitId) return;

    const law = getLawById(documentId);
    if (!law) return;

    const currentIndex = law.allUnits.findIndex((u) => u.id === unitId);
    if (currentIndex > 0) {
      const prev = law.allUnits[currentIndex - 1];
      this.playUnit(documentId, prev.id);
    }
  }

  private handleTrackEnded() {
    store.setPlayback({ isPlaying: false, currentTime: 0 });
    const { autoPlayNext } = store.getSnapshot().playback;
    if (autoPlayNext) {
      this.nextUnit();
    }
  }

  private handleTimeUpdate() {
    if (this.currentAudio) {
      store.setPlayback({
        currentTime: this.currentAudio.currentTime,
        duration: this.currentAudio.duration || 0,
      });
    }
  }
}

export const audioPlayer = new AudioPlayerService();
