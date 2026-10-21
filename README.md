# 👑 FocusFlow · Aditya King Edition

A luxury, high-aesthetic Pomodoro Flow State & Productivity Architecture app built with React 18, TypeScript, Vite, and pure modern CSS.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple)](https://vitejs.dev/)

---

## ✨ Features

- **👑 Aditya King Royal Emblem**: Interactive metallic gold crown badge featuring streak counters, rank leveling (*Supreme Focus Architect*), and royal decrees.
- **⏱️ Glowing Neon Circular Dial**: Visual SVG countdown timer with radial progress gradients, interval ticks, and subtle breathing animations.
- **🧘 Fullscreen Zen Sanctuary Mode**: Minimalist distraction-free focus workspace with floating controls (press Zen button or `Esc` to toggle).
- **🌧️ Built-in Ambient Focus Generator**: 100% offline Web Audio API soundscapes (Soft Rain, Deep Focus Brown Noise, Ocean Surf, and 40Hz Binaural Gamma Beats).
- **🎯 Mission Board & Task Management**:
  - Priority indicators (High 🔥, Medium ⚡, Low 🌿)
  - Category tags (Work, Study, Code, Personal, Health)
  - Estimated Pomodoros vs actual (🍅 1/3)
  - Filter by status and category
  - Celebratory confetti bursts upon completion
- **📊 Performance Analytics & Milestones**: 7-day interactive session bar chart, total focus hours, streak tracking, and unlockable royal achievement badges.
- **🎨 4 Luxury Themes**: Royal Obsidian (Dark), King's Gold, Cyber Neon, and Pearl Luxury.
- **🔔 Synthesized Audio Chimes**: Crystal Arpeggio, Royal Bell, Marimba, and Tibetan Singing Bowl.
- **📱 Fully Responsive**: Synchronized layout, fluid typography, and touch controls optimized for mobile, tablet, and desktop screens.

---




## 🏛️ Project Architecture

```
src/
├── components/
│   ├── AdityaKingBadge.tsx   # Royal insignia & status modal
│   ├── AmbientPlayer.tsx     # Web Audio API ambient noise generator
│   ├── SettingsModal.tsx     # Custom durations, audio chimes, & themes
│   ├── StatsModal.tsx        # 7-day bar chart & achievement badges
│   ├── TaskList.tsx          # Task mission board with priorities & filters
│   ├── Timer.tsx             # Radial SVG dial with glow & quick controls
│   └── ZenMode.tsx           # Fullscreen distraction-free focus mode
├── hooks/
│   ├── useLocalStorage.ts    # Persistent reactive localStorage hook
│   └── useTimer.ts           # Pomodoro countdown engine & auto-advance
├── utils/
│   └── audio.ts              # Synthesized Web Audio API sound engine
├── types.ts                  # TypeScript interfaces and domain models
├── styles.css                # Luxury responsive CSS design system
├── App.tsx                   # Main stateful dashboard
└── main.tsx                  # React DOM entrypoint
```

---

## 📜 License
Crafted for **Aditya King**. Released under the [MIT License](LICENSE).
