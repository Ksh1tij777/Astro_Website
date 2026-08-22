'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import './cli.css';

// The passphrase winners report to Mission Control. Change per event.
const WIN_CODE = 'VOYAGER//1977//CONTACT';

// Google Apps Script web-app URL that logs the winning team to a Sheet.
// Set NEXT_PUBLIC_LOG_URL in your env (Vercel) to your deployed script URL.
const LOG_URL = process.env.NEXT_PUBLIC_LOG_URL ?? '';

const DISC_ART = `
         .-""""""-.
       .'  .::::.  '.
      /  .::::::::.  \\
     |  :::: () ::::  |
     |  ':::::::::' . |
      \\  '::::::::'  /
       '.  ':::;'  .'
         '-......-'
     T H E   R E C O R D`;

interface TerminalLine {
  id: string;
  type: 'cmd' | 'text' | 'system' | 'success' | 'error' | 'warning' | 'banner';
  cmdText?: string;
  content?: string | React.ReactNode;
}

export default function CliPage() {
  const router = useRouter();
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [theme, setTheme] = useState<'cyan' | 'emerald' | 'amber' | 'violet'>('cyan');
  const [scanlines, setScanlines] = useState(true);
  const [currentTime, setCurrentTime] = useState('');
  const [won, setWon] = useState(false);
  const [awaitingTeam, setAwaitingTeam] = useState(false);
  const [logged, setLogged] = useState(false);

  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Live UTC Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Initial Welcome Banner and Question Prompt
  useEffect(() => {
    const initialLines: TerminalLine[] = [
      {
        id: 'banner',
        type: 'banner',
        content: `
    _   ____ _____ ____   ___  _   _  ___  __  __ __   __   ____ _     _   _ ____  
   / \\ / ___|_   _|  _ \\ / _ \\| \\ | |/ _ \\|  \\/  |\\ \\ / /  / ___| |   | | | |  _ \\ 
  / _ \\\\___ \\ | | | |_) | | | |  \\| | | | | |\\/| | \\ V /  | |   | |   | | | | |_) |
 / ___ \\___) || | |  _ <| |_| | |\\  | |_| | |  | |  | |   | |___| |___| |_| |  _ < 
/_/   \\_\\____/ |_| |_| \\_\\\\___/|_| \\_|\\___/|_|  |_|  |_|    \\____|_____|\\___/|____/ 
        `,
      },
      {
        id: 'question',
        type: 'system',
        content: 'Final transmission recovered. When asked what Grace was doing, what was the reply?',
      },
    ];

    setLines(initialLines);
  }, []);

  // Auto-scroll terminal to bottom
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [lines]);

  // A short ascending arpeggio synthesised live (no audio file needed) — the
  // "first contact" tones that play when the final answer is accepted.
  const playContactTone = () => {
    try {
      const AC =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      const ctx = new AC();
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51]; // C5 E5 G5 C6 E6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const t = ctx.currentTime + i * 0.16;
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.28, t + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.65);
      });
    } catch {
      /* audio not available — ignore */
    }
  };

  const runWinSequence = () => {
    playContactTone();
    const seq: TerminalLine[] = [
      { id: 'w1', type: 'system', content: '> TRANSMISSION VERIFIED' },
      { id: 'w2', type: 'text', content: '> cross-referencing pulsar map ............ OK' },
      { id: 'w3', type: 'text', content: '> reassembling golden record .............. OK' },
      { id: 'w4', type: 'text', content: '> decoding the sounds of earth ............ OK' },
      { id: 'w5', type: 'banner', content: DISC_ART },
      { id: 'w6', type: 'success', content: '> SIGNAL RESOLVED — FIRST CONTACT ESTABLISHED' },
      { id: 'w7', type: 'system', content: '> You listened when the others only looked away.' },
      { id: 'w8', type: 'system', content: '> Welcome to the Signal Corps.' },
      { id: 'w9', type: 'success', content: `> FINAL TRANSMISSION CODE:  ${WIN_CODE}` },
      { id: 'w10', type: 'text', content: '> Report this code to Mission Control to claim your place.' },
      { id: 'w11', type: 'system', content: '> Log your contact: type your TEAM NAME and press Enter.' },
    ];
    seq.forEach((line, i) => {
      setTimeout(() => setLines((prev) => [...prev, line]), 380 * (i + 1));
    });
    // After the reveal finishes, start listening for the team name.
    setTimeout(() => setAwaitingTeam(true), 380 * (seq.length + 1));
  };

  // Append the winning team + completion time to the Google Sheet.
  const logWinner = async (team: string) => {
    const finishedAt = new Date().toLocaleString();
    if (LOG_URL) {
      try {
        await fetch(LOG_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ team, time: finishedAt }),
        });
      } catch {
        /* fire-and-forget; the sheet timestamps on its side */
      }
    }
    setLines((prev) => [
      ...prev,
      {
        id: 'logged-' + Date.now(),
        type: 'success',
        content: `> CONTACT LOGGED — ${team} · ${finishedAt}`,
      },
    ]);
  };

  const handleCommand = (userAnswer: string) => {
    const rawInput = userAnswer;
    const trimmed = rawInput.trim();
    if (!trimmed) return;

    const cmdId = Date.now().toString();
    const userLine: TerminalLine = { id: cmdId, type: 'cmd', cmdText: rawInput };

    setHistory((prev) => [...prev, rawInput]);
    setHistoryIdx(-1);
    setInputVal('');

    const cmd = trimmed.toLowerCase().replace(/[.!?,]/g, '').replace(/\s+/g, ' ');
    const reply = (type: TerminalLine['type'], content: string) =>
      setLines((prev) => [...prev, userLine, { id: cmdId + '-out', type, content }]);

    // After winning, the next line typed is the team name → log it once.
    if (awaitingTeam && !logged) {
      setLines((prev) => [...prev, userLine]);
      setAwaitingTeam(false);
      setLogged(true);
      logWinner(trimmed);
      return;
    }

    // Utility / easter-egg commands
    switch (cmd) {
      case 'help':
        reply('text', 'commands:  help · sing · whoami · rocky · clear · exit');
        return;
      case 'clear':
        setLines([]);
        return;
      case 'sing':
        playContactTone();
        reply('text', '> ♪ contact tones replayed');
        return;
      case 'whoami':
        reply('text', won ? '> signal-corps operative' : '> anonymous listener');
        return;
      case 'rocky':
        reply('text', '> "question? ... good, good, good." 🎵');
        return;
      case 'exit':
        router.push('/');
        return;
    }

    const targetAnswer = 'i am having a moment';

    if (cmd === targetAnswer) {
      if (won) {
        reply('system', '> Contact already established.');
        return;
      }
      setWon(true);
      setLines((prev) => [...prev, userLine]);
      runWinSequence();
      return;
    }

    reply('error', 'Incorrect transmission message. Try again.');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = historyIdx < history.length - 1 ? historyIdx + 1 : historyIdx;
        setHistoryIdx(nextIdx);
        setInputVal(history[history.length - 1 - nextIdx] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx > 0) {
        const nextIdx = historyIdx - 1;
        setHistoryIdx(nextIdx);
        setInputVal(history[history.length - 1 - nextIdx] || '');
      } else if (historyIdx === 0) {
        setHistoryIdx(-1);
        setInputVal('');
      }
    }
  };

  const toggleTheme = () => {
    const themes: Array<'cyan' | 'emerald' | 'amber' | 'violet'> = ['cyan', 'emerald', 'amber', 'violet'];
    const nextTheme = themes[(themes.indexOf(theme) + 1) % themes.length];
    setTheme(nextTheme);
  };

  return (
    <div className="cli-page">
      <div className={`cli-window cli-window--${theme} ${scanlines ? 'cli-window--scanlines' : ''}`}>
        {/* Terminal Header */}
        <div className="cli-header">
          <div className="cli-header__controls">
            <span className="cli-dot cli-dot--close" onClick={() => router.push('/')} title="Close Terminal & Return Home" />
            <span className="cli-dot cli-dot--minimize" onClick={() => setLines([])} title="Clear Screen" />
            <span className="cli-dot cli-dot--maximize" onClick={toggleTheme} title="Cycle Accent Color" />
          </div>

          <div className="cli-header__title">
            <span className="material-symbols-outlined cli-header__title-icon" style={{ fontSize: 16 }}>
              terminal
            </span>
            <span>voyager@world-tree:~ (LNMIIT Astro Core)</span>
          </div>

          <div className="cli-header__tools">
            <button
              type="button"
              className={`cli-tool-btn ${scanlines ? 'active' : ''}`}
              onClick={() => setScanlines((v) => !v)}
              title="Toggle CRT Scanlines Effect"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
                grid_on
              </span>
              CRT
            </button>
            <button
              type="button"
              className="cli-tool-btn"
              onClick={toggleTheme}
              title="Change Glow Theme"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
                palette
              </span>
              {theme.toUpperCase()}
            </button>
            <button
              type="button"
              className="cli-tool-btn"
              onClick={() => router.push('/')}
              title="Exit CLI to Landing Page"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
                logout
              </span>
              Exit
            </button>
          </div>
        </div>

        {/* Terminal Output Area */}
        <div className="cli-body" ref={bodyRef} onClick={() => inputRef.current?.focus()}>
          {lines.map((item) => {
            if (item.type === 'banner') {
              return (
                <div key={item.id} className="cli-banner">
                  {item.content}
                </div>
              );
            }
            if (item.type === 'cmd') {
              return (
                <div key={item.id} className="cli-line">
                  <div className="cli-line__prompt-row">
                    <span className="cli-prompt-user">voyager@world-tree</span>
                    <span style={{ color: '#64748b' }}>:</span>
                    <span className="cli-prompt-path">~</span>
                    <span className="cli-prompt-char">$</span>
                    <span className="cli-line__cmd">{item.cmdText}</span>
                  </div>
                </div>
              );
            }
            return (
              <div key={item.id} className={`cli-line__output cli-line__output--${item.type}`}>
                {item.content}
              </div>
            );
          })}

          {/* Active Prompt Row */}
          <form className="cli-input-form" onSubmit={(e) => e.preventDefault()}>
            <div className="cli-line__prompt-row">
              <span className="cli-prompt-user">voyager@world-tree</span>
              <span style={{ color: '#64748b' }}>:</span>
              <span className="cli-prompt-path">~</span>
              <span className="cli-prompt-char">$</span>
            </div>
            <input
              ref={inputRef}
              type="text"
              className="cli-input"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              spellCheck={false}
              autoComplete="off"
            />
          </form>
        </div>

        {/* Terminal Status Footer */}
        <div className="cli-footer">
          <div className="cli-status-info" style={{ width: '100%', justifyContent: 'space-between' }}>
            <span className="cli-status-badge">
              <span className="coord-modal__pulse" style={{ width: 5, height: 5 }} />
              ONLINE
            </span>
            <span>{currentTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
