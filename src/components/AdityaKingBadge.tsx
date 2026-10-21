import { useState } from "react";
import { Crown, Sparkles, Award, Shield, Zap, X, Flame } from "lucide-react";
import { soundEngine } from "../utils/audio";
import confetti from "canvas-confetti";

interface Props {
  streak: number;
  todaySessions: number;
}

export default function AdityaKingBadge({ streak, todaySessions }: Props) {
  const [modalOpen, setModalOpen] = useState(false);

  // Calculate Royalty Level
  const totalScore = streak * 3 + todaySessions * 2;
  const rank =
    totalScore >= 30
      ? "Sovereign Emperor of Flow"
      : totalScore >= 15
      ? "Royal Archduke of Focus"
      : totalScore >= 6
      ? "Crown Knight of Discipline"
      : "Focus Knight Apprentice";

  const handleBadgeClick = () => {
    soundEngine.playChime("crystal", 0.6);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.15 },
      colors: ["#ffd700", "#ffaa00", "#ffffff", "#e4572e"]
    });
    setModalOpen(true);
  };

  return (
    <>
      <div
        className="aditya-king-badge"
        onClick={handleBadgeClick}
        role="button"
        tabIndex={0}
        title="Click to view Aditya King Royal Status"
        onKeyDown={(e) => e.key === "Enter" && handleBadgeClick()}
      >
        <div className="badge-glow-ring" />
        <div className="badge-inner">
          <div className="crown-container">
            <Crown className="crown-icon" size={20} />
            <Sparkles className="sparkle-icon" size={12} />
          </div>
          <div className="badge-text">
            <div className="badge-brand">
              <span className="brand-name">ADITYA KING</span>
              <span className="edition-tag">PRO EDITION</span>
            </div>
            <span className="badge-sub">✦ ROYAL FOCUS ✦</span>
          </div>
          <div className="badge-crest-star">
            <Flame size={14} className="streak-flame" />
            <span className="streak-num">{streak}d</span>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div
            className="royal-modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button
              className="modal-close-btn"
              onClick={() => setModalOpen(false)}
              aria-label="Close royal status modal"
            >
              <X size={18} />
            </button>

            <div className="royal-modal-header">
              <div className="royal-crown-avatar">
                <Crown size={38} className="royal-crown-svg" />
                <div className="avatar-shine" />
              </div>
              <h2 className="royal-title">ADITYA KING</h2>
              <span className="royal-subtitle">Supreme Focus Architect</span>
              <div className="royal-badge-pill">
                <Shield size={14} />
                <span>{rank}</span>
              </div>
            </div>

            <div className="royal-stats-grid">
              <div className="royal-stat-box">
                <Flame className="stat-icon flame" size={20} />
                <span className="stat-val">{streak} Days</span>
                <span className="stat-lbl">Conquest Streak</span>
              </div>
              <div className="royal-stat-box">
                <Zap className="stat-icon zap" size={20} />
                <span className="stat-val">{todaySessions}</span>
                <span className="stat-lbl">Today's Sessions</span>
              </div>
              <div className="royal-stat-box">
                <Award className="stat-icon award" size={20} />
                <span className="stat-val">Tier {Math.min(5, Math.floor(totalScore / 5) + 1)}</span>
                <span className="stat-lbl">Royalty Level</span>
              </div>
            </div>

            <div className="royal-decree-box">
              <span className="decree-quote">“Flow is not given; it is conquered through unrelenting focus.”</span>
              <span className="decree-sig">— Aditya King's Decree</span>
            </div>

            <div className="royal-actions">
              <button
                className="royal-gold-btn"
                onClick={() => {
                  soundEngine.playChime("bell", 0.7);
                  confetti({
                    particleCount: 80,
                    spread: 80,
                    origin: { y: 0.6 },
                    colors: ["#ffd700", "#f97316", "#38bdf8"]
                  });
                  setModalOpen(false);
                }}
              >
                Conquer Today's Goals
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
