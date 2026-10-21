import { useState, useEffect } from "react";
import { Volume2, VolumeX, CloudRain, Waves, Brain, Radio, Play, Pause } from "lucide-react";
import { soundEngine } from "../utils/audio";

type AmbientTrack = "rain" | "brown" | "waves" | "binaural";

export default function AmbientPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<AmbientTrack>("rain");
  const [volume, setVolume] = useState(0.35);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (isPlaying) {
      soundEngine.startAmbient(selectedTrack, isMuted ? 0 : volume);
    } else {
      soundEngine.stopAmbient();
    }
    return () => {
      soundEngine.stopAmbient();
    };
  }, [isPlaying, selectedTrack, isMuted]);

  useEffect(() => {
    soundEngine.setAmbientVolume(isMuted ? 0 : volume);
  }, [volume, isMuted]);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
    soundEngine.playClick();
  };

  const handleTrackChange = (track: AmbientTrack) => {
    setSelectedTrack(track);
    if (!isPlaying) {
      setIsPlaying(true);
    }
    soundEngine.playClick();
  };

  const tracks: { id: AmbientTrack; label: string; icon: typeof CloudRain }[] = [
    { id: "rain", label: "Soft Rain", icon: CloudRain },
    { id: "brown", label: "Deep Focus", icon: Brain },
    { id: "waves", label: "Ocean Surf", icon: Waves },
    { id: "binaural", label: "40Hz Gamma", icon: Radio },
  ];

  return (
    <div className="ambient-player-card">
      <div className="ambient-header">
        <div className="ambient-title">
          <span className="ambient-label">Ambient Soundscapes</span>
          {isPlaying && (
            <span className="live-pill">
              <span className="live-dot" /> LIVE
            </span>
          )}
        </div>
        <button
          className={`ambient-toggle-btn ${isPlaying ? "active" : ""}`}
          onClick={togglePlay}
          title={isPlaying ? "Pause Ambient Sound" : "Start Ambient Sound"}
        >
          {isPlaying ? <Pause size={15} /> : <Play size={15} />}
          <span>{isPlaying ? "Pause" : "Play"}</span>
        </button>
      </div>

      <div className="ambient-tracks">
        {tracks.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`ambient-track-pill ${selectedTrack === id ? "active" : ""}`}
            onClick={() => handleTrackChange(id)}
          >
            <Icon size={14} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="ambient-volume-row">
        <button
          className="mute-btn"
          onClick={() => setIsMuted((m) => !m)}
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted || volume === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={isMuted ? 0 : volume}
          onChange={(e) => {
            setVolume(parseFloat(e.target.value));
            if (isMuted) setIsMuted(false);
          }}
          className="volume-slider"
          aria-label="Ambient volume"
        />
        <span className="volume-percent">{Math.round((isMuted ? 0 : volume) * 100)}%</span>
      </div>
    </div>
  );
}
