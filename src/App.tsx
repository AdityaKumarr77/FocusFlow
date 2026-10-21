import { useCallback, useState, useEffect } from "react";
import Timer from "./components/Timer";
import TaskList from "./components/TaskList";
import AdityaKingBadge from "./components/AdityaKingBadge";
import AmbientPlayer from "./components/AmbientPlayer";
import SettingsModal from "./components/SettingsModal";
import StatsModal from "./components/StatsModal";
import ZenMode from "./components/ZenMode";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useTimer } from "./hooks/useTimer";
import { Mode, Task, TimerSettings, DailyStats, Theme } from "./types";
import { BarChart3, Settings as SettingsIcon, Crown } from "lucide-react";
import confetti from "canvas-confetti";

const DEFAULT_SETTINGS: TimerSettings = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  autoStartBreaks: true,
  autoStartFocus: false,
  soundEnabled: true,
  soundVolume: 0.7,
  soundType: "crystal",
};

const DEFAULT_STATS: DailyStats = {
  todaySessions: 0,
  todayMinutes: 0,
  streak: 1,
  lastActiveDate: new Date().toISOString().split("T")[0],
  history: {},
};

export default function App() {
  const [tasks, setTasks] = useLocalStorage<Task[]>("ff-tasks-v2", []);
  const [settings, setSettings] = useLocalStorage<TimerSettings>("ff-settings-v2", DEFAULT_SETTINGS);
  const [stats, setStats] = useLocalStorage<DailyStats>("ff-stats-v2", DEFAULT_STATS);
  const [theme, setTheme] = useLocalStorage<Theme>("ff-theme-v2", "royal-dark");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [zenMode, setZenMode] = useState(false);

  // Apply theme class to document body / root
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Handle daily streak update
  useEffect(() => {
    const todayKey = new Date().toISOString().split("T")[0];
    if (stats.lastActiveDate !== todayKey) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayKey = yesterday.toISOString().split("T")[0];

      const isConsecutive = stats.lastActiveDate === yesterdayKey;
      setStats((prev) => ({
        ...prev,
        todaySessions: 0,
        todayMinutes: 0,
        streak: isConsecutive ? prev.streak + 1 : 1,
        lastActiveDate: todayKey,
      }));
    }
  }, [stats.lastActiveDate, setStats]);

  const onFinish = useCallback(
    (mode: Mode) => {
      if (mode !== "focus") return;

      const todayKey = new Date().toISOString().split("T")[0];
      const sessionMinutes = settings.focusMinutes;

      // Celebrate focus completion
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.4 },
        colors: ["#ffd700", "#ff8800", "#38bdf8", "#10b981"],
      });

      // Update statistics
      setStats((prev) => {
        const currentToday = prev.todaySessions + 1;
        const currentMins = prev.todayMinutes + sessionMinutes;
        return {
          ...prev,
          todaySessions: currentToday,
          todayMinutes: currentMins,
          history: {
            ...prev.history,
            [todayKey]: (prev.history[todayKey] || 0) + 1,
          },
        };
      });

      // Update active task sessions
      setTasks((ts) =>
        ts.map((t) => (t.id === activeId ? { ...t, sessions: (t.sessions || 0) + 1 } : t))
      );
    },
    [activeId, settings.focusMinutes, setTasks, setStats]
  );

  const timer = useTimer(settings, onFinish);
  const activeTask = tasks.find((t) => t.id === activeId && !t.done);

  return (
    <div className={`app-wrapper theme-${theme}`}>
      <main className="app">
        {/* Navigation / Header */}
        <header className="app-header">
          <div className="brand-group">
            <div className="brand-logo-icon">
              <Crown size={22} className="logo-crown" />
            </div>
            <div>
              <div className="brand-title-row">
                <h1 className="brand-title">FocusFlow</h1>
                <span className="brand-edition-chip">Aditya King Edition</span>
              </div>
              <p className="brand-subtitle">
                Royal Pomodoro & Flow Architecture · Conquer distractions
              </p>
            </div>
          </div>

          <div className="header-actions">
            {/* Aditya King Royal Badge */}
            <AdityaKingBadge streak={stats.streak} todaySessions={stats.todaySessions} />

            <div className="nav-buttons-group">
              <button
                className="icon-action-btn"
                onClick={() => setStatsOpen(true)}
                title="View Analytics & Milestones"
                aria-label="View Analytics"
              >
                <BarChart3 size={18} />
                <span className="btn-label">Stats</span>
              </button>

              <button
                className="icon-action-btn"
                onClick={() => setSettingsOpen(true)}
                title="Open Settings & Themes"
                aria-label="Open Settings"
              >
                <SettingsIcon size={18} />
                <span className="btn-label">Settings</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Dashboard Layout */}
        <div className="layout">
          <div className="timer-column">
            <Timer
              mode={timer.mode}
              left={timer.left}
              total={timer.total}
              running={timer.running}
              taskTitle={timer.mode === "focus" ? activeTask?.title : undefined}
              onToggle={timer.toggle}
              onReset={timer.reset}
              onMode={timer.switchMode}
              onAddTime={timer.addTime}
              onEnterZen={() => setZenMode(true)}
            />

            {/* Generative Ambient Soundscape Generator */}
            <AmbientPlayer />
          </div>

          <div className="tasks-column">
            <TaskList
              tasks={tasks}
              activeId={activeId}
              onAdd={(newTask) =>
                setTasks((ts) => [
                  {
                    ...newTask,
                    id: crypto.randomUUID(),
                    sessions: 0,
                    createdAt: new Date().toISOString(),
                  },
                  ...ts,
                ])
              }
              onToggle={(id) =>
                setTasks((ts) =>
                  ts.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
                )
              }
              onRemove={(id) => {
                setTasks((ts) => ts.filter((t) => t.id !== id));
                if (id === activeId) setActiveId(null);
              }}
              onSelect={setActiveId}
              onClearCompleted={() =>
                setTasks((ts) => ts.filter((t) => !t.done))
              }
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="app-footer">
          <div className="footer-content">
            <span className="footer-quote">
              “Focus is the crown that makes ordinary moments majestic.”
            </span>
            <div className="footer-author-badge">
              <Crown size={14} className="gold-text" />
              <span>Created for Aditya King · Master of Flow</span>
            </div>
          </div>
        </footer>
      </main>

      {/* Modals & Zen Mode Overlay */}
      {settingsOpen && (
        <SettingsModal
          settings={settings}
          theme={theme}
          onUpdateSettings={setSettings}
          onChangeTheme={setTheme}
          onClose={() => setSettingsOpen(false)}
        />
      )}

      {statsOpen && (
        <StatsModal
          stats={stats}
          tasks={tasks}
          onClose={() => setStatsOpen(false)}
        />
      )}

      {zenMode && (
        <ZenMode
          mode={timer.mode}
          left={timer.left}
          total={timer.total}
          running={timer.running}
          taskTitle={timer.mode === "focus" ? activeTask?.title : undefined}
          onToggle={timer.toggle}
          onReset={timer.reset}
          onAddTime={timer.addTime}
          onExit={() => setZenMode(false)}
        />
      )}
    </div>
  );
}
