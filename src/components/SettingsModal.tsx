import { TimerSettings, Theme } from "../types";
import { X, Bell, Sliders, Palette, Check } from "lucide-react";
import { soundEngine } from "../utils/audio";

interface Props {
  settings: TimerSettings;
  theme: Theme;
  onUpdateSettings: (newSettings: TimerSettings) => void;
  onChangeTheme: (theme: Theme) => void;
  onClose: () => void;
}

export default function SettingsModal({
  settings,
  theme,
  onUpdateSettings,
  onChangeTheme,
  onClose,
}: Props) {
  const handleTestSound = (type: TimerSettings["soundType"]) => {
    soundEngine.playChime(type, settings.soundVolume);
  };

  const themes: { id: Theme; name: string; color: string; desc: string }[] = [
    { id: "royal-dark", name: "Royal Obsidian", color: "#ffd700", desc: "Dark luxury with gleaming gold" },
    { id: "royal-gold", name: "King's Gold", color: "#f59e0b", desc: "Regal warm amber and champagne" },
    { id: "cyber-neon", name: "Cyber Neon", color: "#06b6d4", desc: "Deep dark with electric cyan" },
    { id: "light-lux", name: "Pearl Luxury", color: "#e4572e", desc: "Crisp modern light workspace" },
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="settings-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Sliders size={20} className="modal-title-icon" />
            <h3>Settings & Preferences</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close settings">
            <X size={18} />
          </button>
        </div>

        <div className="settings-body">
          {/* Durations */}
          <section className="settings-group">
            <h4>Timer Durations (minutes)</h4>
            <div className="durations-grid">
              <div className="duration-field">
                <label>Focus</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={settings.focusMinutes}
                  onChange={(e) =>
                    onUpdateSettings({
                      ...settings,
                      focusMinutes: Math.max(1, parseInt(e.target.value) || 25),
                    })
                  }
                />
              </div>
              <div className="duration-field">
                <label>Short Break</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={settings.shortBreakMinutes}
                  onChange={(e) =>
                    onUpdateSettings({
                      ...settings,
                      shortBreakMinutes: Math.max(1, parseInt(e.target.value) || 5),
                    })
                  }
                />
              </div>
              <div className="duration-field">
                <label>Long Break</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={settings.longBreakMinutes}
                  onChange={(e) =>
                    onUpdateSettings({
                      ...settings,
                      longBreakMinutes: Math.max(1, parseInt(e.target.value) || 15),
                    })
                  }
                />
              </div>
            </div>
          </section>

          {/* Automation switches */}
          <section className="settings-group">
            <h4>Automation</h4>
            <div className="toggle-row">
              <label htmlFor="auto-breaks">Auto-start Breaks</label>
              <input
                id="auto-breaks"
                type="checkbox"
                checked={settings.autoStartBreaks}
                onChange={(e) =>
                  onUpdateSettings({ ...settings, autoStartBreaks: e.target.checked })
                }
              />
            </div>
            <div className="toggle-row">
              <label htmlFor="auto-focus">Auto-start Focus Sessions</label>
              <input
                id="auto-focus"
                type="checkbox"
                checked={settings.autoStartFocus}
                onChange={(e) =>
                  onUpdateSettings({ ...settings, autoStartFocus: e.target.checked })
                }
              />
            </div>
          </section>

          {/* Sounds */}
          <section className="settings-group">
            <div className="group-header">
              <h4>Completion Chime</h4>
              <button
                className="test-sound-btn"
                onClick={() => handleTestSound(settings.soundType)}
                title="Preview Chime"
              >
                <Bell size={14} /> Test
              </button>
            </div>
            <div className="chime-options">
              {(["crystal", "bell", "marimba", "bowl"] as const).map((type) => (
                <button
                  key={type}
                  className={`chime-btn ${settings.soundType === type ? "active" : ""}`}
                  onClick={() => {
                    onUpdateSettings({ ...settings, soundType: type });
                    handleTestSound(type);
                  }}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </section>

          {/* Themes */}
          <section className="settings-group">
            <div className="group-header">
              <h4>
                <Palette size={16} /> Theme Palette
              </h4>
            </div>
            <div className="themes-grid">
              {themes.map((t) => (
                <button
                  key={t.id}
                  className={`theme-card ${theme === t.id ? "active" : ""}`}
                  onClick={() => onChangeTheme(t.id)}
                >
                  <div className="theme-color-dot" style={{ backgroundColor: t.color }} />
                  <div className="theme-meta">
                    <span className="theme-title">{t.name}</span>
                    <span className="theme-desc">{t.desc}</span>
                  </div>
                  {theme === t.id && <Check size={16} className="theme-checked" />}
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="modal-footer">
          <button className="primary-action-btn" onClick={onClose}>
            Save & Done
          </button>
        </div>
      </div>
    </div>
  );
}
