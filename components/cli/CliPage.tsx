'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import './cli.css';

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
        content: 'What was End Of Transmission message transmitted to Earth?',
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

  const handleCommand = (userAnswer: string) => {
    const rawInput = userAnswer;
    const trimmed = rawInput.trim();
    if (!trimmed) return;

    const cmdId = Date.now().toString();
    const userLine: TerminalLine = {
      id: cmdId,
      type: 'cmd',
      cmdText: rawInput,
    };

    setHistory((prev) => [...prev, rawInput]);
    setHistoryIdx(-1);

    const cleanInput = trimmed.toLowerCase().replace(/\s+/g, ' ');
    const targetAnswer = 'astro tree is the world tree where it all happens';

    let resultLine: TerminalLine;

    if (cleanInput === targetAnswer) {
      resultLine = {
        id: cmdId + '-out',
        type: 'success',
        content: 'Congratulations!! Here your voyage begins now',
      };
    } else {
      resultLine = {
        id: cmdId + '-out',
        type: 'error',
        content: 'Incorrect transmission message. Try again.',
      };
    }

    setLines((prev) => [...prev, userLine, resultLine]);
    setInputVal('');
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
