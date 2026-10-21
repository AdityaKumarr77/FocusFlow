// Synthesized audio engine using Web Audio API (zero external assets required)

class SoundEngine {
  private ctx: AudioContext | null = null;
  private ambientSource: AudioNode | null = null;
  private ambientGain: GainNode | null = null;
  private ambientType: string | null = null;

  private getContext(): AudioContext {
    if (!this.ctx || this.ctx.state === "closed") {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play subtle UI click
  playClick(volume = 0.2) {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(volume * 0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Audio autoplay restrictions might prevent sound before user gesture
    }
  }

  // Play royal completion chime
  playChime(type: "crystal" | "bell" | "marimba" | "bowl" = "crystal", volume = 0.7) {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      if (type === "crystal") {
        const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + idx * 0.12);
          
          gain.gain.setValueAtTime(0, now + idx * 0.12);
          gain.gain.linearRampToValueAtTime(volume * 0.25, now + idx * 0.12 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 1.2);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.12);
          osc.stop(now + idx * 0.12 + 1.3);
        });
      } else if (type === "bell") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(880, now); // A5
        gain.gain.setValueAtTime(volume * 0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 1.9);
      } else if (type === "marimba") {
        const freqs = [440, 554.37, 659.25];
        freqs.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + i * 0.08);
          gain.gain.setValueAtTime(volume * 0.35, now + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.08);
          osc.stop(now + i * 0.08 + 0.45);
        });
      } else {
        // Tibetan Bowl
        const fundamental = 261.63; // C4
        [1, 2.76, 5.4].forEach((ratio, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(fundamental * ratio, now);
          gain.gain.setValueAtTime(volume * (0.3 / (i + 1)), now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 3.1);
        });
      }
    } catch {
      // Audio error suppressed
    }
  }

  // Ambient sound generator (Rain, Brown Noise, Binaural Beats, Waves)
  startAmbient(sound: "rain" | "brown" | "waves" | "binaural", volume = 0.3) {
    try {
      this.stopAmbient();
      const ctx = this.getContext();
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(Math.max(0.01, volume * 0.25), ctx.currentTime);
      gain.connect(ctx.destination);
      this.ambientGain = gain;
      this.ambientType = sound;

      if (sound === "binaural") {
        // 40Hz Gamma Focus frequency modulation
        const oscLeft = ctx.createOscillator();
        const oscRight = ctx.createOscillator();
        const merger = ctx.createChannelMerger(2);

        oscLeft.type = "sine";
        oscLeft.frequency.value = 200; // Left ear: 200Hz
        oscRight.type = "sine";
        oscRight.frequency.value = 240; // Right ear: 240Hz (40Hz gamma beat difference)

        oscLeft.connect(merger, 0, 0);
        oscRight.connect(merger, 0, 1);
        merger.connect(gain);

        oscLeft.start();
        oscRight.start();
        this.ambientSource = merger;
      } else {
        // Synthesize white / brown noise via audio buffer
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);

        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          if (sound === "brown") {
            output[i] = (lastOut + 0.02 * white) / 1.02;
            lastOut = output[i];
            output[i] *= 3.5; // Gain compensation
          } else {
            output[i] = white;
          }
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        if (sound === "rain") {
          filter.type = "lowpass";
          filter.frequency.value = 1200;
        } else if (sound === "waves") {
          filter.type = "bandpass";
          filter.frequency.value = 450;
          filter.Q.value = 1.0;
          // LFO modulation to simulate ocean surf surge
          const lfo = ctx.createOscillator();
          const lfoGain = ctx.createGain();
          lfo.frequency.value = 0.12; // slow 8-second wave period
          lfoGain.gain.value = 350;
          lfo.connect(lfoGain);
          lfoGain.connect(filter.frequency);
          lfo.start();
        } else {
          filter.type = "lowpass";
          filter.frequency.value = 600;
        }

        whiteNoise.connect(filter);
        filter.connect(gain);
        whiteNoise.start();
        this.ambientSource = whiteNoise;
      }
    } catch {
      // Audio error suppressed
    }
  }

  setAmbientVolume(volume: number) {
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(Math.max(0, volume * 0.3), this.ctx.currentTime);
    }
  }

  stopAmbient() {
    if (this.ambientSource) {
      try {
        if ("stop" in this.ambientSource && typeof (this.ambientSource as AudioScheduledSourceNode).stop === "function") {
          (this.ambientSource as AudioScheduledSourceNode).stop();
        }
        this.ambientSource.disconnect();
      } catch {
        // ignored
      }
      this.ambientSource = null;
    }
    this.ambientType = null;
  }

  getCurrentAmbient() {
    return this.ambientType;
  }
}

export const soundEngine = new SoundEngine();
