export type Mode = "focus" | "shortBreak" | "longBreak";

export type Priority = "high" | "medium" | "low";

export type Category = "Work" | "Study" | "Code" | "Personal" | "Health";

export interface Task {
  id: string;
  title: string;
  done: boolean;
  sessions: number; // completed focus sessions spent on this task
  estimatedPomodoros: number;
  priority: Priority;
  category: Category;
  createdAt: string;
}

export interface TimerSettings {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  autoStartBreaks: boolean;
  autoStartFocus: boolean;
  soundEnabled: boolean;
  soundVolume: number;
  soundType: "crystal" | "bell" | "marimba" | "bowl";
}

export interface DailyStats {
  todaySessions: number;
  todayMinutes: number;
  streak: number;
  lastActiveDate: string;
  history: Record<string, number>; // date string -> sessions
}

export type Theme = "royal-dark" | "royal-gold" | "cyber-neon" | "light-lux";

