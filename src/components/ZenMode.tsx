import { useEffect } from "react";
import { Mode } from "../types";
import { Play, Pause, Minimize2, RotateCcw, Plus } from "lucide-react";
import AmbientPlayer from "./AmbientPlayer";

interface Props {
  mode: Mode;
  left: number;
  total: number;
  running: boolean;
  taskTitle?: string;
  onToggle: () => void;
  onReset: () => void;
  onAddTime: (secs: number) => void;
  onExit: () => void;
}

const R = 150;
const C = 2 * Math.PI * R;

export default function ZenMode({
  mode,
  left,
  total,
  running,
  taskTitle,
  onToggle,
  onReset,
  onAddTime,
  onExit,
}: Props) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onExit();
      }
      if (e.code === "Space") {
        e.preventDefault();
        onToggle();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onExit, onToggle]);

  const progress = Math.min(1, Math.max(0, 1 - left / total));
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  return (
    <div className={`zen-overlay ${mode}`}>
      <div className="zen-ambient-background" />

      {/* Top Bar */}
      <div className="zen-top-bar">
        <div className="zen-brand">
          <span className="zen-crown">👑</span>
          <span className="zen-logo-text">ADITYA KING · ZEN FLOW</span>
        </div>
        <button className="zen-exit-btn" onClick={onExit} title="Exit Zen Mode (Esc)">
          <Minimize2 size={18} />
          <span>Exit Zen</span>
        </button>
      </div>

      {/* Main Focus Area */}
      <div className="zen-center-content">
        <div className="zen-task-banner">
          {taskTitle ? (
            <span className="zen-task-title">🎯 Focusing on: {taskTitle}</span>
          ) : (
            <span className="zen-task-title muted">
              {mode === "focus" ? "Deep Focus Realm" : "Rejuvenation Sanctuary"}
            </span>
          )}
        </div>

        <div className="zen-dial-container">
          <svg viewBox="0 0 340 340" className="zen-dial-svg">
            <defs>
              <linearGradient id="zenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffd700" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#e4572e" />
              </linearGradient>
            </defs>
            <circle cx="170" cy="170" r={R} className="zen-track" />
            <circle
              cx="170"
              cy="170"
              r={R}
              className="zen-arc"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - progress)}
              stroke="url(#zenGradient)"
              transform="rotate(-90 170 170)"
            />
          </svg>
          <div className="zen-readout">
            <span className="zen-digits">
              {mm}:{ss}
            </span>
            <span className="zen-mode-badge">{mode === "focus" ? "CONQUEST" : "REST"}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="zen-controls">
          <button className="zen-ctrl-btn secondary" onClick={() => onAddTime(300)}>
            <Plus size={16} /> 5m
          </button>
          <button className="zen-ctrl-btn primary" onClick={onToggle}>
            {running ? <Pause size={24} /> : <Play size={24} />}
            <span>{running ? "Pause" : "Resume"}</span>
          </button>
          <button className="zen-ctrl-btn secondary" onClick={onReset} title="Reset">
            <RotateCcw size={18} />
          </button>
        </div>

        {/* Zen Ambient sound bar */}
        <div className="zen-sound-widget">
          <AmbientPlayer />
        </div>
      </div>

      <div className="zen-footer-creed">
        <span>“Mastery is achieved through stillness in action.” — Aditya King</span>
      </div>
    </div>
  );
}
