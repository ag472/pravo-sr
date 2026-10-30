/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  SkipBack,
  SkipForward,
  Volume2,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Loader2,
  Bookmark,
  ExternalLink,
} from 'lucide-react';
import { usePlayback, useBookmarks, store } from '../store/lawStore';
import { audioPlayer } from '../services/audioPlayerService';

interface Props {
  onNavigateToLaw?: (docId: string, unitId: string) => void;
}

export const AudioPlayer: React.FC<Props> = ({ onNavigateToLaw }) => {
  const { playback } = usePlayback();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const [isSpeedMenuOpen, setIsSpeedMenuOpen] = useState(false);

  // If no track loaded, don't show player
  if (!playback.documentId || !playback.unitId) {
    return null;
  }

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  const progress =
    playback.duration > 0 ? (playback.currentTime / playback.duration) * 100 : 0;

  const speeds = [0.75, 1.0, 1.25, 1.5, 2.0];
  const bookmarked = isBookmarked(playback.documentId, playback.unitId);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    audioPlayer.seek(val);
  };

  const handleToggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (playback.documentId && playback.unitId) {
      toggleBookmark({
        documentId: playback.documentId,
        documentTitle: playback.documentTitle,
        documentActNumber: playback.documentActNumber,
        unitId: playback.unitId,
        unitDisplayNumber: playback.unitDisplayNumber,
        unitTitle: playback.unitTitle,
      });
    }
  };

  const handleTitleClick = () => {
    if (onNavigateToLaw && playback.documentId && playback.unitId) {
      onNavigateToLaw(playback.documentId, playback.unitId);
    }
  };

  return (
    <aside
      aria-label="Audio prehrávač legislatívy"
      className="fixed bottom-16 md:bottom-4 left-0 right-0 md:left-auto md:right-6 md:w-96 z-40 px-3 md:px-0 transition-all duration-300"
    >
      <div className="bg-slate-900/95 text-white backdrop-blur-md border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/10">
        {/* Top minimal progress bar */}
        <div className="w-full bg-slate-800 h-1 relative">
          <div
            className="bg-gradient-to-r from-amber-500 to-amber-300 h-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>

        {playback.isMinimized ? (
          // Minimized view
          <div className="p-3 flex items-center justify-between gap-3">
            <button
              onClick={handleTitleClick}
              className="flex items-center gap-2 text-left truncate flex-1 hover:text-amber-300 transition"
            >
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <div className="truncate">
                <span className="font-semibold text-xs text-amber-400">
                  {playback.unitDisplayNumber}
                </span>{' '}
                <span className="text-xs text-slate-300 truncate">
                  {playback.unitTitle || playback.documentTitle}
                </span>
              </div>
            </button>

            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  playback.isPlaying ? audioPlayer.pause() : audioPlayer.resume()
                }
                className="p-2 rounded-full bg-amber-500 text-slate-950 hover:bg-amber-400 transition"
                title={playback.isPlaying ? 'Pozastaviť' : 'Prehrať'}
              >
                {playback.isBuffering ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : playback.isPlaying ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </button>
              <button
                onClick={() => store.setPlayback({ isMinimized: false })}
                className="p-1.5 text-slate-400 hover:text-white"
                title="Rozbaliť prehrávač"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          // Full floating view
          <div className="p-4 space-y-3">
            {/* Header info */}
            <div className="flex items-start justify-between gap-2">
              <div
                onClick={handleTitleClick}
                className="cursor-pointer group flex-1 min-w-0"
                title="Prejsť na paragraf v čítačke"
              >
                <div className="flex items-center gap-1.5 text-[11px] text-amber-400/90 font-medium uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="truncate">{playback.documentTitle}</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition truncate mt-0.5">
                  {playback.unitDisplayNumber} {playback.unitTitle && `• ${playback.unitTitle}`}
                </h4>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={handleToggleBookmark}
                  className={`p-1.5 rounded-lg transition ${
                    bookmarked ? 'text-amber-400' : 'text-slate-400 hover:text-white'
                  }`}
                  title={bookmarked ? 'Odstrániť zo záložiek' : 'Uložiť paragraf do záložiek'}
                >
                  <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => store.setPlayback({ isMinimized: true })}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg"
                  title="Minimalizovať"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrubber slider & time labels */}
            <div className="space-y-1">
              <input
                type="range"
                min="0"
                max={playback.duration || 100}
                value={playback.currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>{formatTime(playback.currentTime)}</span>
                <span>{formatTime(playback.duration)}</span>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-between pt-1">
              {/* Playback Speed selector */}
              <div className="relative">
                <button
                  onClick={() => setIsSpeedMenuOpen(!isSpeedMenuOpen)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono font-medium text-amber-400 transition"
                  title="Rýchlosť prehrávania"
                >
                  {playback.rate}x
                </button>
                {isSpeedMenuOpen && (
                  <div className="absolute bottom-full mb-2 left-0 bg-slate-800 border border-slate-700 rounded-xl p-1 shadow-xl flex flex-col gap-0.5 z-50 min-w-[70px]">
                    {speeds.map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          audioPlayer.setRate(s);
                          setIsSpeedMenuOpen(false);
                        }}
                        className={`px-2 py-1 text-xs text-left rounded-lg transition font-mono ${
                          playback.rate === s
                            ? 'bg-amber-500 text-slate-950 font-bold'
                            : 'text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Main buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => audioPlayer.prevUnit()}
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
                  title="Predchádzajúci paragraf"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
                <button
                  onClick={() => audioPlayer.skip(-10)}
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
                  title="Späť 10 sekúnd"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={() =>
                    playback.isPlaying ? audioPlayer.pause() : audioPlayer.resume()
                  }
                  className="p-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 hover:from-amber-400 hover:to-amber-300 transition shadow-lg shadow-amber-500/20 active:scale-95"
                  title={playback.isPlaying ? 'Pozastaviť' : 'Prehrať'}
                >
                  {playback.isBuffering ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : playback.isPlaying ? (
                    <Pause className="w-5 h-5 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  )}
                </button>

                <button
                  onClick={() => audioPlayer.skip(10)}
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
                  title="Dopredu 10 sekúnd"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => audioPlayer.nextUnit()}
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
                  title="Nasledujúci paragraf"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* AI Voice status badge */}
              <div className="flex items-center gap-1 text-[10px] text-slate-400">
                <Volume2 className="w-3.5 h-3.5 text-amber-400/80" />
                <span className="hidden sm:inline">Hlas: Kore</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
