import { Mode } from "../types";
import { Play, Pause, RotateCcw, Plus, Maximize2, SkipForward } from "lucide-react";

interface Props {
  mode: Mode;
  left: number;
  total: number;
  running: boolean;
  taskTitle?: string;
  onToggle: () => void;
  onReset: () => void;
  onMode: (m: Mode) => void;
  onAddTime: (seconds: number) => void;
  onEnterZen: () => void;
}

const R = 115;
const C = 2 * Math.PI * R;

export default function Timer({
  mode,
  left,
  total,
  running,
  taskTitle,
  onToggle,
  onReset,
  onMode,
  onAddTime,
  onEnterZen,
}: Props) {
  const progress = Math.min(1, Math.max(0, 1 - left / total));
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  const modeLabels: Record<Mode, string> = {
    focus: "Focus",
    shortBreak: "Short Break",
    longBreak: "Long Break",
  };

  return (
    <section className={`timer-card ${mode}`} aria-label="Timer">
      <div className="timer-top-bar">
        <div className="modes-segmented" role="tablist">
          {(["focus", "shortBreak", "longBreak"] as Mode[]).map((m) => (
            <button
              key={m}
              role="tab"
              aria-selected={mode === m}
              className={`mode-tab ${mode === m ? "active" : ""}`}
              onClick={() => onMode(m)}
            >
              {modeLabels[m]}
            </button>
          ))}
        </div>

        <button
          className="zen-mode-btn"
          onClick={onEnterZen}
          title="Fullscreen Zen Mode"
          aria-label="Enter Zen Mode"
        >
          <Maximize2 size={16} />
        </button>
      </div>

      <div className="dial-wrapper">
        <div className={`dial ${running ? "pulsing" : ""}`}>
          <svg viewBox="0 0 280 280" aria-hidden="true" className="dial-svg">
            <defs>
              <linearGradient id="focusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffd700" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#e4572e" />
              </linearGradient>
              <linearGradient id="breakGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#2dd4bf" />
              </linearGradient>
              <filter id="dialGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Dial Ticks */}
            {Array.from({ length: 60 }).map((_, i) => (
              <line
                key={i}
                x1="140"
                y1="8"
                x2="140"
                y2={i % 5 === 0 ? 20 : 13}
                transform={`rotate(${i * 6} 140 140)`}
                className={`dial-tick ${i % 5 === 0 ? "major" : ""}`}
              />
            ))}

            {/* Background Track */}
            <circle cx="140" cy="140" r={R} className="dial-track" />

            {/* Progress Arc */}
            <circle
              cx="140"
              cy="140"
              r={R}
              className="dial-arc"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - progress)}
              stroke={`url(#${mode === "focus" ? "focusGradient" : "breakGradient"})`}
              transform="rotate(-90 140 140)"
              filter="url(#dialGlow)"
            />
          </svg>

          <div className="dial-readout" role="timer">
            <span className="dial-time">
              {mm}:{ss}
            </span>
            <div className="dial-status">
              {taskTitle ? (
                <div className="active-task-pill" title={taskTitle}>
                  <span className="dot" />
                  <span className="text">{taskTitle}</span>
                </div>
              ) : (
                <span className="hint-text">
                  {mode === "focus"
                    ? "Pick a task or enter the flow"
                    : "Step away & rejuvenate"}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick extension buttons */}
      <div className="quick-time-adjustments">
        <button
          className="time-adjust-pill"
          onClick={() => onAddTime(300)}
          title="Add 5 minutes to current session"
        >
          <Plus size={13} /> 5m
        </button>
        <button
          className="time-adjust-pill"
          onClick={() => onAddTime(60)}
          title="Add 1 minute to current session"
        >
          <Plus size={13} /> 1m
        </button>
        <button
          className="time-adjust-pill skip"
          onClick={() => onMode(mode === "focus" ? "shortBreak" : "focus")}
          title="Skip session"
        >
          <SkipForward size={13} /> Skip
        </button>
      </div>

      {/* Main Controls */}
      <div className="timer-controls">
        <button
          className="control-btn primary-toggle"
          onClick={onToggle}
          aria-label={running ? "Pause timer" : "Start timer"}
        >
          {running ? <Pause size={22} /> : <Play size={22} className="play-icon-offset" />}
          <span>{running ? "Pause" : left === total ? "Start Focus" : "Resume"}</span>
        </button>
        <button
          className="control-btn secondary-reset"
          onClick={onReset}
          aria-label="Reset timer"
          title="Reset session"
        >
          <RotateCcw size={18} />
          <span>Reset</span>
        </button>
      </div>
    </section>
  );
}
