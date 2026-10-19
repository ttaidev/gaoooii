// ============================================================================
// AUDIO CONTROLLER & PROCEDURAL ROMANTIC MUSIC SYNTHESIZER
// Sử dụng Web Audio API để tạo nhạc nền piano lãng mạn và âm thanh lau kính
// Hoạt động 100% offline, không phụ thuộc network, chất lượng âm thanh êm ái
// ============================================================================

class AudioManager {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private isMuted = false;
  private masterGain: GainNode | null = null;
  private musicInterval: number | null = null;
  private wipeBuffer: AudioBuffer | null = null;
  private lastWipeSoundTime = 0;

  // Hợp âm giai điệu lãng mạn (Tần số nốt nhạc Hz)
  // Tiến trình Fmaj7 - Cadd9 - Dm7 - Bbmaj7 - Am7 - Gm7 - C
  private notes = {
    C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, Bb3: 233.08,
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, Bb4: 466.16,
    C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00
  };

  private melodySequence = [
    // Đoạn 1: Fmaj7 (F3, A3, C4, E4)
    { chord: ['F3', 'C4', 'A4'], arpeggio: ['C5', 'A4', 'E4', 'C4'], duration: 2.8 },
    // Đoạn 2: Cadd9 (C3, G3, D4, E4)
    { chord: ['C3', 'G3', 'E4'], arpeggio: ['D5', 'G4', 'E4', 'D4'], duration: 2.8 },
    // Đoạn 3: Dm7 (D3, A3, C4, F4)
    { chord: ['D3', 'A3', 'F4'], arpeggio: ['C5', 'F4', 'D4', 'A3'], duration: 2.8 },
    // Đoạn 4: Bbmaj7 (Bb3, D4, F4, A4)
    { chord: ['Bb3', 'F4', 'D4'], arpeggio: ['A4', 'F4', 'D4', 'Bb3'], duration: 2.8 },
    // Đoạn 5: Am7
    { chord: ['A3', 'E4', 'C4'], arpeggio: ['E5', 'C5', 'A4', 'E4'], duration: 2.8 },
    // Đoạn 6: Gm7
    { chord: ['G3', 'D4', 'Bb3'], arpeggio: ['D5', 'Bb4', 'G4', 'D4'], duration: 2.8 },
    // Đoạn 7: C7sus4 -> C
    { chord: ['C3', 'G3', 'F4'], arpeggio: ['G4', 'E4', 'D4', 'C4'], duration: 2.8 },
    // Đoạn 8: Fmaj9 kết nhẹ
    { chord: ['F3', 'C4', 'A4'], arpeggio: ['E5', 'C5', 'A4', 'F4'], duration: 3.5 }
  ];

  private currentMelodyStep = 0;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
      this.buildWipeNoiseBuffer();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Tạo âm thanh lau kính mờ bằng White Noise lọc dải tần (Gentle glass wiping swoosh)
  private buildWipeNoiseBuffer() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 0.15; // 150ms
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      // Noise kết hợp suy hao tự nhiên
      const t = i / bufferSize;
      const envelope = Math.sin(t * Math.PI);
      data[i] = (Math.random() * 2 - 1) * envelope;
    }
    this.wipeBuffer = buffer;
  }

  // Phát tiếng lau sương nhẹ
  public playWipeSound() {
    try {
      const now = Date.now();
      if (now - this.lastWipeSoundTime < 80) return; // Giới hạn tần suất phát
      this.lastWipeSoundTime = now;

      if (!this.ctx || !this.wipeBuffer || this.isMuted) return;

      const source = this.ctx.createBufferSource();
      source.buffer = this.wipeBuffer;

      // Filter tạo cảm giác ma sát mượt trên kính ướt
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(600 + Math.random() * 200, this.ctx.currentTime);
      filter.Q.setValueAtTime(1.2, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      const currentVolume = 0.08 + Math.random() * 0.05;
      gain.gain.setValueAtTime(currentVolume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.14);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain || this.ctx.destination);

      source.start();
    } catch {
      // Fallback êm ái
    }
  }

  // Đàn nốt piano giả lập bằng tổng hợp sóng âm ấm áp
  private playPianoNote(noteFreq: number, time: number, duration: number, velocity: number = 0.5) {
    if (!this.ctx || !this.masterGain) return;

    // Sóng sin cơ bản + họa âm sóng tam giác nhẹ
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(noteFreq, time);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(noteFreq * 2, time); // Họa âm bậc 2 tạo độ trong của piano

    // Filter làm ấm tiếng đàn
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(noteFreq * 3.5, time);
    filter.frequency.exponentialRampToValueAtTime(noteFreq * 1.5, time + duration);

    // ADSR Envelope (Attack nhanh, Decay & Release tự nhiên)
    const peakVolume = velocity * 0.22;
    noteGain.gain.setValueAtTime(0.0001, time);
    noteGain.gain.linearRampToValueAtTime(peakVolume, time + 0.02);
    noteGain.gain.exponentialRampToValueAtTime(peakVolume * 0.45, time + 0.4);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    const osc2Gain = this.ctx.createGain();
    osc2Gain.gain.value = 0.18; // Họa âm nhẹ

    osc1.connect(filter);
    osc2.connect(osc2Gain);
    osc2Gain.connect(filter);

    filter.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + duration + 0.1);
    osc2.stop(time + duration + 0.1);
  }

  // Vòng lặp phát bài nhạc piano êm dịu
  private scheduleNextMeasure() {
    if (!this.ctx || !this.isPlaying) return;

    const currentData = this.melodySequence[this.currentMelodyStep];
    const now = this.ctx.currentTime + 0.05;

    // Đánh hợp âm nền nhẹ
    currentData.chord.forEach((noteName) => {
      const freq = this.notes[noteName as keyof typeof this.notes];
      if (freq) {
        this.playPianoNote(freq, now, currentData.duration * 0.9, 0.25);
      }
    });

    // Rải arpeggio từng nốt
    const stepDuration = currentData.duration / currentData.arpeggio.length;
    currentData.arpeggio.forEach((noteName, idx) => {
      const freq = this.notes[noteName as keyof typeof this.notes];
      if (freq) {
        const noteTime = now + (idx * stepDuration);
        this.playPianoNote(freq, noteTime, stepDuration * 1.6, 0.45);
      }
    });

    this.currentMelodyStep = (this.currentMelodyStep + 1) % this.melodySequence.length;

    // Hẹn nhịp tiếp theo
    this.musicInterval = window.setTimeout(() => {
      if (this.isPlaying) {
        this.scheduleNextMeasure();
      }
    }, currentData.duration * 1000 - 50);
  }

  public startMusic() {
    this.initContext();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.currentMelodyStep = 0;
    this.scheduleNextMeasure();
  }

  public stopMusic() {
    this.isPlaying = false;
    if (this.musicInterval) {
      clearTimeout(this.musicInterval);
      this.musicInterval = null;
    }
  }

  public toggleMusic(): boolean {
    if (this.isPlaying) {
      this.stopMusic();
      return false;
    } else {
      this.startMusic();
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.35, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }
}

export const audioManager = new AudioManager();
