import { useCallback, useEffect, useRef, useState } from "react";
import { Mode, TimerSettings } from "../types";
import { soundEngine } from "../utils/audio";

export function useTimer(
  settings: TimerSettings,
  onFinish: (mode: Mode) => void
) {
  const [mode, setMode] = useState<Mode>("focus");
  const [left, setLeft] = useState(settings.focusMinutes * 60);
  const [running, setRunning] = useState(false);
  const finishRef = useRef(onFinish);
  finishRef.current = onFinish;

  const getDuration = useCallback(
    (m: Mode) => {
      if (m === "focus") return settings.focusMinutes * 60;
      if (m === "shortBreak") return settings.shortBreakMinutes * 60;
      return settings.longBreakMinutes * 60;
    },
    [settings]
  );

  // Sync with duration updates when timer is not running and hasn't started
  useEffect(() => {
    if (!running) {
      setLeft(getDuration(mode));
    }
  }, [mode, getDuration, running]);

  // Tick timer
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  // Session completion
  useEffect(() => {
    if (left > 0) return;

    // Trigger audio chime
    if (settings.soundEnabled) {
      soundEngine.playChime(settings.soundType, settings.soundVolume);
    }

    const finishedMode = mode;
    finishRef.current(finishedMode);

    // Auto transition to next mode
    let next: Mode = "focus";
    let autoStart = false;

    if (finishedMode === "focus") {
      next = "shortBreak";
      autoStart = settings.autoStartBreaks;
    } else {
      next = "focus";
      autoStart = settings.autoStartFocus;
    }

    setMode(next);
    setLeft(getDuration(next));
    setRunning(autoStart);
  }, [left, mode, settings, getDuration]);

  // Update browser tab title
  useEffect(() => {
    const m = String(Math.floor(left / 60)).padStart(2, "0");
    const s = String(left % 60).padStart(2, "0");
    const modeLabel = mode === "focus" ? "🎯 Focus" : "☕ Break";
    document.title = running
      ? `${m}:${s} ${modeLabel} · FocusFlow`
      : "FocusFlow · Aditya King Edition";
  }, [left, running, mode]);

  const toggle = useCallback(() => {
    soundEngine.playClick();
    setRunning((r) => !r);
  }, []);

  const reset = useCallback(() => {
    soundEngine.playClick();
    setRunning(false);
    setLeft(getDuration(mode));
  }, [mode, getDuration]);

  const switchMode = useCallback(
    (m: Mode) => {
      soundEngine.playClick();
      setMode(m);
      setLeft(getDuration(m));
      setRunning(false);
    },
    [getDuration]
  );

  const addTime = useCallback((seconds: number) => {
    soundEngine.playClick();
    setLeft((s) => Math.max(60, s + seconds));
  }, []);

  return {
    mode,
    left,
    running,
    total: getDuration(mode),
    toggle,
    reset,
    switchMode,
    addTime,
  };
}
