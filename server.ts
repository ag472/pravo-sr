/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

// Shared server-side GoogleGenAI client with required User-Agent
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

/**
 * Normalizes Slovak legal jargon before text-to-speech.
 */
function normalizeSlovakLegalJargon(text: string): string {
  let res = text;
  // § symbols and numbers
  res = res.replace(/§\s*(\d+)/g, 'Paragraf $1');
  res = res.replace(/§/g, 'Paragraf');
  // odsek (ods.)
  res = res.replace(/\bods\.\s*(\d+)/gi, 'odsek $1');
  res = res.replace(/\bods\./gi, 'odsek');
  // písmeno (písm.)
  res = res.replace(/\bpísm\.\s*([a-z]\))/gi, 'písmeno $1');
  res = res.replace(/\bpísm\./gi, 'písmeno');
  // článok (čl.)
  res = res.replace(/\bčl\.\s*(\d+)/gi, 'článok $1');
  res = res.replace(/\bčl\./gi, 'článok');
  // Zbierka zákonov (Z. z. / Zb.)
  res = res.replace(/\bZ\.\s*z\./g, 'Zbierky zákonov');
  res = res.replace(/\bZb\./g, 'Zbierky zákonov');
  // skratky
  res = res.replace(/\bnapr\./gi, 'napríklad');
  res = res.replace(/\bt\.\s*j\./gi, 'to jest');
  res = res.replace(/\bč\.\s*(\d+)/gi, 'číslo $1');
  return res.trim();
}

/**
 * Backend TTS Endpoint
 * POST /api/tts
 * Body: { text: string, voice?: string }
 */
app.post('/api/tts', async (req: Request, res: Response): Promise<void> => {
  try {
    const { text, voice = 'Kore' } = req.body;

    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Text na syntézu je povinný.' });
      return;
    }

    const normalizedText = normalizeSlovakLegalJargon(text);

    // If Gemini API Key is available, synthesize speech using gemini-3.8-flash-lite-tts
    if (process.env.GEMINI_API_KEY && aiClient) {
      try {
        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash-lite-tts',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: normalizedText,
                  speechMetadata: {
                    style:
                      'Prečítaj po slovensky pokojným, prirodzeným hlasom skúseného rozhlasového hlásateľa, plynulo, spisovne a zrozumiteľne.',
                  },
                },
              ],
            },
          ],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: voice || 'Kore' },
              },
            },
          },
        });

        const base64Audio =
          response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

        if (base64Audio) {
          res.json({
            success: true,
            audioBase64: base64Audio,
            mimeType: 'audio/wav',
            normalizedText,
            source: 'gemini-tts',
          });
          return;
        }
      } catch (geminiError: any) {
        console.warn('Gemini TTS generation error, falling back to Web Speech:', geminiError?.message || geminiError);
      }
    }

    // Graceful fallback to client-side Web Speech synthesis with normalized Slovak legal text
    res.json({
      success: true,
      fallbackToWebSpeech: true,
      normalizedText,
      source: 'web-speech-fallback',
      message: 'AI TTS kľúč nie je nastavený alebo prekročil kvótu; prehrávanie pokračuje cez plynulú lokálnu syntézu reči.',
    });
  } catch (err: any) {
    console.error('TTS endpoint error:', err);
    res.status(500).json({
      error: 'Chyba pri generovaní hlasu.',
      details: err?.message,
    });
  }
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', app: 'Právo SR', timestamp: new Date().toISOString() });
});

// Setup Dev or Production serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    // Vite middleware in dev
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve dist static assets
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Právo SR] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
