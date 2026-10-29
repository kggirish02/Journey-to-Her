/**
 * ============================================================================
 * THE JOURNEY TO HER ❤️ - COMPLETE 3D BROWSER GAME ENGINE
 * Built with Three.js & Web Audio API
 * Features:
 *  - 3-Lane Infinite/Story Runner with real Finish Line
 *  - Cute stylized 3D Boy & Girl characters with procedural animations
 *  - Dynamic procedural environments: Lush Forest -> Broken Bridge -> Sunset Garden
 *  - Complete Web Audio API synthesizer for BGM & SFX (100% self-contained)
 *  - Integrated Generative AI Panoramic Art Backdrops
 *  - Responsive UI with HUD, Progress Tracker, Alerts & Victory Ending
 * ============================================================================
 */

(function () {
  'use strict';

  // --- AUDIO SYNTHESIZER ENGINE (Web Audio API) ---
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.bgmGain = null;
      this.sfxGain = null;
      this.masterGain = null;
      this.bgmMuted = false;
      this.sfxMuted = false;
      this.currentBgmType = null;
      this.bgmTimer = null;
      this.stepIndex = 0;
      // Dedicated Audio Player for YouTube Jailer 2 / Veera Veera Mass BGM
      this.bgmAudio = new Audio();
      const canWebm = this.bgmAudio.canPlayType('audio/webm; codecs="opus"') !== '';
      const canM4a = this.bgmAudio.canPlayType('audio/mp4') !== '';
      
      // Preferred source: WebM (Opus) -> M4A (AAC) -> WAV
      if (canWebm) {
        this.bgmAudio.src = 'assets/audio/jailer2_track.webm';
      } else if (canM4a) {
        this.bgmAudio.src = 'assets/audio/jailer2_track.m4a';
      } else {
        this.bgmAudio.src = 'assets/audio/jailer_bgm.wav';
      }

      this.bgmAudio.loop = true;
      this.bgmAudio.volume = 0.75;
      this.bgmAudio.preload = 'auto';

      // Fallback chain on load error
      this.bgmAudio.addEventListener('error', () => {
        if (this.bgmAudio.src.includes('.webm')) {
          this.bgmAudio.src = 'assets/audio/jailer2_track.m4a';
          this.bgmAudio.load();
        } else if (this.bgmAudio.src.includes('.m4a')) {
          this.bgmAudio.src = 'assets/audio/jailer_bgm.wav';
          this.bgmAudio.load();
        }
      });

      // Loop guarantee across all browsers
      this.bgmAudio.addEventListener('ended', () => {
        if (!this.bgmMuted && this.currentBgmType === 'jailer') {
          this.bgmAudio.currentTime = 0;
          this.bgmAudio.play().catch(() => {});
        }
      });

      // Dedicated Audio Player for YouTube Victory Love Song (Premada Oorali)
      this.victoryAudio = new Audio();
      if (canWebm) {
        this.victoryAudio.src = 'assets/audio/victory_love_track.webm';
      } else if (canM4a) {
        this.victoryAudio.src = 'assets/audio/victory_love_track.m4a';
      } else {
        this.victoryAudio.src = 'assets/audio/victory_love_track.webm';
      }
      this.victoryAudio.loop = true;
      this.victoryAudio.volume = 0.85;
      this.victoryAudio.preload = 'auto';

      this.victoryAudio.addEventListener('error', () => {
        if (this.victoryAudio.src.includes('.webm')) {
          this.victoryAudio.src = 'assets/audio/victory_love_track.m4a';
          this.victoryAudio.load();
        }
      });

      this.victoryAudio.addEventListener('ended', () => {
        if (!this.bgmMuted && this.currentBgmType === 'victory') {
          this.victoryAudio.currentTime = 0;
          this.victoryAudio.play().catch(() => {});
        }
      });

      // Dedicated Audio Player for YouTube Game Over / Fail Track (https://youtube.com/shorts/IA7f98LlimI)
      this.gameOverAudio = new Audio();
      if (canWebm) {
        this.gameOverAudio.src = 'assets/audio/gameover_track.webm';
      } else if (canM4a) {
        this.gameOverAudio.src = 'assets/audio/gameover_track.m4a';
      } else {
        this.gameOverAudio.src = 'assets/audio/gameover_track.webm';
      }
      this.gameOverAudio.loop = true;
      this.gameOverAudio.volume = 0.85;
      this.gameOverAudio.preload = 'auto';

      this.gameOverAudio.addEventListener('error', () => {
        if (this.gameOverAudio.src.includes('.webm')) {
          this.gameOverAudio.src = 'assets/audio/gameover_track.m4a';
          this.gameOverAudio.load();
        }
      });

      this.gameOverAudio.addEventListener('ended', () => {
        if (!this.bgmMuted && this.currentBgmType === 'gameover') {
          this.gameOverAudio.currentTime = 0;
          this.gameOverAudio.play().catch(() => {});
        }
      });

      this.usingAudioFile = false;
    }

    init() {
      if (this.ctx) return;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.bgmGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);
    }

    pauseBgm() {
      if (this.bgmAudio) this.bgmAudio.pause();
      if (this.victoryAudio) this.victoryAudio.pause();
      if (this.gameOverAudio) this.gameOverAudio.pause();
    }

    resume() {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      if (!this.bgmMuted) {
        if (this.currentBgmType === 'jailer' && this.bgmAudio && this.bgmAudio.paused) {
          this.bgmAudio.play().catch(() => {});
        } else if (this.currentBgmType === 'victory' && this.victoryAudio && this.victoryAudio.paused) {
          this.victoryAudio.play().catch(() => {});
        } else if (this.currentBgmType === 'gameover' && this.gameOverAudio && this.gameOverAudio.paused) {
          this.gameOverAudio.play().catch(() => {});
        }
      }
    }

    toggleBgm() {
      this.bgmMuted = !this.bgmMuted;
      if (this.bgmGain) {
        this.bgmGain.gain.setValueAtTime(this.bgmMuted ? 0 : 0.35, this.ctx ? this.ctx.currentTime : 0);
      }
      if (this.bgmAudio) {
        this.bgmAudio.muted = this.bgmMuted;
        if (!this.bgmMuted && this.currentBgmType === 'jailer') {
          this.bgmAudio.play().catch(() => {});
        }
      }
      if (this.victoryAudio) {
        this.victoryAudio.muted = this.bgmMuted;
        if (!this.bgmMuted && this.currentBgmType === 'victory') {
          this.victoryAudio.play().catch(() => {});
        }
      }
      if (this.gameOverAudio) {
        this.gameOverAudio.muted = this.bgmMuted;
        if (!this.bgmMuted && this.currentBgmType === 'gameover') {
          this.gameOverAudio.play().catch(() => {});
        }
      }
      return !this.bgmMuted;
    }

    toggleSfx() {
      this.sfxMuted = !this.sfxMuted;
      if (this.sfxGain) {
        this.sfxGain.gain.setValueAtTime(this.sfxMuted ? 0 : 0.5, this.ctx ? this.ctx.currentTime : 0);
      }
      return !this.sfxMuted;
    }

    // Play a synth note
    playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.3, detune = 0) {
      if (!this.ctx || this.sfxMuted) return;
      try {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        osc.detune.setValueAtTime(detune, this.ctx.currentTime);

        g.gain.setValueAtTime(gainVal, this.ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

        osc.connect(g);
        g.connect(this.sfxGain);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        // Audio error suppression
      }
    }

    // SFX: Golden Coin Chime
    playCoin() {
      if (!this.ctx || this.sfxMuted) return;
      const now = this.ctx.currentTime;
      [1046.5, 1318.51, 1567.98].forEach((f, i) => { // C6, E6, G6
        setTimeout(() => {
          this.playTone(f, 'triangle', 0.22, 0.4);
        }, i * 45);
      });
    }

    // SFX: Jump Whoosh
    playJump() {
      if (!this.ctx || this.sfxMuted) return;
      try {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(660, this.ctx.currentTime + 0.18);

        g.gain.setValueAtTime(0.3, this.ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);

        osc.connect(g);
        g.connect(this.sfxGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.22);
      } catch (e) {}
    }

    // SFX: Slide Swoosh
    playSlide() {
      if (!this.ctx || this.sfxMuted) return;
      try {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(380, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.25);

        g.gain.setValueAtTime(0.3, this.ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.28);

        osc.connect(g);
        g.connect(this.sfxGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.28);
      } catch (e) {}
    }

    // SFX: Obstacle Collision / Game Over
    playHit() {
      if (!this.ctx || this.sfxMuted) return;
      try {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(35, this.ctx.currentTime + 0.45);

        g.gain.setValueAtTime(0.45, this.ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.48);

        osc.connect(g);
        g.connect(this.sfxGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.48);
      } catch (e) {}
    }

    // SFX: Girl Calling Melody Chime
    playGirlCallingMelody() {
      if (!this.ctx || this.sfxMuted) return;
      [659.25, 783.99, 987.77, 1046.5, 1318.51].forEach((freq, idx) => {
        setTimeout(() => {
          this.playTone(freq, 'triangle', 0.28, 0.4);
        }, idx * 90);
      });
    }

    // SFX: Romantic Reunion & Celebration Fanfare (Joyful, triumphant)
    playCelebrationFanfare() {
      if (!this.ctx || this.sfxMuted) return;
      [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98].forEach((freq, idx) => {
        setTimeout(() => {
          this.playTone(freq, 'triangle', 0.4, 0.35);
        }, idx * 110);
      });
    }

    playProposalFanfare() {
      this.playCelebrationFanfare();
    }

    // Background Music (Plays YouTube running track without switching or interruption)
    playBgm(theme = 'jailer') {
      // If victory or gameover song was playing, stop it so running track starts fresh
      if (this.victoryAudio) {
        this.victoryAudio.pause();
        this.victoryAudio.currentTime = 0;
      }
      if (this.gameOverAudio) {
        this.gameOverAudio.pause();
        this.gameOverAudio.currentTime = 0;
      }

      // If user's YouTube running BGM is already actively playing, DO NOT interrupt, reset, or change it!
      if (this.currentBgmType === 'jailer' && this.bgmAudio && !this.bgmAudio.paused && !this.bgmMuted) {
        return;
      }
      if (this.bgmMuted) return;

      this.currentBgmType = 'jailer';
      this.stopBgmTimerOnly();

      // Play YouTube running audio file (assets/audio/jailer2_track.webm / m4a)
      if (this.bgmAudio) {
        this.bgmAudio.currentTime = 0;
        const playPromise = this.bgmAudio.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            this.usingAudioFile = true;
          }).catch(() => {
            // Only fallback to procedural synth if browser autoplay restricts audio file
            this.usingAudioFile = false;
            this.startProceduralJailerSynth('jailer');
          });
          return;
        }
      }

      this.startProceduralJailerSynth('jailer');
    }

    // Victory Love Song (Plays YouTube Love Song from https://youtu.be/PVOyIdRsPYo while hugging her)
    playVictoryBgm() {
      this.stopBgmTimerOnly();
      // Stop running and gameover tracks
      if (this.bgmAudio) {
        this.bgmAudio.pause();
        this.bgmAudio.currentTime = 0;
      }
      if (this.gameOverAudio) {
        this.gameOverAudio.pause();
        this.gameOverAudio.currentTime = 0;
      }
      this.currentBgmType = 'victory';

      // Play YouTube victory romantic song (assets/audio/victory_love_track.webm / m4a)
      if (this.victoryAudio && !this.bgmMuted) {
        this.victoryAudio.currentTime = 0;
        this.victoryAudio.volume = 0.85;
        const playPromise = this.victoryAudio.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            this.usingAudioFile = true;
          }).catch(() => {
            this.usingAudioFile = false;
            this.startProceduralJailerSynth('romantic');
          });
          return;
        }
      }

      this.startProceduralJailerSynth('romantic');
    }

    // Game Over / Fail BGM (Plays YouTube track from https://youtube.com/shorts/IA7f98LlimI when player fails or stops)
    playGameOverBgm() {
      this.stopBgmTimerOnly();
      // Stop running and victory tracks
      if (this.bgmAudio) {
        this.bgmAudio.pause();
        this.bgmAudio.currentTime = 0;
      }
      if (this.victoryAudio) {
        this.victoryAudio.pause();
        this.victoryAudio.currentTime = 0;
      }
      this.currentBgmType = 'gameover';

      if (this.gameOverAudio && !this.bgmMuted) {
        this.gameOverAudio.currentTime = 0;
        this.gameOverAudio.volume = 0.85;
        const playPromise = this.gameOverAudio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }
      }
    }

    startProceduralJailerSynth(theme) {
      if (!this.ctx) return;
      this.stopBgmTimerOnly();

      // Note frequencies (Hz) in D Minor (Jailer signature key)
      const N = {
        D2: 73.42, F2: 87.31, G2: 98.00, A2: 110.00, C3: 130.81, Cs3: 138.59,
        D3: 146.83, F3: 174.61, G3: 196.00, A3: 220.00,
        C4: 261.63, Cs4: 277.18, D4: 293.66, F4: 349.23, G4: 392.00, Gs4: 415.30, A4: 440.00,
        C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00,
        REST: 0
      };

      // 1. Jailer 2 Theme (Hukum - Thalaivar Mass BGM in D Minor)
      const melodyJailer = [
        N.D4, N.D4, N.D4, N.F4, N.G4, N.REST, N.F4, N.D4,
        N.D4, N.D4, N.D4, N.F4, N.G4, N.Gs4, N.A4, N.REST,
        N.A4, N.G4, N.F4, N.G4, N.F4, N.D4, N.C4, N.D4,
        N.D4, N.F4, N.G4, N.A4, N.C5, N.A4, N.G4, N.D4
      ];
      const bassJailer = [
        N.D2, N.D2, N.D2, N.F2, N.G2, N.D2, N.C3, N.Cs3,
        N.D2, N.D2, N.D2, N.F2, N.G2, N.D2, N.C3, N.Cs3
      ];

      // 2. Trouble in Middle / Broken Bridge
      const melodyDanger = [
        N.D4, N.REST, N.D4, N.F4, N.E4, N.D4, N.C4, N.D4,
        N.C4, N.REST, N.C4, N.D4, N.C4, N.A3, N.G3, N.A3,
        N.D4, N.F4, N.A4, N.G4, N.F4, N.E4, N.F4, N.D4,
        N.E4, N.C4, N.D4, N.A3, N.G3, N.F3, N.D3, N.REST
      ];
      const bassDanger = [
        N.D2, N.D2, N.D2, N.D2, N.G2, N.G2, N.A2, N.A2,
        N.D2, N.D2, N.F2, N.F2, N.G2, N.G2, N.A2, N.A2
      ];

      // 3. Romantic Reunion Melody (Sunset Beach Shore)
      const melodyRomantic = [
        N.C5, N.D5, N.A4, N.F4, N.G4, N.F4, N.D4, N.C4,
        N.D4, N.F4, N.G4, N.A4, N.G4, N.F4, N.E4, N.D4,
        N.F4, N.A4, N.C5, N.D5, N.F5, N.D5, N.C5, N.A4,
        N.G4, N.C5, N.A4, N.G4, N.F4, N.G4, N.D4, N.REST
      ];
      const bassRomantic = [
        N.D2, N.A2, N.F2, N.C3, N.G2, N.D3, N.A2, N.E3,
        N.F2, N.C3, N.G2, N.D3, N.G2, N.A2, N.D2, N.A2
      ];

      let activeMelody = melodyJailer;
      let activeBass = bassJailer;
      let noteInterval = 145; // 132 BPM eighth note interval

      if (theme === 'danger') {
        activeMelody = melodyDanger;
        activeBass = bassDanger;
        noteInterval = 125;
      } else if (theme === 'romantic') {
        activeMelody = melodyRomantic;
        activeBass = bassRomantic;
        noteInterval = 230;
      }

      const tick = () => {
        if (!this.ctx || this.bgmMuted || this.usingAudioFile) {
          this.bgmTimer = setTimeout(tick, noteInterval);
          return;
        }

        const melNote = activeMelody[this.stepIndex % activeMelody.length];
        const bassIndex = Math.floor(this.stepIndex / 2) % activeBass.length;
        const bassNote = activeBass[bassIndex];

        // Lead brass synth
        if (melNote > 0) {
          try {
            const osc = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            osc.type = theme === 'romantic' ? 'triangle' : 'sawtooth';
            osc.frequency.setValueAtTime(melNote, this.ctx.currentTime);

            g.gain.setValueAtTime(theme === 'romantic' ? 0.2 : 0.26, this.ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + (noteInterval / 1000) * 0.88);

            osc.connect(g);
            g.connect(this.bgmGain);
            osc.start();
            osc.stop(this.ctx.currentTime + (noteInterval / 1000) * 0.88);
          } catch (e) {}
        }

        // Bass 808 synth
        if (this.stepIndex % 2 === 0 && bassNote > 0) {
          try {
            const bOsc = this.ctx.createOscillator();
            const bG = this.ctx.createGain();
            bOsc.type = theme === 'romantic' ? 'triangle' : 'sawtooth';
            bOsc.frequency.setValueAtTime(bassNote, this.ctx.currentTime);

            bG.gain.setValueAtTime(0.25, this.ctx.currentTime);
            bG.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + (noteInterval / 1000) * 1.7);

            bOsc.connect(bG);
            bG.connect(this.bgmGain);
            bOsc.start();
            bOsc.stop(this.ctx.currentTime + (noteInterval / 1000) * 1.7);
          } catch (e) {}
        }

        this.stepIndex++;
        this.bgmTimer = setTimeout(tick, noteInterval);
      };

      this.bgmTimer = setTimeout(tick, 50);
    }

    stopBgmTimerOnly() {
      if (this.bgmTimer) {
        clearTimeout(this.bgmTimer);
        this.bgmTimer = null;
      }
    }

    stopBgm() {
      this.stopBgmTimerOnly();
      if (this.bgmAudio) {
        this.bgmAudio.pause();
        this.bgmAudio.currentTime = 0;
      }
      if (this.victoryAudio) {
        this.victoryAudio.pause();
        this.victoryAudio.currentTime = 0;
      }
      if (this.gameOverAudio) {
        this.gameOverAudio.pause();
        this.gameOverAudio.currentTime = 0;
      }
      this.usingAudioFile = false;
      this.currentBgmType = null;
    }
  }

  // --- DIFFICULTY SETTINGS ---
  const DIFFICULTY_SETTINGS = {
    easy: {
      id: 'easy',
      name: 'Easy Mode',
      badge: '🟢 Easy',
      color: '#4ade80',
      description: '🟢 Easy: Relaxed speed & wide gaps (1.0x Score)',
      speed: 15.0, // slower, relaxed pace
      jumpImpulse: 14.0, // generous jump
      slideDuration: 0.75, // forgiving slide window
      obstacleGapNormal: [30, 44], // wide gap between hurdles
      obstacleGapBridge: [24, 34],
      safeLaneChance: 0.65, // very open safe lane
      coinProbability: 0.85, // plenty of coins
      scoreMultiplier: 1.0,
      hitTolerance: 0.65 // smaller hitbox / forgiving near-misses
    },
    medium: {
      id: 'medium',
      name: 'Medium Mode',
      badge: '🟡 Medium',
      color: '#facc15',
      description: '🟡 Medium: Balanced speed & hurdles (1.5x Score)',
      speed: 19.0, // standard runner speed
      jumpImpulse: 13.5,
      slideDuration: 0.65,
      obstacleGapNormal: [22, 32],
      obstacleGapBridge: [15, 22],
      safeLaneChance: 0.45,
      coinProbability: 0.65,
      scoreMultiplier: 1.5,
      hitTolerance: 0.75
    },
    high: {
      id: 'high',
      name: 'High Level',
      badge: '🔴 High Level',
      color: '#f87171',
      description: '🔴 High Level: Fast sprint & dense hurdles (2.5x Score Bonus!)',
      speed: 25.0, // intense high speed sprint
      jumpImpulse: 13.8,
      slideDuration: 0.58,
      obstacleGapNormal: [14, 22], // tightly packed obstacles
      obstacleGapBridge: [10, 16],
      safeLaneChance: 0.25, // challenging multi-lane hurdle blocks
      coinProbability: 0.55,
      scoreMultiplier: 2.5,
      hitTolerance: 0.85 // precise hitboxes
    }
  };

  // --- THEME DEFINITIONS & PRESETS ---
  const THEME_CONFIG = {
    forest: {
      id: 'forest',
      name: 'Magical Forest',
      badge: '🌳 Magical Forest',
      tagline: 'Lush green valleys, emerald canopies & dancing fireflies',
      skyColor: 0x87ceeb,
      fogColor: 0x87ceeb,
      fogDensity: 0.011,
      ambientColor: 0xfff1e6,
      ambientIntensity: 0.75,
      sunColor: 0xfffaed,
      sunIntensity: 0.95,
      hemiSky: 0x87ceeb,
      hemiGround: 0x2d6a4f,
      roadColor: 0xc0a080,
      curbColor: 0xa8896c,
      grassColor: 0x2d6a4f,
      treeTrunkColor: 0x5c3d2e,
      foliageColor: 0x22c55e,
      flowerColors: [0xff4d6d, 0xffea00],
      riverColor: 0x1d4ed8,
      imagePath: 'assets/images/magical_forest_path.jpg',
      accentColor: '#4ade80',
      skyGradient: ['#0284c7', '#38bdf8', '#bae6fd']
    },
    sunset: {
      id: 'sunset',
      name: 'Golden Sunset',
      badge: '🌅 Golden Sunset',
      tagline: 'Warm terracotta stone, golden leaves & amber skies',
      skyColor: 0xf97316,
      fogColor: 0xf4a261,
      fogDensity: 0.010,
      ambientColor: 0xffdab9,
      ambientIntensity: 0.85,
      sunColor: 0xfb923c,
      sunIntensity: 1.15,
      hemiSky: 0xfb923c,
      hemiGround: 0x78350f,
      roadColor: 0xd4a373,
      curbColor: 0xa76b3f,
      grassColor: 0x606c38,
      treeTrunkColor: 0x4a2810,
      foliageColor: 0xf97316,
      flowerColors: [0xfbbf24, 0xf97316],
      riverColor: 0xea580c,
      imagePath: 'assets/images/golden_sunset_garden.jpg',
      accentColor: '#fb923c',
      skyGradient: ['#431407', '#9a3412', '#ea580c', '#fde047']
    },
    destination: {
      id: 'destination',
      name: 'Twilight Garden',
      badge: '🌸 Twilight Garden',
      tagline: 'Mystic lilac meadows, cherry blossom blooms & soft twilight',
      skyColor: 0x7e22ce,
      fogColor: 0xa855f7,
      fogDensity: 0.010,
      ambientColor: 0xf3e8ff,
      ambientIntensity: 0.80,
      sunColor: 0xe879f9,
      sunIntensity: 1.0,
      hemiSky: 0xc084fc,
      hemiGround: 0x3b1c4e,
      roadColor: 0xd8b4e2,
      curbColor: 0x9d7a96,
      grassColor: 0x3b1c4e,
      treeTrunkColor: 0x2e1065,
      foliageColor: 0xf472b6,
      flowerColors: [0xf472b6, 0xe879f9],
      riverColor: 0x6366f1,
      imagePath: 'assets/images/fantasy_destination_scene.jpg',
      accentColor: '#f472b6',
      skyGradient: ['#1e1b4b', '#581c87', '#a21caf', '#f472b6']
    },
    beach: {
      id: 'beach',
      name: 'Sunset Beach',
      badge: '🌊 Sunset Beach',
      tagline: 'Warm ocean breezes, sandy coastal dunes & glowing waves',
      skyColor: 0x0284c7,
      fogColor: 0x38bdf8,
      fogDensity: 0.009,
      ambientColor: 0xffeedd,
      ambientIntensity: 0.85,
      sunColor: 0xfb7185,
      sunIntensity: 1.1,
      hemiSky: 0x38bdf8,
      hemiGround: 0xd97706,
      roadColor: 0xf5deb3,
      curbColor: 0xd4a373,
      grassColor: 0xe9c46a,
      treeTrunkColor: 0x78350f,
      foliageColor: 0x10b981,
      flowerColors: [0xfb7185, 0x38bdf8],
      riverColor: 0x06b6d4,
      imagePath: 'assets/images/sunset_beach_backdrop.jpg',
      accentColor: '#38bdf8',
      skyGradient: ['#0c4a6e', '#0284c7', '#38bdf8', '#fb7185']
    }
  };

  // --- GAME CONSTANTS ---
  const LANES = [-3.0, 0.0, 3.0]; // Left, Center, Right lanes
  const TOTAL_DISTANCE = 500; // Finish line at Z = -500
  const BASE_SPEED = 19.0; // units/sec
  const JUMP_IMPULSE = 13.5;
  const GRAVITY = -34.0;
  const SLIDE_DURATION = 0.65; // seconds

  // --- MAIN GAME APPLICATION CLASS ---
  class JourneyGame {
    constructor() {
      this.container = document.getElementById('game-container');
      this.sound = new SoundEngine();

      // State machine
      this.state = 'START'; // 'START' | 'PLAYING' | 'PAUSED' | 'GAMEOVER' | 'VICTORY' | 'CUTSCENE'
      this.currentTheme = 'forest'; // 'forest' | 'sunset' | 'destination' | 'beach'
      this.currentDifficulty = 'medium'; // 'easy' | 'medium' | 'high'

      // Player physical status
      this.currentLane = 1; // Center lane
      this.targetLaneX = LANES[1];
      this.playerX = LANES[1];
      this.playerY = 0;
      this.playerZ = 0;
      this.velocityY = 0;
      this.isGrounded = true;
      this.isJumping = false;
      this.isSliding = false;
      this.slideTimer = 0;

      // Game progression stats
      this.score = 0;
      this.coins = 0;
      this.distance = 0;
      this.gameStartTime = 0;
      this.elapsedTime = 0;

      // Track sections & objects
      this.coinsPool = [];
      this.obstaclesPool = [];
      this.sceneryPool = [];
      this.activeTrackSegments = [];
      this.particles = [];

      // Alerts status
      this.dangerAlertShown = false;
      this.almostThereAlertShown = false;
      this.girlCalloutShown = false;
      this.girlCalledVoice = false;

      this.alertBanner = null;
      this.hugTimer = 0;

      // Three.js instances
      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.clock = new THREE.Clock();

      // Models & Atmosphere
      this.boyModel = null;
      this.boyBackpack = null;
      this.girlModel = null;
      this.destinationGazebo = null;
      this.skyCylinder = null;
      this.ambientLight = null;
      this.sunLight = null;
      this.hemiLight = null;
      this.selectedTheme = 'forest';

      // Touch Device Detection & Mobile Control Setup
      this.isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);

      // Adaptive Camera Parameters for Portrait Mobile Screens
      this.cameraBaseZ = 7.5;
      this.cameraBaseY = 4.2;
      this.cameraFollowX = 0.6;

      // Shared theme-adaptive materials for track, ground, foliage, and water
      this.trackMaterials = {
        road: new THREE.MeshLambertMaterial({ color: 0xc0a080 }),
        curb: new THREE.MeshLambertMaterial({ color: 0xa8896c }),
        grass: new THREE.MeshLambertMaterial({ color: 0x2d6a4f }),
        treeTrunk: new THREE.MeshLambertMaterial({ color: 0x5c3d2e }),
        foliage: new THREE.MeshLambertMaterial({ color: 0x22c55e }),
        river: new THREE.MeshLambertMaterial({ color: 0x1d4ed8, transparent: true, opacity: 0.85 }),
        bridge: new THREE.MeshLambertMaterial({ color: 0x5c4033 }),
        post: new THREE.MeshLambertMaterial({ color: 0x3d2817 }),
        flower1: new THREE.MeshLambertMaterial({ color: 0xff4d6d }),
        flower2: new THREE.MeshLambertMaterial({ color: 0xffea00 })
      };

      // Animation parameters
      this.runCycle = 0;

      // UI elements
      this.dom = {
        screenStart: document.getElementById('screen-start'),
        screenPause: document.getElementById('screen-pause'),
        screenGameOver: document.getElementById('screen-gameover'),
        screenVictory: document.getElementById('screen-victory'),
        modalAiInfo: document.getElementById('modal-ai-info'),
        hud: document.getElementById('game-hud'),
        hudControls: document.getElementById('hud-controls-hint'),
        alertBanner: document.getElementById('alert-banner'),
        alertTitle: document.getElementById('alert-title'),
        alertSubtitle: document.getElementById('alert-subtitle'),
        alertIcon: document.getElementById('alert-icon'),
        girlCallout: document.getElementById('girl-callout'),
        hugCallout: document.getElementById('hug-callout'),
        proposalCallout: document.getElementById('hug-callout'),
        floatingScores: document.getElementById('floating-scores'),
        hudScore: document.getElementById('hud-score'),
        hudCoins: document.getElementById('hud-coins'),
        distanceText: document.getElementById('distance-text'),
        phaseBadge: document.getElementById('journey-phase-text'),
        progressFill: document.getElementById('progress-fill'),
        boyIcon: document.getElementById('progress-boy-icon'),
        audioIcon: document.getElementById('audio-icon'),
        sfxIcon: document.getElementById('sfx-icon'),
        // Pause screen
        pauseCoins: document.getElementById('pause-coins'),
        pauseScore: document.getElementById('pause-score'),
        pauseProgress: document.getElementById('pause-progress'),
        // Game Over screen
        gameoverCoins: document.getElementById('gameover-coins'),
        gameoverScore: document.getElementById('gameover-score'),
        gameoverDistance: document.getElementById('gameover-distance'),
        // Victory screen
        victoryCoins: document.getElementById('victory-coins'),
        victoryScore: document.getElementById('victory-score'),
        victoryTime: document.getElementById('victory-time'),
        // Difficulty UI
        hudDiffBadge: document.getElementById('hud-diff-badge'),
        diffDescription: document.getElementById('diff-description'),
        gameoverDiffText: document.getElementById('gameover-diff-text'),
        victoryDiffText: document.getElementById('victory-diff-text'),
        btnSwitchEasy: document.getElementById('btn-switch-easy'),
        // Mobile Touch Elements
        mobileControls: document.getElementById('mobile-touch-controls'),
        btnTouchLeft: document.getElementById('btn-touch-left'),
        btnTouchRight: document.getElementById('btn-touch-right'),
        btnTouchJump: document.getElementById('btn-touch-jump'),
        btnTouchSlide: document.getElementById('btn-touch-slide')
      };

      this.initThree();
      this.buildBoyCharacter();
      this.buildDestinationScene();
      this.setupSkyDome();
      this.generateInitialTrack();
      this.initEvents();
      this.setTheme('forest');
      this.setDifficulty('medium');
      this.animate = this.animate.bind(this);
      requestAnimationFrame(this.animate);
    }

    // ========================================================================
    // THREE.JS INITIALIZATION
    // ========================================================================
    initThree() {
      // Scene
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x87ceeb);
      this.scene.fog = new THREE.FogExp2(0x87ceeb, 0.012);

      // Camera
      const aspect = window.innerWidth / window.innerHeight;
      this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 800);
      this.camera.position.set(0, 4.2, 7.5);
      this.camera.lookAt(0, 1.5, -2);

      // WebGL Renderer
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.container.appendChild(this.renderer.domElement);

      // Apply initial adaptive camera viewport for portrait / landscape
      this.updateCameraViewport();

      // Lighting
      this.ambientLight = new THREE.AmbientLight(0xfff1e6, 0.7);
      this.scene.add(this.ambientLight);

      this.sunLight = new THREE.DirectionalLight(0xfffaed, 0.9);
      this.sunLight.position.set(20, 40, 20);
      this.sunLight.castShadow = true;
      this.sunLight.shadow.mapSize.width = 1024;
      this.sunLight.shadow.mapSize.height = 1024;
      this.sunLight.shadow.camera.near = 0.5;
      this.sunLight.shadow.camera.far = 150;
      this.sunLight.shadow.camera.left = -25;
      this.sunLight.shadow.camera.right = 25;
      this.sunLight.shadow.camera.top = 25;
      this.sunLight.shadow.camera.bottom = -25;
      this.scene.add(this.sunLight);

      this.hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x3d9970, 0.4);
      this.scene.add(this.hemiLight);
    }

    // Dynamic camera viewport adaptation for Android mobile phones and desktop
    updateCameraViewport() {
      if (!this.camera || !this.renderer) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const aspect = width / height;
      this.camera.aspect = aspect;

      // Adapt field of view and camera follow offset on portrait mobile screens so all 3 lanes (-3.0 to +3.0) stay on screen
      if (aspect < 0.6) {
        // Tall phone portrait (e.g. 9:19.5, 9:20 Android screens)
        this.camera.fov = 78;
        this.cameraBaseZ = 9.8;
        this.cameraBaseY = 5.2;
        this.cameraFollowX = 0.35;
      } else if (aspect < 0.9) {
        // Standard phone portrait / tablet portrait
        this.camera.fov = 70;
        this.cameraBaseZ = 8.6;
        this.cameraBaseY = 4.8;
        this.cameraFollowX = 0.45;
      } else {
        // Landscape / Desktop
        this.camera.fov = 60;
        this.cameraBaseZ = 7.5;
        this.cameraBaseY = 4.2;
        this.cameraFollowX = 0.6;
      }

      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    }

    // Generate high-resolution procedural panoramic sky texture (works 100% offline & on file:// protocol)
    createProceduralSkyTexture(themeKey) {
      const cfg = THEME_CONFIG[themeKey] || THEME_CONFIG.forest;
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      // 1. Sky backdrop vertical gradient
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      const stops = cfg.skyGradient || ['#0284c7', '#38bdf8', '#bae6fd'];
      stops.forEach((color, idx) => {
        grad.addColorStop(idx / (stops.length - 1), color);
      });
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Celestial and atmospheric features
      if (themeKey === 'sunset') {
        // Radiant golden sunset orb at horizon
        const sunGrad = ctx.createRadialGradient(512, 330, 20, 512, 330, 220);
        sunGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        sunGrad.addColorStop(0.2, 'rgba(254, 240, 138, 0.95)');
        sunGrad.addColorStop(0.5, 'rgba(249, 115, 22, 0.7)');
        sunGrad.addColorStop(1, 'rgba(234, 88, 12, 0)');
        ctx.fillStyle = sunGrad;
        ctx.beginPath();
        ctx.arc(512, 330, 220, 0, Math.PI * 2);
        ctx.fill();

        // Sunset clouds
        ctx.fillStyle = 'rgba(251, 146, 60, 0.35)';
        ctx.beginPath();
        ctx.ellipse(300, 250, 180, 26, 0, 0, Math.PI * 2);
        ctx.ellipse(740, 280, 220, 30, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (themeKey === 'destination') {
        // Twilight starfield
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        for (let i = 0; i < 75; i++) {
          const sx = (i * 97) % canvas.width;
          const sy = (i * 47) % 240;
          const sr = 1 + (i % 3) * 0.7;
          ctx.beginPath();
          ctx.arc(sx, sy, sr, 0, Math.PI * 2);
          ctx.fill();
        }
        // Mystic lilac twilight glow & crescent
        const glowGrad = ctx.createRadialGradient(680, 150, 10, 680, 150, 160);
        glowGrad.addColorStop(0, 'rgba(244, 114, 182, 0.95)');
        glowGrad.addColorStop(0.4, 'rgba(192, 132, 252, 0.55)');
        glowGrad.addColorStop(1, 'rgba(126, 34, 206, 0)');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(680, 150, 160, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(680, 150, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#581c87';
        ctx.beginPath();
        ctx.arc(672, 145, 19, 0, Math.PI * 2);
        ctx.fill();
      } else if (themeKey === 'beach') {
        // Coastal sunset sun & sea horizon
        const sunGrad = ctx.createRadialGradient(512, 290, 15, 512, 290, 190);
        sunGrad.addColorStop(0, 'rgba(255, 255, 240, 1)');
        sunGrad.addColorStop(0.3, 'rgba(251, 146, 60, 0.85)');
        sunGrad.addColorStop(0.7, 'rgba(244, 63, 94, 0.45)');
        sunGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');
        ctx.fillStyle = sunGrad;
        ctx.beginPath();
        ctx.arc(512, 290, 190, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(254, 205, 211, 0.35)';
        ctx.fillRect(0, 360, canvas.width, 14);
      } else {
        // Magical Forest Morning Sun & Soft Clouds
        const sunGrad = ctx.createRadialGradient(380, 170, 15, 380, 170, 170);
        sunGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        sunGrad.addColorStop(0.3, 'rgba(254, 240, 138, 0.7)');
        sunGrad.addColorStop(0.7, 'rgba(56, 189, 248, 0.3)');
        sunGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');
        ctx.fillStyle = sunGrad;
        ctx.beginPath();
        ctx.arc(380, 170, 170, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.beginPath();
        ctx.ellipse(240, 200, 140, 22, 0, 0, Math.PI * 2);
        ctx.ellipse(680, 170, 160, 25, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Distant rolling mountain silhouette along horizon
      ctx.fillStyle = 'rgba(15, 23, 42, 0.28)';
      ctx.beginPath();
      ctx.moveTo(0, 380);
      for (let x = 0; x <= canvas.width; x += 32) {
        const y = 355 + Math.sin(x * 0.018) * 22 + Math.cos(x * 0.009) * 16;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fill();

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.repeat.set(3, 1);
      return texture;
    }

    // Panoramic Horizon Backdrop mapped with procedural gradients & AI Art Backdrops
    setupSkyDome() {
      const panoGeo = new THREE.CylinderGeometry(280, 280, 140, 32, 1, true);
      const initialTex = this.createProceduralSkyTexture(this.currentTheme);
      const panoMat = new THREE.MeshBasicMaterial({
        map: initialTex,
        side: THREE.BackSide,
        fog: false,
        color: 0xffffff
      });
      this.skyCylinder = new THREE.Mesh(panoGeo, panoMat);
      this.skyCylinder.position.set(0, 20, -150);
      this.scene.add(this.skyCylinder);

      // Attempt to upgrade to high-res AI Generated Art backdrop if accessible
      this.loadSkyArtImage(this.currentTheme);
    }

    // Load AI Art backdrop with fallback guarantee
    loadSkyArtImage(themeName) {
      const cfg = THEME_CONFIG[themeName];
      if (!cfg || !this.skyCylinder) return;

      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(
        cfg.imagePath,
        (texture) => {
          if (this.currentTheme === themeName && this.skyCylinder && this.skyCylinder.material) {
            texture.wrapS = THREE.RepeatWrapping;
            texture.repeat.set(3, 1);
            this.skyCylinder.material.map = texture;
            this.skyCylinder.material.color.setHex(0xffffff);
            this.skyCylinder.material.needsUpdate = true;
          }
        },
        undefined,
        () => {
          // Keep rich procedural canvas texture active if local file protocol blocks image XHR
          if (this.currentTheme === themeName && this.skyCylinder && this.skyCylinder.material) {
            const fallbackTex = this.createProceduralSkyTexture(themeName);
            this.skyCylinder.material.map = fallbackTex;
            this.skyCylinder.material.color.setHex(0xffffff);
            this.skyCylinder.material.needsUpdate = true;
          }
        }
      );
    }

    // Switch Environment Art Theme (Complete 3D World Transformation)
    setTheme(themeName) {
      const cfg = THEME_CONFIG[themeName] || THEME_CONFIG.forest;
      this.currentTheme = themeName;
      this.selectedTheme = themeName;

      // 1. Immediately apply procedural sky texture (0ms latency, zero CORS dependency)
      if (this.skyCylinder && this.skyCylinder.material) {
        const canvasTex = this.createProceduralSkyTexture(themeName);
        this.skyCylinder.material.map = canvasTex;
        this.skyCylinder.material.color.setHex(0xffffff);
        this.skyCylinder.material.needsUpdate = true;
      }

      // 2. Load high-res AI generated backdrop image asynchronously
      this.loadSkyArtImage(themeName);

      // 3. Update scene fog & background
      if (this.scene) {
        if (this.scene.fog) {
          this.scene.fog.color.setHex(cfg.fogColor);
          if (this.scene.fog.density !== undefined) this.scene.fog.density = cfg.fogDensity || 0.011;
        }
        if (this.scene.background) {
          this.scene.background.setHex(cfg.skyColor);
        }
      }

      // 4. Update scene illumination (ambient, sunlight, and hemispheric light)
      if (this.ambientLight) {
        this.ambientLight.color.setHex(cfg.ambientColor);
        this.ambientLight.intensity = cfg.ambientIntensity;
      }
      if (this.sunLight) {
        this.sunLight.color.setHex(cfg.sunColor);
        this.sunLight.intensity = cfg.sunIntensity;
      }
      if (this.hemiLight) {
        this.hemiLight.color.setHex(cfg.hemiSky);
        this.hemiLight.groundColor.setHex(cfg.hemiGround);
      }

      // 5. Update track materials instantly (road, curbs, grass, trees, river, flowers)
      if (this.trackMaterials) {
        this.trackMaterials.road.color.setHex(cfg.roadColor);
        this.trackMaterials.curb.color.setHex(cfg.curbColor);
        this.trackMaterials.grass.color.setHex(cfg.grassColor);
        this.trackMaterials.treeTrunk.color.setHex(cfg.treeTrunkColor);
        this.trackMaterials.foliage.color.setHex(cfg.foliageColor);
        this.trackMaterials.river.color.setHex(cfg.riverColor);
        if (cfg.flowerColors && this.trackMaterials.flower1 && this.trackMaterials.flower2) {
          this.trackMaterials.flower1.color.setHex(cfg.flowerColors[0]);
          this.trackMaterials.flower2.color.setHex(cfg.flowerColors[1]);
        }
      }

      // 6. Synchronize UI theme badges & buttons across Start Screen and Pause Screen
      document.body.setAttribute('data-theme', themeName);
      document.querySelectorAll('.theme-chip').forEach((btn) => {
        btn.classList.toggle('active', btn.getAttribute('data-theme') === themeName);
      });

      if (this.dom.phaseBadge) {
        this.dom.phaseBadge.textContent = cfg.badge;
        this.dom.phaseBadge.style.color = cfg.accentColor;
      }
    }

    setDifficulty(diffKey) {
      if (!DIFFICULTY_SETTINGS[diffKey]) return;
      this.currentDifficulty = diffKey;
      const cfg = DIFFICULTY_SETTINGS[diffKey];

      // Update all difficulty buttons across start, pause, and game over
      document.querySelectorAll('.diff-chip').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.diff === diffKey);
      });

      if (this.dom.diffDescription) {
        this.dom.diffDescription.textContent = cfg.description;
      }

      if (this.dom.hudDiffBadge) {
        this.dom.hudDiffBadge.textContent = cfg.badge;
        this.dom.hudDiffBadge.style.color = cfg.color;
        if (this.dom.hudDiffBadge.parentElement) {
          this.dom.hudDiffBadge.parentElement.style.borderColor = `${cfg.color}66`;
        }
      }

      if (this.dom.gameoverDiffText) {
        this.dom.gameoverDiffText.textContent = `${cfg.badge} (${cfg.scoreMultiplier}x Score)`;
        if (this.dom.btnSwitchEasy) {
          this.dom.btnSwitchEasy.classList.toggle('hidden', diffKey === 'easy');
        }
      }

      if (this.dom.victoryDiffText) {
        this.dom.victoryDiffText.textContent = `🏆 Conquered on ${cfg.badge} with ${cfg.scoreMultiplier}x Score Multiplier!`;
      }

      // Re-populate world obstacles and coins if in Start, Paused, or Game Over state
      if (this.state === 'START' || this.state === 'PAUSED' || this.state === 'GAMEOVER') {
        this.clearCoinsAndObstacles();
        this.populateCoinsAndObstacles();
      }
    }

    clearCoinsAndObstacles() {
      if (this.coinsPool) {
        this.coinsPool.forEach(c => {
          if (c.mesh && c.mesh.parent) {
            c.mesh.parent.remove(c.mesh);
          } else if (c.mesh && this.scene) {
            this.scene.remove(c.mesh);
          }
        });
        this.coinsPool = [];
      }
      if (this.obstaclesPool) {
        this.obstaclesPool.forEach(o => {
          if (o.mesh && o.mesh.parent) {
            o.mesh.parent.remove(o.mesh);
          } else if (o.mesh && this.scene) {
            this.scene.remove(o.mesh);
          }
        });
        this.obstaclesPool = [];
      }
    }

    // ========================================================================
    // CHARACTER MODELING (Realistic Stylized Human Boy & Girl)
    // ========================================================================
    buildBoyCharacter() {
      this.boyModel = new THREE.Group();

      // Materials with realistic PBR shading (Matching romantic beach photo)
      const skinMat = new THREE.MeshStandardMaterial({ color: 0xf3cfb3, roughness: 0.65, metalness: 0.05 });
      const hairMat = new THREE.MeshStandardMaterial({ color: 0x241711, roughness: 0.8, metalness: 0.05 }); // Tousled dark hair
      const jacketMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.6, metalness: 0.05 }); // White casual beach shirt
      const shirtMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.65 }); // White inner
      const pantsMat = new THREE.MeshStandardMaterial({ color: 0x4f7fa8, roughness: 0.75 }); // Blue beach shorts
      const shoeSoleMat = new THREE.MeshStandardMaterial({ color: 0xf3cfb3, roughness: 0.65 });
      const shoeBodyMat = new THREE.MeshStandardMaterial({ color: 0xf3cfb3, roughness: 0.65 }); // Barefoot on wet sand
      const backpackMat = new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.6 });
      const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111827 });
      const whiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.95, roughness: 0.15 });
      const diamondMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.2, roughness: 0.05, transparent: true, opacity: 0.9 });
      const velvetBoxMat = new THREE.MeshStandardMaterial({ color: 0x881337, roughness: 0.9 });

      // 1. Head & Facial Features (Human Proportions)
      this.boyHead = new THREE.Group();
      this.boyHead.position.y = 1.48;

      // Realistic Cranium & Jaw
      const cranium = new THREE.Mesh(new THREE.SphereGeometry(0.18, 20, 20), skinMat);
      cranium.scale.set(0.88, 1.15, 0.96);
      cranium.castShadow = true;
      this.boyHead.add(cranium);

      // Human Ears
      const earGeo = new THREE.BoxGeometry(0.035, 0.08, 0.05);
      const earL = new THREE.Mesh(earGeo, skinMat);
      earL.position.set(-0.17, 0, -0.02);
      const earR = earL.clone();
      earR.position.x = 0.17;
      this.boyHead.add(earL, earR);

      // Nose Ridge
      const nose = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.08, 6), skinMat);
      nose.rotation.x = -Math.PI / 2;
      nose.position.set(0, -0.01, 0.18);
      this.boyHead.add(nose);

      // Eyes
      const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.028, 12, 12), eyeMat);
      eyeL.position.set(-0.065, 0.03, 0.165);
      const eyeR = eyeL.clone();
      eyeR.position.x = 0.065;

      const hiL = new THREE.Mesh(new THREE.SphereGeometry(0.009, 8, 8), whiteMat);
      hiL.position.set(-0.06, 0.04, 0.185);
      const hiR = hiL.clone();
      hiR.position.x = 0.07;
      this.boyHead.add(eyeL, eyeR, hiL, hiR);

      // Eyebrows
      const browGeo = new THREE.BoxGeometry(0.06, 0.012, 0.015);
      const browL = new THREE.Mesh(browGeo, hairMat);
      browL.position.set(-0.065, 0.075, 0.17);
      browL.rotation.z = -0.1;
      const browR = browL.clone();
      browR.position.x = 0.065;
      browR.rotation.z = 0.1;
      this.boyHead.add(browL, browR);

      // Styled Modern Haircut (Volume, Parting & Bangs)
      const hairMain = new THREE.Mesh(new THREE.SphereGeometry(0.19, 16, 16), hairMat);
      hairMain.scale.set(0.92, 1.18, 1.0);
      hairMain.position.set(0, 0.05, -0.02);
      this.boyHead.add(hairMain);

      // Hair Bangs swept to side
      for (let i = -2; i <= 2; i++) {
        const bang = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.14, 6), hairMat);
        bang.rotation.x = 0.4;
        bang.rotation.z = i * 0.15;
        bang.position.set(i * 0.045, 0.15, 0.14);
        this.boyHead.add(bang);
      }

      this.boyModel.add(this.boyHead);

      // 2. Neck
      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.09, 0.18, 14), skinMat);
      neck.position.y = 1.34;
      neck.castShadow = true;
      this.boyModel.add(neck);

      // 3. Torso (Athletic build with Jacket & Shirt)
      this.boyTorso = new THREE.Group();
      this.boyTorso.position.y = 1.02;

      // Chest
      const chest = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.38, 0.22), jacketMat);
      chest.position.y = 0.14;
      chest.castShadow = true;

      // Red shirt collar
      const collar = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.08, 0.23), shirtMat);
      collar.position.set(0, 0.28, 0.01);

      // Waist & Belt
      const waist = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.22, 0.20), jacketMat);
      waist.position.y = -0.12;

      const belt = new THREE.Mesh(new THREE.BoxGeometry(0.39, 0.05, 0.21), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
      belt.position.y = -0.18;
      const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.05, 0.02), goldMat);
      buckle.position.set(0, -0.18, 0.11);

      this.boyTorso.add(chest, collar, waist, belt, buckle);
      this.boyModel.add(this.boyTorso);

      // Backpack (removable during beach embrace)
      this.boyBackpack = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.34, 0.15), backpackMat);
      this.boyBackpack.position.set(0, 1.12, -0.16);
      this.boyBackpack.castShadow = true;
      this.boyModel.add(this.boyBackpack);

      // 4. Arms (Segmented with Elbows & Hands)
      // Left Arm
      this.boyLeftArm = new THREE.Group();
      this.boyLeftArm.position.set(-0.27, 1.25, 0);

      const upperArmL = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.32, 10), jacketMat);
      upperArmL.position.y = -0.16;
      upperArmL.castShadow = true;
      this.boyLeftArm.add(upperArmL);

      this.boyLeftForearm = new THREE.Group();
      this.boyLeftForearm.position.set(0, -0.32, 0);

      const foreArmL = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.045, 0.28, 10), jacketMat);
      foreArmL.position.y = -0.14;
      foreArmL.castShadow = true;

      const handL = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.08, 0.035), skinMat);
      handL.position.y = -0.31;
      this.boyLeftForearm.add(foreArmL, handL);
      this.boyLeftArm.add(this.boyLeftForearm);
      this.boyModel.add(this.boyLeftArm);

      // Right Arm (Articulated for running, warm hug & lifting embrace)
      this.boyRightArm = new THREE.Group();
      this.boyRightArm.position.set(0.27, 1.25, 0);

      const upperArmR = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.32, 10), jacketMat);
      upperArmR.position.y = -0.16;
      upperArmR.castShadow = true;
      this.boyRightArm.add(upperArmR);

      this.boyRightForearm = new THREE.Group();
      this.boyRightForearm.position.set(0, -0.32, 0);

      const foreArmR = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.045, 0.28, 10), jacketMat);
      foreArmR.position.y = -0.14;
      foreArmR.castShadow = true;

      const handR = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.08, 0.035), skinMat);
      handR.position.y = -0.31;
      this.boyRightForearm.add(foreArmR, handR);

      this.boyRingBox = null; // No proposal ring - arms free for warm hug and lifting celebration!

      this.boyRightArm.add(this.boyRightForearm);
      this.boyModel.add(this.boyRightArm);

      // 5. Legs: Blue Beach Shorts, Bare Calves & Bare Feet on Sand (Matching Photo)
      // Left Leg
      this.boyLeftLeg = new THREE.Group();
      this.boyLeftLeg.position.set(-0.13, 0.76, 0);

      const thighL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.068, 0.42, 12), pantsMat);
      thighL.position.y = -0.21;
      thighL.castShadow = true;
      this.boyLeftLeg.add(thighL);

      this.boyLeftShin = new THREE.Group();
      this.boyLeftShin.position.set(0, -0.42, 0);

      // Bare skin calf below knee
      const shinL = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.052, 0.38, 12), skinMat);
      shinL.position.y = -0.19;
      shinL.castShadow = true;

      // Bare foot on sand
      const footL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.045, 0.17), skinMat);
      footL.position.set(0, -0.36, 0.03);
      footL.castShadow = true;

      this.boyLeftShin.add(shinL, footL);
      this.boyLeftLeg.add(this.boyLeftShin);
      this.boyModel.add(this.boyLeftLeg);

      // Right Leg
      this.boyRightLeg = new THREE.Group();
      this.boyRightLeg.position.set(0.13, 0.76, 0);

      const thighR = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.068, 0.42, 12), pantsMat);
      thighR.position.y = -0.21;
      thighR.castShadow = true;
      this.boyRightLeg.add(thighR);

      this.boyRightShin = new THREE.Group();
      this.boyRightShin.position.set(0, -0.42, 0);

      // Bare skin calf below knee
      const shinR = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.052, 0.38, 12), skinMat);
      shinR.position.y = -0.19;
      shinR.castShadow = true;

      // Bare foot on sand
      const footR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.045, 0.17), skinMat);
      footR.position.set(0, -0.36, 0.03);
      footR.castShadow = true;

      this.boyRightShin.add(shinR, footR);
      this.boyRightLeg.add(this.boyRightShin);
      this.boyModel.add(this.boyRightLeg);

      this.boyModel.position.set(this.playerX, 0, 0);
      this.boyModel.rotation.set(0, Math.PI, 0); // Face forward towards running direction and girl!
      this.scene.add(this.boyModel);
    }

    // Build Destination Gazebo & Girl waiting
    buildDestinationScene() {
      const destGroup = new THREE.Group();
      destGroup.position.set(0, 0, -TOTAL_DISTANCE);

      // 1. Wet Reflective Golden Sand Shoreline (Matching Photo)
      const sandGeo = new THREE.PlaneGeometry(36, 40, 24, 24);
      const sandMat = new THREE.MeshStandardMaterial({
        color: 0xdca670,
        roughness: 0.28,
        metalness: 0.14
      });
      const sand = new THREE.Mesh(sandGeo, sandMat);
      sand.rotation.x = -Math.PI / 2;
      sand.position.set(0, -0.04, 0);
      sand.receiveShadow = true;
      destGroup.add(sand);

      // 2. Ocean Waves & Foamy Surf (Matching Photo)
      const oceanGeo = new THREE.PlaneGeometry(48, 40);
      const oceanMat = new THREE.MeshStandardMaterial({
        color: 0x1f5c76,
        roughness: 0.14,
        metalness: 0.35,
        transparent: true,
        opacity: 0.88
      });
      this.destOcean = new THREE.Mesh(oceanGeo, oceanMat);
      this.destOcean.rotation.x = -Math.PI / 2;
      this.destOcean.position.set(-18, 0.02, 0);
      destGroup.add(this.destOcean);

      // Foam Wave Line lapping onto wet sand
      const foamGeo = new THREE.PlaneGeometry(3.5, 40);
      const foamMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.75 });
      this.destWaveFoam = new THREE.Mesh(foamGeo, foamMat);
      this.destWaveFoam.rotation.x = -Math.PI / 2;
      this.destWaveFoam.position.set(-4.5, 0.05, 0);
      destGroup.add(this.destWaveFoam);

      // 3. Coastal Granite Boulders in Water & Sand (Matching Photo)
      const rockMat = new THREE.MeshStandardMaterial({ color: 0x47423c, roughness: 0.85 });
      const rockGeo = new THREE.DodecahedronGeometry(1, 1);
      const rockPositions = [
        [-8.5, 1.0, -8.0, 2.8, 1.8, 2.2],
        [-7.5, 0.8, 6.0, 2.2, 1.4, 1.8],
        [-11.0, 1.4, -1.5, 3.4, 2.2, 2.8],
        [7.5, 0.9, -7.5, 2.4, 1.5, 2.0],
        [8.2, 0.7, 5.5, 1.8, 1.2, 1.5],
        [-14.5, 1.8, -5.0, 4.2, 2.6, 3.5]
      ];
      rockPositions.forEach(([rx, ry, rz, sx, sy, sz]) => {
        const rock = new THREE.Mesh(rockGeo, rockMat);
        rock.scale.set(sx, sy, sz);
        rock.position.set(rx, ry, rz);
        rock.castShadow = true;
        destGroup.add(rock);
      });

      // 4. Finish Line Beach Driftwood Arch with Warm Sunset Lanterns
      const archMat = new THREE.MeshStandardMaterial({ color: 0x6d5746, roughness: 0.8 });
      const archL = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 5.2, 10), archMat);
      archL.position.set(-3.2, 2.6, 6);
      const archR = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 5.2, 10), archMat);
      archR.position.set(3.2, 2.6, 6);
      const archTop = new THREE.Mesh(new THREE.BoxGeometry(6.8, 0.35, 0.35), archMat);
      archTop.position.set(0, 5.2, 6);
      destGroup.add(archL, archR, archTop);

      const archHeart = new THREE.Mesh(new THREE.SphereGeometry(0.55, 12, 12), new THREE.MeshLambertMaterial({ color: 0xff0055 }));
      archHeart.position.set(0, 5.9, 6);
      destGroup.add(archHeart);

      // 5. THE GIRL CHARACTER (Auburn/Copper Hair, White Top, Denim Jeans, Barefoot on Sand)
      this.girlModel = new THREE.Group();
      this.girlModel.position.set(0, 0, 0);

      const girlSkinMat = new THREE.MeshStandardMaterial({ color: 0xf7d5bc, roughness: 0.65, metalness: 0.05 });
      const girlHairMat = new THREE.MeshStandardMaterial({ color: 0xb54c22, roughness: 0.75, metalness: 0.05 }); // Vibrant auburn copper red
      const girlTopMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.65 }); // White long-sleeve knit top
      const girlJeansMat = new THREE.MeshStandardMaterial({ color: 0x3d6790, roughness: 0.8 }); // Denim blue jeans
      const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111827 });

      // Head
      this.girlHead = new THREE.Group();
      this.girlHead.position.y = 1.42;

      const gCranium = new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 20), girlSkinMat);
      gCranium.scale.set(0.85, 1.12, 0.94);
      gCranium.castShadow = true;
      this.girlHead.add(gCranium);

      // Face features
      const gNose = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.06, 5), girlSkinMat);
      gNose.rotation.x = -Math.PI / 2;
      gNose.position.set(0, -0.01, 0.16);

      const gEyeL = new THREE.Mesh(new THREE.SphereGeometry(0.024, 10, 10), eyeMat);
      gEyeL.position.set(-0.055, 0.02, 0.15);
      const gEyeR = gEyeL.clone();
      gEyeR.position.x = 0.055;

      const gBlushL = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), new THREE.MeshBasicMaterial({ color: 0xf472b6 }));
      gBlushL.position.set(-0.09, -0.04, 0.14);
      const gBlushR = gBlushL.clone();
      gBlushR.position.x = 0.09;

      this.girlHead.add(gNose, gEyeL, gEyeR, gBlushL, gBlushR);

      // Hair: Long flowing auburn hair streaming in coastal breeze
      const gHair = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), girlHairMat);
      gHair.scale.set(0.92, 1.15, 1.02);
      gHair.position.set(0, 0.04, -0.02);
      this.girlHead.add(gHair);

      // Long windblown hair locks waving backward in the sea breeze
      this.girlHairCascade = new THREE.Group();
      this.girlHairCascade.position.set(0, -0.15, -0.06);
      for (let i = 0; i < 5; i++) {
        const lock = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.07, 0.7, 8), girlHairMat);
        lock.rotation.x = -0.35 - i * 0.08; // angled backward into the wind
        lock.rotation.z = (i - 2) * 0.12;
        lock.position.set((i - 2) * 0.045, -0.25, -i * 0.05);
        this.girlHairCascade.add(lock);
      }
      this.girlHead.add(this.girlHairCascade);

      this.girlModel.add(this.girlHead);

      // Neck
      const gNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.075, 0.16, 12), girlSkinMat);
      gNeck.position.y = 1.28;
      this.girlModel.add(gNeck);

      // Bodice: White long-sleeve top
      const gBodice = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.36, 0.18), girlTopMat);
      gBodice.position.y = 1.05;
      gBodice.castShadow = true;

      // Waist: Denim jeans waist
      const gJeansWaist = new THREE.Mesh(new THREE.BoxGeometry(0.31, 0.22, 0.19), girlJeansMat);
      gJeansWaist.position.y = 0.78;
      gJeansWaist.castShadow = true;
      this.girlModel.add(gBodice, gJeansWaist);

      // Legs: Classic blue denim jeans & Bare feet on tiptoes
      this.girlLegL = new THREE.Group();
      this.girlLegL.position.set(-0.085, 0.72, 0);
      const gLegMeshL = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.052, 0.68, 10), girlJeansMat);
      gLegMeshL.position.y = -0.34;
      gLegMeshL.castShadow = true;

      this.girlFootL = new THREE.Group();
      this.girlFootL.position.set(0, -0.68, 0);
      const footMeshL = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.05, 0.14), girlSkinMat);
      footMeshL.position.set(0, 0, 0.03);
      footMeshL.rotation.x = 0.42; // Up on tiptoes
      this.girlFootL.add(footMeshL);
      this.girlLegL.add(gLegMeshL, this.girlFootL);

      this.girlLegR = new THREE.Group();
      this.girlLegR.position.set(0.085, 0.72, 0);
      const gLegMeshR = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.052, 0.68, 10), girlJeansMat);
      gLegMeshR.position.y = -0.34;
      gLegMeshR.castShadow = true;

      this.girlFootR = new THREE.Group();
      this.girlFootR.position.set(0, -0.68, 0);
      const footMeshR = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.05, 0.14), girlSkinMat);
      footMeshR.position.set(0, 0, 0.03);
      footMeshR.rotation.x = 0.42; // Up on tiptoes
      this.girlFootR.add(footMeshR);
      this.girlLegR.add(gLegMeshR, this.girlFootR);

      this.girlModel.add(this.girlLegL, this.girlLegR);

      // Arms: White long-sleeve top wrapping around Boy's neck/shoulders
      this.girlArmL = new THREE.Group();
      this.girlArmL.position.set(-0.2, 1.18, 0);
      const gArmMeshL = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.042, 0.45, 8), girlTopMat);
      gArmMeshL.position.y = -0.22;
      const gHandL = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.07, 0.03), girlSkinMat);
      gHandL.position.y = -0.46;
      this.girlArmL.add(gArmMeshL, gHandL);
      this.girlModel.add(this.girlArmL);

      this.girlArmR = new THREE.Group();
      this.girlArmR.position.set(0.2, 1.18, 0);
      const gArmMeshR = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.042, 0.45, 8), girlTopMat);
      gArmMeshR.position.y = -0.22;
      const gHandR = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.07, 0.03), girlSkinMat);
      gHandR.position.y = -0.46;
      this.girlArmR.add(gArmMeshR, gHandR);
      this.girlModel.add(this.girlArmR);

      destGroup.add(this.girlModel);

      this.destinationGazebo = destGroup;
      this.scene.add(destGroup);
    }

    // ========================================================================
    // WORLD & TRACK GENERATION
    // ========================================================================
    generateInitialTrack() {
      // Build track in chunks from Z = 20 to -TOTAL_DISTANCE
      const segmentLength = 20;
      const totalSegments = Math.ceil((TOTAL_DISTANCE + 40) / segmentLength);

      for (let i = 0; i < totalSegments; i++) {
        const zStart = 20 - (i * segmentLength);
        this.createTrackSegment(zStart, segmentLength);
      }

      // Populate Coins and Obstacles throughout the journey
      this.populateCoinsAndObstacles();
    }

    createTrackSegment(zPos, length) {
      const segGroup = new THREE.Group();
      segGroup.position.z = zPos;

      const progressRatio = Math.abs(zPos) / TOTAL_DISTANCE;
      const isMiddleBridge = progressRatio >= 0.38 && progressRatio <= 0.68;

      if (isMiddleBridge) {
        // --- SECTION 2: BROKEN WOODEN BRIDGE OVER CANYON ---
        // Wooden Planks Road
        const bridgeGeo = new THREE.BoxGeometry(8.5, 0.3, length);
        const bridge = new THREE.Mesh(bridgeGeo, this.trackMaterials.bridge);
        bridge.position.set(0, -0.15, -length / 2);
        bridge.receiveShadow = true;
        segGroup.add(bridge);

        // Bridge Ropes / Wooden Railings
        for (let rz = 0; rz < length; rz += 4) {
          const postL = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.8, 8), this.trackMaterials.post);
          postL.position.set(-4.2, 0.8, -rz);
          postL.castShadow = true;

          const postR = postL.clone();
          postR.position.x = 4.2;
          segGroup.add(postL, postR);
        }

        // River / Canyon below
        const riverGeo = new THREE.PlaneGeometry(80, length);
        const river = new THREE.Mesh(riverGeo, this.trackMaterials.river);
        river.rotation.x = -Math.PI / 2;
        river.position.set(0, -12, -length / 2);
        segGroup.add(river);

      } else {
        // --- SECTION 1 & 3: SCENIC ROAD & FIELDS ---
        // Main Road
        const roadGeo = new THREE.BoxGeometry(8.5, 0.2, length);
        const road = new THREE.Mesh(roadGeo, this.trackMaterials.road);
        road.position.set(0, -0.1, -length / 2);
        road.receiveShadow = true;
        segGroup.add(road);

        // Side Curbs
        const curbL = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.35, length), this.trackMaterials.curb);
        curbL.position.set(-4.2, 0.05, -length / 2);
        const curbR = curbL.clone();
        curbR.position.x = 4.2;
        segGroup.add(curbL, curbR);

        // Ground / Field on both sides
        const grassL = new THREE.Mesh(new THREE.BoxGeometry(50, 0.18, length), this.trackMaterials.grass);
        grassL.position.set(-29.2, -0.1, -length / 2);
        grassL.receiveShadow = true;

        const grassR = grassL.clone();
        grassR.position.x = 29.2;
        segGroup.add(grassL, grassR);

        // Trees, Flowers and Lanterns along sides
        this.addDecorationsToSegment(segGroup, length);
      }

      this.scene.add(segGroup);
      this.activeTrackSegments.push(segGroup);
    }

    addDecorationsToSegment(group, length) {
      for (let z = 2; z < length; z += 6.5) {
        // Left tree
        if (Math.random() > 0.3) {
          const treeGroup = new THREE.Group();
          const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 3.2, 8), this.trackMaterials.treeTrunk);
          trunk.position.y = 1.6;
          trunk.castShadow = true;

          const leaves = new THREE.Mesh(new THREE.ConeGeometry(1.6, 3.0, 8), this.trackMaterials.foliage);
          leaves.position.y = 3.6;
          leaves.castShadow = true;

          treeGroup.add(trunk, leaves);
          treeGroup.position.set(-6.5 - Math.random() * 8, 0, -z);
          group.add(treeGroup);
        }

        // Right tree
        if (Math.random() > 0.3) {
          const treeGroupR = new THREE.Group();
          const trunkR = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 3.2, 8), this.trackMaterials.treeTrunk);
          trunkR.position.y = 1.6;
          trunkR.castShadow = true;

          const leavesR = new THREE.Mesh(new THREE.ConeGeometry(1.6, 3.0, 8), this.trackMaterials.foliage);
          leavesR.position.y = 3.6;
          leavesR.castShadow = true;

          treeGroupR.add(trunkR, leavesR);
          treeGroupR.position.set(6.5 + Math.random() * 8, 0, -z);
          group.add(treeGroupR);
        }

        // Wildflower Patches
        if (Math.random() > 0.4) {
          const flowerMat = Math.random() > 0.5 ? this.trackMaterials.flower1 : this.trackMaterials.flower2;
          const flower = new THREE.Mesh(
            new THREE.SphereGeometry(0.25, 6, 6),
            flowerMat
          );
          flower.position.set(-4.8, 0.2, -z);
          group.add(flower);
        }
      }
    }

    // ========================================================================
    // COINS & OBSTACLES PLACEMENT (Fair & Balanced Gameplay)
    // ========================================================================
    populateCoinsAndObstacles() {
      // Golden Coin Shared Materials
      const coinGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.12, 16);
      coinGeo.rotateX(Math.PI / 2);
      const coinMat = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 0.85,
        roughness: 0.2,
        emissive: 0xffa500,
        emissiveIntensity: 0.25
      });

      const diff = DIFFICULTY_SETTINGS[this.currentDifficulty] || DIFFICULTY_SETTINGS.medium;

      // Spawn coins and obstacles every few meters
      let zCursor = -15; // Start shortly ahead of player
      while (zCursor > -(TOTAL_DISTANCE - 25)) {
        const progress = Math.abs(zCursor) / TOTAL_DISTANCE;
        const isMiddle = progress >= 0.38 && progress <= 0.68;

        // 1. Spawn a row or arc of Golden Coins (scaled by difficulty probability)
        if (Math.random() < diff.coinProbability) {
          const laneIdx = Math.floor(Math.random() * 3);
          const coinX = LANES[laneIdx];
          const numCoins = Math.floor(Math.random() * 3) + 2;

          for (let c = 0; c < numCoins; c++) {
            const coinMesh = new THREE.Mesh(coinGeo, coinMat);
            coinMesh.position.set(coinX, 0.85, zCursor - c * 2.2);
            coinMesh.castShadow = true;
            this.scene.add(coinMesh);
            this.coinsPool.push({
              mesh: coinMesh,
              collected: false,
              baseY: 0.85,
              rotSpeed: 2.5 + Math.random()
            });
          }
          zCursor -= (numCoins * 2.2 + 3);
        }

        // 2. Spawn Obstacles based on Difficulty Gap Settings
        const [minGap, maxGap] = isMiddle ? diff.obstacleGapBridge : diff.obstacleGapNormal;
        const obstacleGap = minGap + Math.random() * (maxGap - minGap);
        zCursor -= obstacleGap;

        if (zCursor <= -(TOTAL_DISTANCE - 25)) break;

        // Choose obstacle pattern (FAIR: at least 1 lane is always safe or jumpable!)
        this.createFairObstaclePattern(zCursor, isMiddle);
      }
    }

    createFairObstaclePattern(zPos, isMiddle) {
      const diff = DIFFICULTY_SETTINGS[this.currentDifficulty] || DIFFICULTY_SETTINGS.medium;
      const obstacleTypes = ['jump_log', 'slide_barrier', 'dodge_rock', 'bridge_gap'];
      let chosenType = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];

      if (!isMiddle && chosenType === 'bridge_gap') {
        chosenType = 'jump_log';
      }

      // Blocked lanes configuration (scaled by difficulty safe lane chance)
      const safeLane = Math.floor(Math.random() * 3);

      for (let l = 0; l < 3; l++) {
        if (l === safeLane && Math.random() < diff.safeLaneChance) {
          // Leave safe lane completely open!
          continue;
        }

        const xPos = LANES[l];
        let obsMesh = null;
        let obsType = chosenType;

        if (chosenType === 'jump_log') {
          // Fallen Tree Log -> Must JUMP over
          const logGeo = new THREE.CylinderGeometry(0.26, 0.26, 2.4, 10);
          logGeo.rotateZ(Math.PI / 2);
          const logMat = new THREE.MeshLambertMaterial({ color: 0x4a2e18 });
          obsMesh = new THREE.Mesh(logGeo, logMat);
          obsMesh.position.set(xPos, 0.26, zPos);
          obsMesh.castShadow = true;
        } else if (chosenType === 'slide_barrier') {
          // High Hanging Wooden Barrier -> Must SLIDE under or dodge
          const frameGroup = new THREE.Group();
          const barMat = new THREE.MeshLambertMaterial({ color: 0x7c2d12 });
          const barTop = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.5, 0.3), barMat);
          barTop.position.set(0, 1.7, 0);

          const postL = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2.2, 8), barMat);
          postL.position.set(-1.3, 1.1, 0);
          const postR = postL.clone();
          postR.position.x = 1.3;

          // Caution stripes
          const sign = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.4, 0.32), new THREE.MeshBasicMaterial({ color: 0xfacc15 }));
          sign.position.set(0, 1.7, 0);

          frameGroup.add(barTop, postL, postR, sign);
          frameGroup.position.set(xPos, 0, zPos);
          obsMesh = frameGroup;
        } else if (chosenType === 'dodge_rock') {
          // Compact Stone / Rock -> Reduced size so player can cleanly JUMP over it!
          const rockGeo = new THREE.DodecahedronGeometry(0.36);
          const rockMat = new THREE.MeshLambertMaterial({ color: 0x78716c });
          obsMesh = new THREE.Mesh(rockGeo, rockMat);
          obsMesh.scale.set(1.1, 0.65, 1.1); // Flatter, lower profile stone
          obsMesh.position.set(xPos, 0.24, zPos);
          obsMesh.castShadow = true;
          obsType = 'jump_rock'; // Jumpable stone
        } else if (chosenType === 'bridge_gap') {
          // Broken Bridge Gap -> Must JUMP over
          const gapGeo = new THREE.BoxGeometry(2.6, 0.1, 3.2);
          const gapMat = new THREE.MeshBasicMaterial({ color: 0x0f172a }); // dark abyss
          obsMesh = new THREE.Mesh(gapGeo, gapMat);
          obsMesh.position.set(xPos, 0.05, zPos);
          obsType = 'jump_log'; // Behaves like jump requirement
        }

        if (obsMesh) {
          this.scene.add(obsMesh);
          this.obstaclesPool.push({
            mesh: obsMesh,
            type: obsType,
            lane: l,
            x: xPos,
            z: zPos
          });
        }
      }
    }

    // ========================================================================
    // CONTROLS & EVENT LISTENERS
    // ========================================================================
    initEvents() {
      // Keyboard input
      window.addEventListener('keydown', (e) => {
        if (this.state !== 'PLAYING') {
          if (e.key === 'Escape' || e.code === 'KeyP') {
            if (this.state === 'PAUSED') this.resumeGame();
          }
          return;
        }

        switch (e.key) {
          case 'ArrowLeft':
          case 'a':
          case 'A':
            this.moveLane(-1);
            break;
          case 'ArrowRight':
          case 'd':
          case 'D':
            this.moveLane(1);
            break;
          case ' ':
          case 'ArrowUp':
          case 'w':
          case 'W':
            e.preventDefault();
            this.jump();
            break;
          case 'ArrowDown':
          case 's':
          case 'S':
            e.preventDefault();
            this.slide();
            break;
          case 'Escape':
          case 'p':
          case 'P':
            this.pauseGame();
            break;
        }
      });

      // Window resize & orientation change for Android mobile and desktop
      window.addEventListener('resize', () => {
        this.updateCameraViewport();
      });
      window.addEventListener('orientationchange', () => {
        setTimeout(() => this.updateCameraViewport(), 100);
      });

      // Initialize mobile touch swipe gestures & virtual buttons
      this.setupTouchControls();

      // UI Buttons
      document.getElementById('btn-start-game').addEventListener('click', () => {
        this.sound.init();
        this.sound.resume();
        this.startGame();
      });

      document.getElementById('btn-pause').addEventListener('click', () => this.pauseGame());
      document.getElementById('btn-resume').addEventListener('click', () => this.resumeGame());
      document.getElementById('btn-pause-restart').addEventListener('click', () => this.restartGame());
      document.getElementById('btn-restart').addEventListener('click', () => this.restartGame());
      document.getElementById('btn-play-again').addEventListener('click', () => this.restartGame());

      // Home Page Buttons
      document.getElementById('btn-gameover-home').addEventListener('click', () => this.goToHome());
      document.getElementById('btn-pause-home').addEventListener('click', () => this.goToHome());
      document.getElementById('btn-victory-home').addEventListener('click', () => this.goToHome());

      // Audio Toggles
      document.getElementById('btn-audio-toggle').addEventListener('click', () => {
        const active = this.sound.toggleBgm();
        this.dom.audioIcon.textContent = active ? '🎵' : '🔇';
      });

      document.getElementById('btn-sfx-toggle').addEventListener('click', () => {
        const active = this.sound.toggleSfx();
        this.dom.sfxIcon.textContent = active ? '🔊' : '🔈';
      });

      // Generative AI Modal
      document.getElementById('btn-ai-info').addEventListener('click', () => {
        this.dom.modalAiInfo.classList.remove('hidden');
      });

      document.getElementById('btn-close-ai-info').addEventListener('click', () => {
        this.dom.modalAiInfo.classList.add('hidden');
      });

      // Theme Chips (Start Screen & Pause Screen)
      document.querySelectorAll('.theme-chip').forEach((chip) => {
        chip.addEventListener('click', (e) => {
          const btn = e.currentTarget;
          const theme = btn.getAttribute('data-theme');
          if (theme) {
            this.setTheme(theme);
            if (this.sound && this.sound.playCoin) {
              this.sound.playCoin();
            }
          }
        });
      });

      // Difficulty Chips (Start Screen & Pause Screen)
      document.querySelectorAll('.diff-chip').forEach((chip) => {
        chip.addEventListener('click', (e) => {
          const diff = e.currentTarget.getAttribute('data-diff');
          if (diff) {
            this.setDifficulty(diff);
            this.sound.playCoin();
          }
        });
      });

      // Switch to Easy Button on Game Over Screen
      if (this.dom.btnSwitchEasy) {
        this.dom.btnSwitchEasy.addEventListener('click', () => {
          this.setDifficulty('easy');
          this.restartGame();
        });
      }
    }

    // Haptic feedback for Android touch devices
    triggerHaptic(ms = 20) {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
          navigator.vibrate(ms);
        } catch (e) {}
      }
    }

    // Toggle on-screen touch control buttons visibility
    updateMobileControlsVisibility() {
      if (!this.dom.mobileControls) return;
      if (this.state === 'PLAYING' && this.isTouchDevice) {
        this.dom.mobileControls.classList.remove('hidden');
      } else {
        this.dom.mobileControls.classList.add('hidden');
      }
    }

    // Mobile touch gestures (Swipes & Taps) + On-Screen Touch Controls
    setupTouchControls() {
      let startX = 0;
      let startY = 0;
      let startTime = 0;
      let swipeHandled = false;

      // Unlock mobile audio on first user touch anywhere
      const unlockAudio = () => {
        if (this.sound) {
          this.sound.init();
          this.sound.resume();
        }
        window.removeEventListener('touchstart', unlockAudio, true);
        window.removeEventListener('touchend', unlockAudio, true);
        window.removeEventListener('pointerdown', unlockAudio, true);
      };
      window.addEventListener('touchstart', unlockAudio, { passive: true, capture: true });
      window.addEventListener('touchend', unlockAudio, { passive: true, capture: true });
      window.addEventListener('pointerdown', unlockAudio, { passive: true, capture: true });

      // Swipe and Tap detection on screen
      window.addEventListener('touchstart', (e) => {
        if (this.state !== 'PLAYING') return;
        if (e.target.closest && (e.target.closest('button') || e.target.closest('.touch-btn') || e.target.closest('.hud-container'))) {
          return;
        }
        if (e.touches && e.touches.length > 0) {
          startX = e.touches[0].clientX;
          startY = e.touches[0].clientY;
          startTime = performance.now();
          swipeHandled = false;
        }
      }, { passive: true });

      window.addEventListener('touchmove', (e) => {
        if (this.state !== 'PLAYING' || swipeHandled) return;
        if (e.target.closest && (e.target.closest('button') || e.target.closest('.touch-btn'))) {
          return;
        }
        if (!e.touches || e.touches.length === 0) return;

        const curX = e.touches[0].clientX;
        const curY = e.touches[0].clientY;
        const deltaX = curX - startX;
        const deltaY = curY - startY;
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        // Swipe threshold: 30px is snappy and prevents misfires
        if (absX > 30 || absY > 30) {
          if (absX > absY) {
            // Horizontal Swipe
            if (deltaX > 0) {
              this.moveLane(1);
              this.triggerHaptic(20);
            } else {
              this.moveLane(-1);
              this.triggerHaptic(20);
            }
          } else {
            // Vertical Swipe
            if (deltaY < 0) {
              this.jump();
              this.triggerHaptic(25);
            } else {
              this.slide();
              this.triggerHaptic(25);
            }
          }
          swipeHandled = true;
          if (e.cancelable) e.preventDefault();
        }
      }, { passive: false });

      window.addEventListener('touchend', (e) => {
        if (this.state !== 'PLAYING') return;
        if (e.target.closest && (e.target.closest('button') || e.target.closest('.touch-btn') || e.target.closest('.hud-container'))) {
          return;
        }
        // Tap gesture detection (quick tap without swiping)
        if (!swipeHandled && (performance.now() - startTime < 280)) {
          const tapX = startX;
          const width = window.innerWidth;
          if (tapX < width * 0.35) {
            this.moveLane(-1);
            this.triggerHaptic(20);
          } else if (tapX > width * 0.65) {
            this.moveLane(1);
            this.triggerHaptic(20);
          } else {
            this.jump();
            this.triggerHaptic(25);
          }
        }
        swipeHandled = false;
      }, { passive: true });

      // On-Screen Virtual Buttons
      const bindTouchBtn = (btn, action, hapticMs) => {
        if (!btn) return;
        const trigger = (e) => {
          if (e.cancelable) e.preventDefault();
          e.stopPropagation();
          btn.classList.add('active-touch');
          action();
          this.triggerHaptic(hapticMs);
        };
        const release = () => {
          btn.classList.remove('active-touch');
        };

        btn.addEventListener('touchstart', trigger, { passive: false });
        btn.addEventListener('touchend', release, { passive: true });
        btn.addEventListener('touchcancel', release, { passive: true });
        btn.addEventListener('pointerdown', (e) => {
          if (e.pointerType === 'touch') return; // Handled by touchstart
          trigger(e);
        });
        btn.addEventListener('pointerup', release);
        btn.addEventListener('pointerleave', release);
      };

      bindTouchBtn(this.dom.btnTouchLeft, () => this.moveLane(-1), 20);
      bindTouchBtn(this.dom.btnTouchRight, () => this.moveLane(1), 20);
      bindTouchBtn(this.dom.btnTouchJump, () => this.jump(), 25);
      bindTouchBtn(this.dom.btnTouchSlide, () => this.slide(), 25);
    }

    // Lane Navigation with Smooth Transition
    moveLane(direction) {
      const nextLane = this.currentLane + direction;
      if (nextLane >= 0 && nextLane <= 2) {
        this.currentLane = nextLane;
        this.targetLaneX = LANES[this.currentLane];
      }
    }

    jump() {
      const diff = DIFFICULTY_SETTINGS[this.currentDifficulty] || DIFFICULTY_SETTINGS.medium;
      if (this.isGrounded && !this.isSliding) {
        this.velocityY = diff.jumpImpulse;
        this.isGrounded = false;
        this.isJumping = true;
        this.sound.playJump();
      }
    }

    slide() {
      const diff = DIFFICULTY_SETTINGS[this.currentDifficulty] || DIFFICULTY_SETTINGS.medium;
      if (this.isGrounded && !this.isSliding) {
        this.isSliding = true;
        this.slideTimer = diff.slideDuration;
        this.sound.playSlide();
      }
    }

    // ========================================================================
    // GAME FLOW & STATE MANAGEMENT
    // ========================================================================
    startGame() {
      this.state = 'PLAYING';
      this.dom.screenStart.classList.add('hidden');
      this.dom.hud.classList.remove('hidden');
      this.dom.hudControls.classList.remove('hidden');
      this.updateMobileControlsVisibility();
      this.gameStartTime = performance.now();
      this.sound.playBgm('jailer');
    }

    pauseGame() {
      if (this.state !== 'PLAYING') return;
      this.state = 'PAUSED';
      this.sound.pauseBgm();
      this.updateMobileControlsVisibility();
      this.dom.screenPause.classList.remove('hidden');

      // Update pause stats
      this.dom.pauseCoins.textContent = this.coins;
      this.dom.pauseScore.textContent = this.score;
      const pct = Math.min(100, Math.floor((Math.abs(this.playerZ) / TOTAL_DISTANCE) * 100));
      this.dom.pauseProgress.textContent = `${pct}%`;
    }

    resumeGame() {
      if (this.state !== 'PAUSED') return;
      this.state = 'PLAYING';
      this.sound.resume();
      this.updateMobileControlsVisibility();
      this.dom.screenPause.classList.add('hidden');
    }

    triggerGameOver() {
      this.state = 'GAMEOVER';
      this.sound.stopBgm();
      this.sound.playHit();
      this.updateMobileControlsVisibility();

      // Play YouTube failure BGM (https://youtube.com/shorts/IA7f98LlimI) right after hit impact
      setTimeout(() => {
        if (this.state === 'GAMEOVER') {
          this.sound.playGameOverBgm();
        }
      }, 300);

      const diff = DIFFICULTY_SETTINGS[this.currentDifficulty] || DIFFICULTY_SETTINGS.medium;

      // Update Game Over UI
      this.dom.gameoverCoins.textContent = this.coins;
      this.dom.gameoverScore.textContent = this.score;
      this.dom.gameoverDistance.textContent = `${Math.floor(Math.abs(this.playerZ))}m`;
      if (this.dom.gameoverDiffText) {
        this.dom.gameoverDiffText.textContent = `${diff.badge} (${diff.scoreMultiplier}x Score)`;
      }
      if (this.dom.btnSwitchEasy) {
        this.dom.btnSwitchEasy.classList.toggle('hidden', this.currentDifficulty === 'easy');
      }
      this.dom.screenGameOver.classList.remove('hidden');
    }

    triggerVictory() {
      this.state = 'CUTSCENE';
      this.updateMobileControlsVisibility();
      this.hugTimer = 0;
      // Immediately switch from running track to YouTube Victory Love Song (Premada Oorali) while hugging her!
      this.sound.playVictoryBgm();
      this.setTheme('beach'); // Seamlessly transition skybox and warm lighting to sunset beach!
      if (this.boyBackpack) this.boyBackpack.visible = false; // Casual beach shirt without backpack

      // Hide alerts
      this.dom.alertBanner.classList.add('hidden');
      if (this.dom.girlCallout) this.dom.girlCallout.classList.add('hidden');

      this.elapsedTime = Math.round((performance.now() - this.gameStartTime) / 1000);

      // Sunset Beach Embrace sequence (matching user photo)
      setTimeout(() => {
        if (this.dom.hugCallout) {
          this.dom.hugCallout.classList.remove('hidden');
        }
        this.sound.playCelebrationFanfare();
        this.spawnHeartFountain();

        // Voice celebration
        try {
          if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utt = new SpeechSynthesisUtterance("I found you by the shore! I knew you'd come for me!");
            utt.rate = 1.0;
            utt.pitch = 1.25;
            window.speechSynthesis.speak(utt);
          }
        } catch (e) {}
      }, 900);

      // Show Victory Modal after 4.5 seconds of romantic beach embrace
      setTimeout(() => {
        this.state = 'VICTORY';
        if (this.dom.hugCallout) {
          this.dom.hugCallout.classList.add('hidden');
        }
        const diff = DIFFICULTY_SETTINGS[this.currentDifficulty] || DIFFICULTY_SETTINGS.medium;
        this.dom.victoryCoins.textContent = this.coins;
        this.dom.victoryScore.textContent = this.score;
        this.dom.victoryTime.textContent = `${this.elapsedTime}s`;
        if (this.dom.victoryDiffText) {
          this.dom.victoryDiffText.textContent = `🏆 Conquered on ${diff.badge} with ${diff.scoreMultiplier}x Score Multiplier!`;
        }
        this.dom.screenVictory.classList.remove('hidden');
      }, 4500);
    }

    restartGame() {
      // Hide modals
      this.dom.screenPause.classList.add('hidden');
      this.dom.screenGameOver.classList.add('hidden');
      this.dom.screenVictory.classList.add('hidden');
      this.dom.alertBanner.classList.add('hidden');

      // Reset gameplay stats
      this.score = 0;
      this.coins = 0;
      this.distance = 0;
      this.currentLane = 1;
      this.targetLaneX = LANES[1];
      this.playerX = LANES[1];
      this.playerY = 0;
      this.playerZ = 0;
      this.velocityY = 0;
      this.isGrounded = true;
      this.isJumping = false;
      this.isSliding = false;
      this.slideTimer = 0;
      this.dangerAlertShown = false;
      this.almostThereAlertShown = false;

      // Reset model position & rotation
      this.boyModel.position.set(this.playerX, 0, 0);
      this.boyModel.rotation.set(0, Math.PI, 0);
      this.boyModel.scale.set(1, 1, 1);
      this.hugTimer = 0;

      if (this.boyHead) this.boyHead.rotation.set(0, 0, 0);
      if (this.boyTorso) this.boyTorso.rotation.set(0, 0, 0);
      if (this.boyLeftArm) this.boyLeftArm.rotation.set(0, 0, 0);
      if (this.boyRightArm) this.boyRightArm.rotation.set(0, 0, 0);
      if (this.boyLeftLeg) this.boyLeftLeg.rotation.set(0, 0, 0);
      if (this.boyRightLeg) this.boyRightLeg.rotation.set(0, 0, 0);
      if (this.boyLeftForearm) this.boyLeftForearm.rotation.set(0, 0, 0);
      if (this.boyRightForearm) this.boyRightForearm.rotation.set(0, 0, 0);
      if (this.boyLeftShin) this.boyLeftShin.rotation.set(0, 0, 0);
      if (this.boyRightShin) this.boyRightShin.rotation.set(0, 0, 0);
      if (this.boyBackpack) this.boyBackpack.visible = true;

      // Reset girl calling and celebration
      this.girlCalloutShown = false;
      this.girlCalledVoice = false;
      if (this.dom.girlCallout) this.dom.girlCallout.classList.add('hidden');
      if (this.dom.hugCallout) this.dom.hugCallout.classList.add('hidden');
      if (this.girlModel) {
        this.girlModel.position.set(0, 0, 0);
        this.girlModel.rotation.set(0, 0, 0);
      }
      if (this.girlHead) this.girlHead.rotation.set(0, 0, 0);
      if (this.girlArmL) this.girlArmL.rotation.set(0, 0, 0);
      if (this.girlArmR) this.girlArmR.rotation.set(0, 0, 0);
      if (this.girlLegL) this.girlLegL.rotation.set(0, 0, 0);
      if (this.girlLegR) this.girlLegR.rotation.set(0, 0, 0);

      // Re-populate coins and obstacles fresh for the current difficulty
      this.clearCoinsAndObstacles();
      this.populateCoinsAndObstacles();

      // Maintain user's chosen theme
      this.setTheme(this.selectedTheme || 'forest');

      // Update HUD
      this.updateHUD(0);

      // Start running
      this.startGame();
    }

    goToHome() {
      // Stop music
      this.sound.stopBgm();

      // Hide modals & HUD
      this.updateMobileControlsVisibility();
      this.dom.screenPause.classList.add('hidden');
      this.dom.screenGameOver.classList.add('hidden');
      this.dom.screenVictory.classList.add('hidden');
      this.dom.alertBanner.classList.add('hidden');
      if (this.dom.girlCallout) this.dom.girlCallout.classList.add('hidden');
      this.dom.hud.classList.add('hidden');
      this.dom.hudControls.classList.add('hidden');

      // Show Start Screen
      this.dom.screenStart.classList.remove('hidden');

      // Reset state variables
      this.state = 'START';
      this.score = 0;
      this.coins = 0;
      this.distance = 0;
      this.currentLane = 1;
      this.targetLaneX = LANES[1];
      this.playerX = LANES[1];
      this.playerY = 0;
      this.playerZ = 0;
      this.velocityY = 0;
      this.isGrounded = true;
      this.isJumping = false;
      this.isSliding = false;
      this.slideTimer = 0;
      this.dangerAlertShown = false;
      this.almostThereAlertShown = false;
      this.girlCalloutShown = false;
      this.girlCalledVoice = false;

      // Reset boy model facing forward
      this.boyModel.position.set(LANES[1], 0, 0);
      this.boyModel.rotation.set(0, Math.PI, 0);
      this.boyModel.scale.set(1, 1, 1);
      this.hugTimer = 0;

      if (this.boyHead) this.boyHead.rotation.set(0, 0, 0);
      if (this.boyTorso) this.boyTorso.rotation.set(0, 0, 0);
      if (this.boyLeftArm) this.boyLeftArm.rotation.set(0, 0, 0);
      if (this.boyRightArm) this.boyRightArm.rotation.set(0, 0, 0);
      if (this.boyLeftLeg) this.boyLeftLeg.rotation.set(0, 0, 0);
      if (this.boyRightLeg) this.boyRightLeg.rotation.set(0, 0, 0);
      if (this.boyLeftForearm) this.boyLeftForearm.rotation.set(0, 0, 0);
      if (this.boyRightForearm) this.boyRightForearm.rotation.set(0, 0, 0);
      if (this.boyLeftShin) this.boyLeftShin.rotation.set(0, 0, 0);
      if (this.boyRightShin) this.boyRightShin.rotation.set(0, 0, 0);
      if (this.boyBackpack) this.boyBackpack.visible = true;

      // Reset girl model
      if (this.dom.hugCallout) this.dom.hugCallout.classList.add('hidden');
      if (this.girlModel) {
        this.girlModel.position.set(0, 0, 0);
        this.girlModel.rotation.set(0, 0, 0);
      }
      if (this.girlHead) this.girlHead.rotation.set(0, 0, 0);
      if (this.girlArmL) this.girlArmL.rotation.set(0, 0, 0);
      if (this.girlArmR) this.girlArmR.rotation.set(0, 0, 0);
      if (this.girlLegL) this.girlLegL.rotation.set(0, 0, 0);
      if (this.girlLegR) this.girlLegR.rotation.set(0, 0, 0);

      // Reset camera
      const camBaseZ = this.cameraBaseZ !== undefined ? this.cameraBaseZ : 7.5;
      const camBaseY = this.cameraBaseY !== undefined ? this.cameraBaseY : 4.2;
      this.camera.position.set(0, camBaseY, camBaseZ);
      this.camera.lookAt(0, 1.5, -2);

      // Reset coins & obstacles
      this.clearCoinsAndObstacles();
      this.populateCoinsAndObstacles();

      // Maintain user's chosen theme
      this.setTheme(this.selectedTheme || 'forest');

      // Reset HUD values
      this.updateHUD(0);
    }

    triggerGirlCalling() {
      // 1. Show dialogue bubble callout
      if (this.dom.girlCallout) {
        this.dom.girlCallout.classList.remove('hidden');
      }

      // 2. Play sweet synth calling arpeggio chime
      this.sound.playGirlCallingMelody();

      // 3. Web Speech API voice synthesis: "Ohh my love! Come fast, come fast!"
      try {
        if ('speechSynthesis' in window && !this.girlCalledVoice) {
          this.girlCalledVoice = true;
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance("Oh my love! Come fast, come fast!");
          utterance.rate = 1.05;
          utterance.pitch = 1.45;
          window.speechSynthesis.speak(utterance);
        }
      } catch (e) {}

      // 4. Auto-hide callout after 4.5 seconds
      setTimeout(() => {
        if (this.dom.girlCallout) {
          this.dom.girlCallout.classList.add('hidden');
        }
      }, 4500);
    }

    showAlert(title, subtitle, icon = '⚠️', warm = false) {
      this.dom.alertTitle.textContent = title;
      this.dom.alertSubtitle.textContent = subtitle;
      this.dom.alertIcon.textContent = icon;
      if (warm) {
        this.dom.alertBanner.classList.add('warm-theme');
      } else {
        this.dom.alertBanner.classList.remove('warm-theme');
      }
      this.dom.alertBanner.classList.remove('hidden');

      setTimeout(() => {
        this.dom.alertBanner.classList.add('hidden');
      }, 3500);
    }

    spawnFloatingScore(text, clientX, clientY) {
      const el = document.createElement('div');
      el.className = 'floating-score';
      el.textContent = text;
      el.style.left = `${clientX || (window.innerWidth / 2 + (Math.random() - 0.5) * 80)}px`;
      el.style.top = `${clientY || (window.innerHeight / 2 - 40)}px`;
      this.dom.floatingScores.appendChild(el);

      setTimeout(() => {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 850);
    }

    spawnHeartFountain() {
      // Three.js 3D floating hearts
      const heartMat = new THREE.MeshBasicMaterial({ color: 0xff4d6d });
      for (let i = 0; i < 25; i++) {
        const heartMesh = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 8), heartMat);
        heartMesh.position.set(
          (Math.random() - 0.5) * 4,
          1.5 + Math.random() * 2,
          -TOTAL_DISTANCE + (Math.random() - 0.5) * 3
        );
        this.scene.add(heartMesh);
        this.particles.push({
          mesh: heartMesh,
          vy: 2.5 + Math.random() * 2.5,
          vx: (Math.random() - 0.5) * 1.5,
          life: 3.0
        });
      }
    }

    // ========================================================================
    // UPDATE CYCLE & PHYSICS
    // ========================================================================
    update(dt) {
      if (this.state !== 'PLAYING' && this.state !== 'CUTSCENE') return;

      // 1. Advance Player Position (scaled by difficulty speed)
      const diff = DIFFICULTY_SETTINGS[this.currentDifficulty] || DIFFICULTY_SETTINGS.medium;
      if (this.state === 'PLAYING') {
        this.playerZ -= diff.speed * dt;
        if (this.boyRingBox) this.boyRingBox.visible = false;
      } else if (this.state === 'CUTSCENE') {
        // Walk smoothly towards girl at destination gazebo and embrace her
        const targetZ = -TOTAL_DISTANCE + 0.88;
        if (this.playerZ > targetZ) {
          this.playerZ -= 3.5 * dt;
          // Natural running/jogging steps towards her
          this.runCycle += dt * 10;
          const swing = Math.sin(this.runCycle) * 0.45;
          this.boyLeftArm.rotation.x = swing;
          this.boyRightArm.rotation.x = -swing;
          this.boyLeftLeg.rotation.x = -swing;
          this.boyRightLeg.rotation.x = swing;
          if (this.boyLeftShin) this.boyLeftShin.rotation.x = Math.max(0, -swing * 0.5);
          if (this.boyRightShin) this.boyRightShin.rotation.x = Math.max(0, swing * 0.5);
          // Reaching arms slightly outward ready for the hug
          this.boyLeftArm.rotation.z = 0.25;
          this.boyRightArm.rotation.z = -0.25;
        } else {
          // Standing close in romantic beach embrace matching photo
          const embraceDistance = 0.44;
          this.playerZ = -TOTAL_DISTANCE + embraceDistance;
          this.hugTimer += dt;

          const embraceEase = Math.min(1.0, this.hugTimer / 0.8);
          // Gentle synchronized breathing and subtle swaying to the ocean waves
          const waveBreathe = Math.sin(this.hugTimer * 2.2) * 0.016;

          // 1. BOY POSE & POSITION (White beach shirt & blue shorts, barefoot on wet sand)
          this.boyModel.position.set(0, 0, this.playerZ);
          this.boyModel.rotation.set(0, Math.PI, 0);

          // Boy leans in slightly to hold her close (matching photo)
          this.boyModel.rotation.x = 0.12 * embraceEase;
          if (this.boyTorso) {
            this.boyTorso.rotation.x = 0.06 * embraceEase;
            this.boyTorso.position.y = 1.02 + waveBreathe;
          }

          // Boy's stance: solid footing on wet sand
          this.boyLeftLeg.rotation.set(-0.06 * embraceEase, 0, -0.04);
          this.boyRightLeg.rotation.set(0.08 * embraceEase, 0, 0.04);
          if (this.boyLeftShin) this.boyLeftShin.rotation.set(0.1 * embraceEase, 0, 0);
          if (this.boyRightShin) this.boyRightShin.rotation.set(0.08 * embraceEase, 0, 0);

          // Boy's arms wrap securely and lovingly around girl's waist & lower back (matching photo)
          this.boyLeftArm.rotation.set(1.22 * embraceEase, 0.32 * embraceEase, 0.36 * embraceEase);
          this.boyRightArm.rotation.set(1.22 * embraceEase, -0.32 * embraceEase, -0.36 * embraceEase);
          if (this.boyLeftForearm) this.boyLeftForearm.rotation.set(0.55 * embraceEase, 0, 0.4 * embraceEase);
          if (this.boyRightForearm) this.boyRightForearm.rotation.set(0.55 * embraceEase, 0, -0.4 * embraceEase);

          // Boy's head leans in, forehead and cheek gently touching hers with a warm, joyful smile
          if (this.boyHead) {
            this.boyHead.rotation.set(0.18 * embraceEase, 0.06 * embraceEase, -0.04 * embraceEase);
          }

          // 2. GIRL POSE & POSITION (White top, blue jeans, long windblown auburn hair, on tiptoes)
          if (this.girlModel) {
            this.girlModel.position.set(0, 0.04 + waveBreathe, 0);
            // Girl arches back slightly in laughing, ecstatic romantic joy (matching photo)
            this.girlModel.rotation.set(-0.16 * embraceEase, 0, 0);

            // Girl wraps both arms tightly over boy's shoulders and neck, pulling him close
            if (this.girlArmL && this.girlArmR) {
              this.girlArmL.rotation.set(1.58 * embraceEase, -0.26 * embraceEase, -0.38 * embraceEase);
              this.girlArmR.rotation.set(1.58 * embraceEase, 0.26 * embraceEase, 0.38 * embraceEase);
            }

            // Girl looks up with head tilted back, forehead touching his, radiant laughing smile
            if (this.girlHead) {
              this.girlHead.rotation.set(-0.24 * embraceEase, -0.06 * embraceEase, 0.04 * embraceEase);
            }

            // Girl standing up on her tiptoes on the wet sand
            if (this.girlFootL && this.girlFootR) {
              this.girlFootL.rotation.x = 0.45 * embraceEase;
              this.girlFootR.rotation.x = 0.45 * embraceEase;
            }

            // Wind fluttering her long auburn hair cascade backward in the coastal breeze
            if (this.girlHairCascade) {
              this.girlHairCascade.rotation.x = -0.22 + Math.sin(this.hugTimer * 3.6) * 0.08;
              this.girlHairCascade.rotation.z = 0.12 + Math.sin(this.hugTimer * 2.8) * 0.06;
            }
          }

          // 3. Gentle Ocean Waves lapping on wet sand
          if (this.destWaveFoam) {
            this.destWaveFoam.position.x = -4.5 + Math.sin(this.hugTimer * 1.6) * 0.7;
          }

          // Subtle glowing sunset particles floating softly in the sea air
          if (Math.random() < 0.12) {
            const hMat = new THREE.MeshBasicMaterial({ color: 0xffa07a });
            const p = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 6), hMat);
            p.position.set(
              (Math.random() - 0.5) * 3,
              1.2 + Math.random() * 0.8,
              -TOTAL_DISTANCE + (Math.random() - 0.5) * 3
            );
            this.scene.add(p);
            this.particles.push({
              mesh: p,
              vy: 0.6 + Math.random() * 0.6,
              vx: (Math.random() - 0.5) * 0.4,
              life: 2.0
            });
          }
        }
      }

      // Smooth horizontal lane interpolation (lerp)
      this.playerX += (this.targetLaneX - this.playerX) * 14 * dt;

      // 2. Jump & Gravity Physics
      if (!this.isGrounded) {
        this.velocityY += GRAVITY * dt;
        this.playerY += this.velocityY * dt;

        if (this.playerY <= 0) {
          this.playerY = 0;
          this.velocityY = 0;
          this.isGrounded = true;
          this.isJumping = false;
        }
      }

      // 3. Slide Timer
      if (this.isSliding) {
        this.slideTimer -= dt;
        if (this.slideTimer <= 0) {
          this.isSliding = false;
        }
      }

      // Update boy 3D model transforms
      if (this.state !== 'CUTSCENE') {
        this.boyModel.position.set(this.playerX, this.playerY, this.playerZ);
        this.boyModel.rotation.y = Math.PI; // Face forward towards running direction & girl!

        // Model adjustments during Slide/Duck
        if (this.isSliding) {
          this.boyModel.scale.set(1.1, 0.45, 1.2);
          this.boyModel.rotation.x = 0.25; // Forward duck tilt
        } else {
          this.boyModel.scale.set(1.0, 1.0, 1.0);
          this.boyModel.rotation.x = 0;
        }

        // Running Animation Cycle (scaled to difficulty speed)
        this.runCycle += dt * (diff.speed * 0.72);
        if (this.state === 'PLAYING' && this.isGrounded && !this.isSliding) {
          const swing = Math.sin(this.runCycle) * 0.75;
          this.boyLeftArm.rotation.x = swing;
          this.boyRightArm.rotation.x = -swing;
          this.boyLeftLeg.rotation.x = -swing;
          this.boyRightLeg.rotation.x = swing;

          // Natural knee and elbow flexion
          if (this.boyLeftShin) this.boyLeftShin.rotation.x = Math.max(0, -swing * 0.7);
          if (this.boyRightShin) this.boyRightShin.rotation.x = Math.max(0, swing * 0.7);
          if (this.boyLeftForearm) this.boyLeftForearm.rotation.x = 0.35;
          if (this.boyRightForearm) this.boyRightForearm.rotation.x = 0.35;
          if (this.boyRingBox) this.boyRingBox.visible = false;
        } else if (this.isJumping) {
          // Jumping pose
          this.boyLeftArm.rotation.x = -1.1;
          this.boyRightArm.rotation.x = -1.1;
          this.boyLeftLeg.rotation.x = 0.5;
          this.boyRightLeg.rotation.x = 0.5;
          if (this.boyLeftShin) this.boyLeftShin.rotation.x = 0.6;
          if (this.boyRightShin) this.boyRightShin.rotation.x = 0.6;
        }
      }

      // Girl calling / waving animation at destination (during running)
      if (this.state !== 'CUTSCENE') {
        if (this.girlCalloutShown && this.girlModel) {
          this.girlModel.position.y = Math.abs(Math.sin(this.runCycle * 1.6)) * 0.35;
          if (this.girlArmL && this.girlArmR) {
            this.girlArmL.rotation.z = 1.3 + Math.sin(this.runCycle * 1.6) * 0.4;
            this.girlArmR.rotation.z = -1.3 - Math.sin(this.runCycle * 1.6) * 0.4;
          }
        } else if (this.girlArmR) {
          this.girlArmR.rotation.z = -1.2 + Math.sin(this.runCycle * 0.6) * 0.5;
        }
      }

      // 4. Camera Follow
      if (this.state === 'CUTSCENE') {
        // Romantic side-profile 3/4 cinematic camera framing the couple & beach waves (matching user photo)
        const camTargetX = 2.85;
        const camTargetY = 1.32;
        const camTargetZ = -TOTAL_DISTANCE + 0.35 + Math.sin(this.hugTimer * 0.35) * 0.12;
        this.camera.position.z += (camTargetZ - this.camera.position.z) * 3.5 * dt;
        this.camera.position.x += (camTargetX - this.camera.position.x) * 3.5 * dt;
        this.camera.position.y += (camTargetY - this.camera.position.y) * 3.5 * dt;
        this.camera.lookAt(0, 1.22, -TOTAL_DISTANCE + 0.22);
      } else {
        const camBaseZ = this.cameraBaseZ !== undefined ? this.cameraBaseZ : 7.5;
        const camBaseY = this.cameraBaseY !== undefined ? this.cameraBaseY : 4.2;
        const camFollowX = this.cameraFollowX !== undefined ? this.cameraFollowX : 0.6;
        const camTargetZ = this.playerZ + camBaseZ;
        const camTargetY = this.playerY + camBaseY;
        this.camera.position.z += (camTargetZ - this.camera.position.z) * 10 * dt;
        this.camera.position.x += (this.playerX * camFollowX - this.camera.position.x) * 8 * dt;
        this.camera.position.y += (camTargetY - this.camera.position.y) * 8 * dt;
        this.camera.lookAt(this.playerX * (camFollowX * 0.6), this.playerY + 1.5, this.playerZ - 4.5);
      }

      // Skybox follows player for parallax
      if (this.skyCylinder) {
        this.skyCylinder.position.z = this.playerZ - 120;
      }

      // 5. Coins Animation & Collision Detection
      for (let i = 0; i < this.coinsPool.length; i++) {
        const coin = this.coinsPool[i];
        if (coin.collected) continue;

        // Floating rotation
        coin.mesh.rotation.z += coin.rotSpeed * dt;
        coin.mesh.position.y = coin.baseY + Math.sin(this.runCycle * 0.5 + i) * 0.12;

        // Bounding check
        const dz = Math.abs(coin.mesh.position.z - this.playerZ);
        const dx = Math.abs(coin.mesh.position.x - this.playerX);
        const dy = Math.abs(coin.mesh.position.y - (this.playerY + 0.9));

        if (dz < 1.2 && dx < 1.1 && dy < 1.4) {
          // Collected!
          coin.collected = true;
          coin.mesh.visible = false;
          this.coins += 1;
          const coinPts = Math.round(10 * diff.scoreMultiplier);
          this.score += coinPts;
          this.sound.playCoin();
          this.spawnFloatingScore(`+${coinPts}`);
          this.dom.hudCoins.textContent = this.coins;
          this.dom.hudScore.textContent = this.score;
        }
      }

      // 6. Obstacle Collision Detection (Fair & Jumpable)
      if (this.state === 'PLAYING') {
        const tol = diff.hitTolerance / 0.75;
        for (let i = 0; i < this.obstaclesPool.length; i++) {
          const obs = this.obstaclesPool[i];
          const dz = Math.abs(obs.z - this.playerZ);
          const dx = Math.abs(obs.x - this.playerX);

          // Difficulty-adjusted hitbox tolerance
          const hitZ = (obs.type === 'jump_rock' || obs.type === 'dodge_rock') ? (0.75 * tol) : (0.95 * tol);
          const hitX = (obs.type === 'jump_rock' || obs.type === 'dodge_rock') ? (0.75 * tol) : (0.9 * tol);

          if (dz < hitZ && dx < hitX) {
            let collision = false;

            if (obs.type === 'jump_log' || obs.type === 'bridge_gap' || obs.type === 'jump_rock' || obs.type === 'dodge_rock') {
              // Can cleanly JUMP over stones, logs, and bridge gaps!
              const threshold = (obs.type === 'jump_rock' || obs.type === 'dodge_rock') ? 0.55 : 0.75;
              if (this.playerY < threshold) {
                collision = true;
              }
            } else if (obs.type === 'slide_barrier') {
              // Can only survive if SLIDING!
              if (!this.isSliding) {
                collision = true;
              }
            }

            if (collision) {
              this.triggerGameOver();
              return;
            }
          }
        }
      }

      // 7. Journey Story Progression & Milestones
      const progressRatio = Math.min(1.0, Math.abs(this.playerZ) / TOTAL_DISTANCE);
      this.updateHUD(progressRatio);

      // Milestone: Danger Ahead Banner (at ~38% - Center Phase)
      if (progressRatio >= 0.38 && progressRatio <= 0.65 && !this.dangerAlertShown) {
        this.dangerAlertShown = true;
        this.showAlert('DANGER AHEAD! ⚠️', 'Broken Canyon Bridge & Perilous Obstacles!');
        this.dom.phaseBadge.textContent = 'Broken Bridge ⚠️';
        this.dom.phaseBadge.style.color = '#f87171';
      }

      // Milestone: Almost There Banner (at ~72%)
      if (progressRatio >= 0.72 && !this.almostThereAlertShown) {
        this.almostThereAlertShown = true;
        this.showAlert('ALMOST THERE! ❤️', 'She is waiting by the shore!', '🌸', true);
        if (this.selectedTheme === 'forest') {
          this.dom.phaseBadge.textContent = 'Sunset Garden 🌸';
          this.dom.phaseBadge.style.color = '#fb923c';
          this.setTheme('sunset');
        } else {
          const cfg = THEME_CONFIG[this.selectedTheme] || THEME_CONFIG.forest;
          this.dom.phaseBadge.textContent = `${cfg.badge} • Near Goal ❤️`;
          this.dom.phaseBadge.style.color = cfg.accentColor;
        }
      }

      // Milestone: Girl Calling (at ~10-14 meters from girl)
      const distanceToGirl = TOTAL_DISTANCE - Math.abs(this.playerZ);
      if (distanceToGirl <= 14 && distanceToGirl > 0 && !this.girlCalloutShown) {
        this.girlCalloutShown = true;
        this.triggerGirlCalling();
      }

      // Milestone: Finish Line reached!
      if (this.playerZ <= -TOTAL_DISTANCE && this.state === 'PLAYING') {
        this.triggerVictory();
      }

      // 8. Particles Update
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.life -= dt;
        p.mesh.position.y += p.vy * dt;
        p.mesh.position.x += p.vx * dt;
        p.mesh.scale.multiplyScalar(0.98);

        if (p.life <= 0) {
          this.scene.remove(p.mesh);
          this.particles.splice(i, 1);
        }
      }
    }

    updateHUD(progressRatio) {
      const distanceMeters = Math.min(TOTAL_DISTANCE, Math.floor(Math.abs(this.playerZ)));
      this.dom.distanceText.textContent = `${distanceMeters}m / ${TOTAL_DISTANCE}m`;

      const pct = Math.floor(progressRatio * 100);
      this.dom.progressFill.style.width = `${pct}%`;
      this.dom.boyIcon.style.left = `${Math.min(94, Math.max(0, pct))}%`;

      // Passive score increment for distance scaled by difficulty multiplier
      if (this.state === 'PLAYING') {
        const diff = DIFFICULTY_SETTINGS[this.currentDifficulty] || DIFFICULTY_SETTINGS.medium;
        this.score = Math.round(this.coins * 10 * diff.scoreMultiplier + distanceMeters * diff.scoreMultiplier);
        this.dom.hudScore.textContent = this.score;
      }
    }

    // ========================================================================
    // ANIMATION & RENDER LOOP
    // ========================================================================
    animate() {
      requestAnimationFrame(this.animate);
      const dt = Math.min(this.clock.getDelta(), 0.1);

      this.update(dt);

      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
    }
  }

  // --- BOOTSTRAP WHEN DOM IS READY ---
  window.addEventListener('DOMContentLoaded', () => {
    window.gameInstance = new JourneyGame();
  });
})();
