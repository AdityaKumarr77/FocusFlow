import { DailyStats, Task } from "../types";
import { X, Flame, Clock, CheckCircle2, TrendingUp, Trophy, Zap, Calendar } from "lucide-react";

interface Props {
  stats: DailyStats;
  tasks: Task[];
  onClose: () => void;
}

export default function StatsModal({ stats, tasks, onClose }: Props) {
  const completedTasks = tasks.filter((t) => t.done).length;
  const hours = Math.floor(stats.todayMinutes / 60);
  const minutes = stats.todayMinutes % 60;

  // Generate last 7 days keys
  const days: { label: string; dateKey: string; count: number }[] = [];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    const dayLabel = dayNames[d.getDay()];
    const count = stats.history[key] || (i === 0 ? stats.todaySessions : 0);
    days.push({ label: dayLabel, dateKey: key, count });
  }

  const maxCount = Math.max(...days.map((d) => d.count), 6);

  const achievements = [
    {
      title: "First Spark",
      desc: "Complete your first focus session",
      unlocked: stats.todaySessions > 0,
      icon: Zap,
    },
    {
      title: "Royal Rhythm",
      desc: "Reach a 3-day focus streak",
      unlocked: stats.streak >= 3,
      icon: Flame,
    },
    {
      title: "Task Slayer",
      desc: "Complete 5 or more tasks",
      unlocked: completedTasks >= 5,
      icon: CheckCircle2,
    },
    {
      title: "Centurion Focus",
      desc: "Log 100+ total focus minutes",
      unlocked: stats.todayMinutes >= 100,
      icon: Trophy,
    },
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="stats-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <div className="modal-title-wrap">
            <TrendingUp size={20} className="modal-title-icon" />
            <h3>Performance Analytics</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close analytics">
            <X size={18} />
          </button>
        </div>

        <div className="stats-body">
          {/* Key Metrics */}
          <div className="analytics-metrics-grid">
            <div className="metric-card">
              <div className="metric-icon-wrap clock">
                <Clock size={20} />
              </div>
              <div className="metric-data">
                <span className="metric-value">
                  {hours > 0 ? `${hours}h ` : ""}
                  {minutes}m
                </span>
                <span className="metric-label">Focus Time Today</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-wrap streak">
                <Flame size={20} />
              </div>
              <div className="metric-data">
                <span className="metric-value">{stats.streak} Days</span>
                <span className="metric-label">Current Streak</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-wrap tasks">
                <CheckCircle2 size={20} />
              </div>
              <div className="metric-data">
                <span className="metric-value">
                  {completedTasks} / {tasks.length}
                </span>
                <span className="metric-label">Tasks Completed</span>
              </div>
            </div>
          </div>

          {/* 7-day Bar Chart */}
          <div className="chart-section">
            <div className="chart-header">
              <h4>
                <Calendar size={16} /> 7-Day Session Activity
              </h4>
              <span className="chart-subtitle">Focus sessions per day</span>
            </div>
            <div className="bar-chart-container">
              {days.map((d, index) => {
                const heightPercent = Math.max(8, Math.round((d.count / maxCount) * 100));
                const isToday = index === 6;
                return (
                  <div key={d.dateKey} className="chart-bar-col">
                    <div className="bar-tooltip">{d.count}</div>
                    <div className="bar-track">
                      <div
                        className={`bar-fill ${isToday ? "today" : ""}`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className={`bar-label ${isToday ? "today-label" : ""}`}>{d.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Achievements */}
          <div className="achievements-section">
            <h4>Royal Badges & Milestones</h4>
            <div className="achievements-grid">
              {achievements.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className={`achievement-badge ${item.unlocked ? "unlocked" : "locked"}`}
                  >
                    <div className="achieve-icon">
                      <Icon size={18} />
                    </div>
                    <div className="achieve-info">
                      <span className="achieve-title">{item.title}</span>
                      <span className="achieve-desc">{item.desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
