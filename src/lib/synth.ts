// Procedural Multi-Instrument Background Music Synthesizer utilizing Web Audio API
// High-fidelity virtual band with detuned pads, rhythmic groove bass, pentatonic melody leads, and dual-layer drums.

export interface AudioVibeConfig {
  bpm: number;
  chords: number[][]; // Frequency lists (Hz)
  synthType: "sine" | "triangle" | "sawtooth" | "square";
  filterCutoff: number;
  drumStyle: "lofi" | "upbeat" | "techno" | "minimal" | "ambient" | "synthwave" | "futurebass" | "bossa" | "acoustic";
  volume: number; // Volume multiplier
}

export class AudioVibeSynth {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private bpm = 100;
  private currentStep = 0;
  private nextStepTime = 0;
  private timerId: any = null;
  private mainGain: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private delayNode: DelayNode | null = null;
  private delayGain: GainNode | null = null;
  
  // Storage for standard chord progressions (frequencies in Hz)
  private chords: number[][] = []; 
  private currentChordIndex = 0;

  // Active oscillator collections for gentle releases
  private activeOscillators: OscillatorNode[] = [];

  // Pre-rendered master noise buffer to prevent ticks, stutters and clicks
  private noiseBuffer: AudioBuffer | null = null;

  constructor() {}

  // Parse user text input into procedural musical parameters
  private parseVibe(vibeText: string): AudioVibeConfig {
    const text = vibeText.toLowerCase();

    // 1. AMBIENT / CINEMATIC / COSMIC / HYPNOTIC / CALM / PAD / MEDITATION
    if (text.includes("ambient") || text.includes("cinematic") || text.includes("cosmic") || text.includes("pad") || text.includes("calm") || text.includes("meditat") || text.includes("drone") || text.includes("space") || text.includes("peaceful")) {
      return {
        bpm: 62,
        chords: [
          [220.00, 277.18, 329.63, 415.30], // Amaj7
          [174.61, 220.00, 261.63, 349.23], // Fmaj7
          [130.81, 155.56, 196.00, 261.63], // Cm7
          [196.00, 246.94, 293.66, 392.00]  // G6
        ],
        synthType: "sine",
        filterCutoff: 380, // Deep warm ambient air pad
        drumStyle: "ambient",
        volume: 0.35
      };
    }

    // 2. RETRO SYNTHWAVE / OUTRUN / 80S / COOPERATIVE / VAPORWAVE
    if (text.includes("synthwave") || text.includes("outrun") || text.includes("vaporwave") || text.includes("retro") || text.includes("80s") || text.includes("neon") || text.includes("arcade")) {
      return {
        bpm: 112,
        chords: [
          [220.00, 261.63, 329.63, 392.00], // Am7
          [261.63, 329.63, 392.00, 493.88], // Cmaj7
          [196.00, 246.94, 293.66, 392.00], // G
          [293.66, 349.23, 440.00, 523.25]  // Dm7
        ],
        synthType: "sawtooth",
        filterCutoff: 880, // Pumping retro gated analog vibe
        drumStyle: "synthwave",
        volume: 0.22
      };
    }

    // 3. FUTURE BASS / HYPERPOP / FUTURE / GLITCH / CHIPTUNE / HAPPY
    if (text.includes("future") || text.includes("hyperpop") || text.includes("glitch") || text.includes("chiptune") || text.includes("digital") || text.includes("modern tech")) {
      return {
        bpm: 140,
        chords: [
          [261.63, 329.63, 392.00, 493.88], // Cmaj7
          [349.23, 440.00, 523.25, 659.25], // Fmaj7
          [392.00, 440.00, 587.33, 698.46], // G7
          [220.00, 261.63, 329.63, 392.00]  // Am7
        ],
        synthType: "sawtooth",
        filterCutoff: 1500, // Very bright sound
        drumStyle: "futurebass",
        volume: 0.18
      };
    }

    // 4. BOSSA NOVA / SUMMER LOUNGE / LATIN / TROPICAL / SAMBA / SALSA / BEACH
    if (text.includes("bossa") || text.includes("latin") || text.includes("samba") || text.includes("tropical") || text.includes("beach") || text.includes("summer") || text.includes("lounge")) {
      return {
        bpm: 115,
        chords: [
          [261.63, 329.63, 392.00, 440.00], // Cmaj6
          [220.00, 277.18, 329.63, 392.00], // A7
          [293.66, 349.23, 440.00, 523.25], // Dm7
          [196.00, 246.94, 293.66, 349.23]  // G7
        ],
        synthType: "triangle",
        filterCutoff: 1100, // Soft organic acoustic lounge tone
        drumStyle: "bossa",
        volume: 0.28
      };
    }

    // 5. INDIE ACOUSTIC / FOLK / PLUCK / COZY / WARM / SUNNY / MORNING
    if (text.includes("acoustic") || text.includes("folk") || text.includes("pluck") || text.includes("indie") || text.includes("cozy") || text.includes("sunny") || text.includes("morning") || text.includes("organic")) {
      return {
        bpm: 102,
        chords: [
          [261.63, 329.63, 392.05, 523.25], // C Major
          [349.23, 440.00, 523.25, 698.46], // F Major
          [196.00, 246.94, 293.66, 392.00], // G Major
          [220.00, 261.63, 329.63, 440.00]  // Am
        ],
        synthType: "sine",
        filterCutoff: 1300, // Very organic resonant plucking filter
        drumStyle: "acoustic",
        volume: 0.30
      };
    }

    // 6. CHILL JAZZ / LOFI / BOOM BAP / HIP HOP / SUNSET / SLOW / JAZZY / SLEEPY / DEEP / RELAX
    if (text.includes("lofi") || text.includes("lo-fi") || text.includes("chill") || text.includes("sunset") || text.includes("slow") || text.includes("evening") || text.includes("jazz") || text.includes("relax")) {
      return {
        bpm: 78,
        chords: [
          [130.81, 196.00, 246.94, 293.66, 329.63], // Cmaj9
          [110.00, 164.81, 220.00, 261.63, 329.63], // Amin9
          [174.61, 220.00, 261.63, 349.23, 392.00], // Fmaj9
          [146.83, 196.00, 220.00, 293.66, 349.23]  // G11
        ],
        synthType: "triangle",
        filterCutoff: 520, // Soft, dusty, filtered analog tape feel
        drumStyle: "lofi",
        volume: 0.32
      };
    }

    // 7. TECHNO / HOUSE / ELECTRO / CYBERPUNK / DANCE / CLUB / INDUSTRIAL / RAVE
    if (text.includes("tech") || text.includes("house") || text.includes("club") || text.includes("electro") || text.includes("edm") || text.includes("cyber") || text.includes("dance") || text.includes("rave") || text.includes("industrial")) {
      return {
        bpm: 125,
        chords: [
          [220.00, 261.63, 329.63, 392.00], // Am7
          [174.61, 220.00, 261.63, 329.63], // Fmaj7
          [164.81, 196.00, 246.94, 293.66], // Em7
          [146.83, 174.61, 220.00, 261.63]  // Dm7
        ],
        synthType: "sawtooth",
        filterCutoff: 1000, // Pumping aggressive cutoff filter
        drumStyle: "techno",
        volume: 0.20
      };
    }

    // 8. BRIGHT UPBEAT / POP / COMMERCIAL / EXCITED / SHORTS
    if (text.includes("upbeat") || text.includes("pop") || text.includes("commercial") || text.includes("fast") || text.includes("excited") || text.includes("happy")) {
      return {
        bpm: 130,
        chords: [
          [261.63, 329.63, 392.00, 523.25], // C Major
          [293.66, 369.99, 440.00, 587.33], // D Major
          [220.00, 261.63, 329.63, 440.00], // Am
          [349.23, 440.00, 523.25, 698.46]  // F Major
        ],
        synthType: "triangle",
        filterCutoff: 1400, // Clear open bright pop chords
        drumStyle: "upbeat",
        volume: 0.26
      };
    }

    // DEFAULT (MILD NEUTRAL ACCOUSTIC LOUNGE BACKING)
    return {
      bpm: 96,
      chords: [
        [261.63, 329.63, 392.00, 493.88], // Cmaj7
        [349.23, 440.00, 523.25, 659.25], // Fmaj7
        [293.66, 349.23, 440.00, 523.25], // Dm7
        [196.00, 246.94, 293.66, 349.23]  // G7
      ],
      synthType: "sine",
      filterCutoff: 1250,
      drumStyle: "minimal",
      volume: 0.28
    };
  }

  // Set ducking volume (used when TTS voiceover is playing to avoid clashing)
  public setDucking(isDucked: boolean) {
    if (!this.isPlaying || !this.mainGain || !this.ctx) return;
    const targetVolume = isDucked ? 0.05 : 1.0;
    
    // Smoothly transition volume in 0.25 seconds to sound organically blended
    this.mainGain.gain.setValueAtTime(this.mainGain.gain.value, this.ctx.currentTime);
    this.mainGain.gain.linearRampToValueAtTime(targetVolume, this.ctx.currentTime + 0.25);
  }

  // Start synthesizing background tracks
  public start(vibeText: string) {
    if (this.isPlaying) {
      this.stop();
    }

    try {
      const AudioCtxConstructor = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxConstructor) {
        console.warn("Web Audio API is not supported in this browser environment.");
        return;
      }

      this.ctx = new AudioCtxConstructor();
      this.isPlaying = true;
      this.currentStep = 0;
      this.currentChordIndex = 0;

      const config = this.parseVibe(vibeText);
      this.bpm = config.bpm;
      this.chords = config.chords;

      // 1. Pre-generate procedural Master Noise buffer (2 seconds long) for dust, crackle, snare, hats
      const sampleRate = this.ctx.sampleRate;
      this.noiseBuffer = this.ctx.createBuffer(1, sampleRate * 2, sampleRate);
      const noiseData = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < noiseData.length; i++) {
        noiseData[i] = Math.random() * 2 - 1;
      }

      // 2. Create Routing Nodes
      this.mainGain = this.ctx.createGain();
      this.mainGain.gain.setValueAtTime(config.volume, this.ctx.currentTime);

      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = "lowpass";
      this.filterNode.frequency.setValueAtTime(config.filterCutoff, this.ctx.currentTime);
      this.filterNode.Q.setValueAtTime(1.2, this.ctx.currentTime);

      // 3. Create a beautiful echo delay line to make virtual instruments feel spacious & "not dry"
      this.delayNode = this.ctx.createDelay(1.0);
      this.delayGain = this.ctx.createGain();
      
      // Delay time matches quarter notes or dotted eighths for rhythmic feedback
      const delayTimeSeconds = 60 / this.bpm * 0.75; 
      this.delayNode.delayTime.setValueAtTime(delayTimeSeconds, this.ctx.currentTime);
      this.delayGain.gain.setValueAtTime(0.25, this.ctx.currentTime); // feedback volume

      // Route: Synths -> Filter -> Delay -> Main Gain
      // Feedback loop routing
      this.filterNode.connect(this.delayNode);
      this.delayNode.connect(this.delayGain);
      this.delayGain.connect(this.filterNode); // back for feedback

      // Direct signals
      this.filterNode.connect(this.mainGain);
      this.delayNode.connect(this.mainGain);

      // Final Master connect
      this.mainGain.connect(this.ctx.destination);

      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }

      // 4. Launch dynamic high-precision step sequencer
      this.nextStepTime = this.ctx.currentTime + 0.05;
      this.scheduler(config);

    } catch (err) {
      console.error("Failed to start procedural audio composer:", err);
    }
  }

  // Step Scheduler running continuously on high precision
  private scheduler(config: AudioVibeConfig) {
    if (!this.isPlaying || !this.ctx) return;

    // Look-ahead schedule loop (schedule events 120ms in advance)
    const lookAhead = 0.12; 
    const stepDuration = 60 / this.bpm / 4; // 16th notes duration

    while (this.nextStepTime < this.ctx.currentTime + lookAhead) {
      this.playStep(this.currentStep, this.nextStepTime, config);
      
      this.currentStep = (this.currentStep + 1) % 16;
      this.nextStepTime += stepDuration;

      // Rotate chords every 8 steps
      if (this.currentStep % 8 === 0) {
        this.currentChordIndex = (this.currentChordIndex + 1) % this.chords.length;
      }
    }

    // Call timer recursively every 20ms
    this.timerId = setTimeout(() => this.scheduler(config), 20);
  }

  // Play step elements combining chords, bass, leads and drums
  private playStep(step: number, time: number, config: AudioVibeConfig) {
    if (!this.ctx || !this.filterNode || !this.mainGain) return;

    const currentChord = this.chords[this.currentChordIndex];
    const rootFreq = currentChord[0];

    // ==========================================
    // 1. Lush detuned chords (Rhodes/analog keys)
    // ==========================================
    if (step % 8 === 0) {
      // Swell chords on beat 1 and beat 3
      const duration = (60 / this.bpm) * 1.8; // Legato length
      
      currentChord.forEach((freq, idx) => {
        if (!this.ctx || !this.filterNode) return;

        // Spread chord notes across 15ms intervals to emulate a guitarist's gentle strum or human keyboard player
        const noteTime = time + (idx * 0.015);

        // We use TWO detuned oscillators per note to create a massive chorus/moving keyboard layer!
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();

        // High fidelity configuration: matching sine or warm triangles
        osc1.type = config.synthType === "sawtooth" ? "triangle" : config.synthType;
        osc2.type = osc1.type;

        // Pitched down slightly to make it an elegant lush base piano
        osc1.frequency.setValueAtTime(freq / 2, noteTime);
        osc2.frequency.setValueAtTime((freq / 2) + 0.8, noteTime); // detuned 0.8 Hz higher

        noteGain.gain.setValueAtTime(0, noteTime);
        // Soft swell attack
        noteGain.gain.linearRampToValueAtTime(0.065, noteTime + 0.12);
        noteGain.gain.setValueAtTime(0.065, noteTime + duration - 0.15);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, noteTime + duration);

        osc1.connect(noteGain);
        osc2.connect(noteGain);
        noteGain.connect(this.filterNode);

        osc1.start(noteTime);
        osc2.start(noteNote(noteTime));
        osc1.stop(noteTime + duration);
        osc2.stop(noteTime + duration);

        this.activeOscillators.push(osc1, osc2);
      });
    }

    // Helper safety wrapper
    function noteNote(t: number) { return t; }

    // ==========================================
    // 2. Groovy sliding bass synthesizer
    // ==========================================
    // Bass plays on rhythmic steps to drive momentum (e.g., roots and fifths)
    let playBass = false;
    let bassOctaveDivisor = 4; // Down 2 octaves
    let bassFreq = rootFreq / bassOctaveDivisor;

    if (config.drumStyle === "techno") {
      // Techno has driving constant 16th walking bass lines
      playBass = (step % 2 === 0);
      bassFreq = currentChord[step % 2 === 0 ? 0 : 2] / 4;
    } else if (config.drumStyle === "synthwave") {
      // Synthwave octave pumping outrun bass lines
      playBass = (step % 2 === 0);
      const isAlt = (step % 4 === 2);
      bassFreq = (rootFreq / 4) * (isAlt ? 1.5 : 1.0);
    } else if (config.drumStyle === "lofi") {
      // Lofi bass walks on syncopated roots
      playBass = (step === 0 || step === 3 || step === 6 || step === 10 || step === 12);
      if (step === 3) bassFreq = currentChord[2] / 4; // Fifth
      if (step === 10) bassFreq = currentChord[1] / 4; // Third
    } else if (config.drumStyle === "bossa") {
      // Bossa syncopated key bass swing
      playBass = (step === 0 || step === 4 || step === 6 || step === 10 || step === 14);
      if (step === 6 || step === 14) bassFreq = currentChord[1] / 4; // Fifth alternation
    } else if (config.drumStyle === "upbeat" || config.drumStyle === "futurebass") {
      playBass = (step === 0 || step === 3 || step === 8 || step === 11);
    } else {
      // Default warm ambient bass support
      playBass = (step === 0 || step === 8);
    }

    if (playBass) {
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      const bassFilter = this.ctx.createBiquadFilter();

      // Deep, classic retro warm analog synth tone (lowpass sawtooth on low frequencies)
      bassOsc.type = "sawtooth";
      bassOsc.frequency.setValueAtTime(bassFreq, time);

      bassFilter.type = "lowpass";
      bassFilter.frequency.setValueAtTime(140, time); // Strictly under 140Hz for massive rumbling bass

      bassGain.gain.setValueAtTime(0, time);
      bassGain.gain.linearRampToValueAtTime(0.24, time + 0.02);
      // Legato decay time
      const bassDecay = (60 / this.bpm) * (config.drumStyle === "lofi" ? 0.45 : config.drumStyle === "techno" ? 0.15 : 0.6);
      bassGain.gain.exponentialRampToValueAtTime(0.0001, time + bassDecay);

      bassOsc.connect(bassFilter);
      bassFilter.connect(bassGain);
      bassGain.connect(this.mainGain); // bypass standard filter so bass is thick and unaffected!

      bassOsc.start(time);
      bassOsc.stop(time + bassDecay + 0.02);

      this.activeOscillators.push(bassOsc);
    }

    // ==========================================
    // 3. Composed Pentatonic Melody Lead Generator
    // ==========================================
    // An intelligent virtual lead player that plays key-conforming chime melodies on syncopated beats!
    let playLead = false;
    if (config.drumStyle === "lofi" && (step === 3 || step === 7 || step === 11 || step === 13)) {
      playLead = true;
    } else if (config.drumStyle === "ambient" && (step === 2 || step === 9 || step === 14)) {
      playLead = true;
    } else if (config.drumStyle === "acoustic" && (step % 4 === 2 || step === 15)) {
      playLead = true;
    } else if (config.drumStyle === "bossa" && (step === 2 || step === 5 || step === 9 || step === 13)) {
      playLead = true;
    } else if (config.drumStyle === "futurebass" && (step % 4 === 1)) {
      playLead = true;
    } else if (config.drumStyle === "techno" && (step % 4 === 0 && step !== 0)) {
       playLead = true;
    } else if (config.drumStyle === "upbeat" && (step === 2 || step === 6 || step === 11 || step === 14)) {
      playLead = true;
    }

    if (playLead) {
      // Build a major/minor pentatonic scale based on current chord indices
      const scaleDegrees = [0, 1, 2, 3, currentChord.length - 1];
      const randomDegree = scaleDegrees[Math.floor(Math.random() * scaleDegrees.length)];
      // Pitched up 1 octave for standard melody range
      const leadFreq = currentChord[randomDegree] * 2.0;

      const leadOsc = this.ctx.createOscillator();
      const leadGain = this.ctx.createGain();

      // Delicate virtual lead bells or guitar-like plucks
      leadOsc.type = "sine";
      leadOsc.frequency.setValueAtTime(leadFreq, time);

      // Sweet humanized vibrato (frequency modulation) to sound alive
      const vibrato = this.ctx.createOscillator();
      const vibratoGain = this.ctx.createGain();
      vibrato.type = "sine";
      vibrato.frequency.setValueAtTime(6.5, time); // 6.5 Hz shake
      vibratoGain.gain.setValueAtTime(3.5, time); // ±3.5 Hz sweep

      vibrato.connect(vibratoGain);
      vibratoGain.connect(leadOsc.frequency);

      leadGain.gain.setValueAtTime(0, time);
      leadGain.gain.linearRampToValueAtTime(0.045, time + 0.015);
      const leadDecayTime = config.drumStyle === "ambient" ? 0.65 : 0.28;
      leadGain.gain.exponentialRampToValueAtTime(0.0001, time + leadDecayTime);

      leadOsc.connect(leadGain);
      // Connect to Filter route so delays/echos make it sound magical and floating
      leadGain.connect(this.filterNode);

      vibrato.start(time);
      leadOsc.start(time);
      vibrato.stop(time + leadDecayTime + 0.01);
      leadOsc.stop(time + leadDecayTime + 0.01);

      this.activeOscillators.push(leadOsc, vibrato);
    }

    // ==========================================
    // 4. Heavy-duty organic Drum Machine
    // ==========================================
    
    // --- KICK DRUM ENGINE ---
    let playKick = false;
    if (config.drumStyle === "techno" && (step % 4 === 0)) playKick = true;
    else if (config.drumStyle === "synthwave" && (step % 4 === 0)) playKick = true;
    else if (config.drumStyle === "upbeat" && (step % 4 === 0)) playKick = true;
    else if (config.drumStyle === "futurebass" && (step === 0 || step === 8 || step === 11 || step === 14)) playKick = true;
    else if (config.drumStyle === "bossa" && (step === 0 || step === 3 || step === 8 || step === 11)) playKick = true;
    else if (config.drumStyle === "lofi" && (step === 0 || step === 5 || step === 10)) playKick = true;
    else if (config.drumStyle === "acoustic" && (step === 0 || step === 8)) playKick = true;
    else if (config.drumStyle === "minimal" && (step === 0 || step === 8)) playKick = true;
    else if (config.drumStyle === "ambient" && step === 0) playKick = true;

    if (playKick) {
      const kickOsc = this.ctx.createOscillator();
      const kickGain = this.ctx.createGain();

      kickOsc.type = "sine";
      // Dual pitch sweep envelope: rapid drop from high-transient to deep sub rumble
      const startHz = config.drumStyle === "techno" ? 180 : config.drumStyle === "lofi" ? 130 : 150;
      const endHz = config.drumStyle === "ambient" ? 42 : 50;
      kickOsc.frequency.setValueAtTime(startHz, time);
      kickOsc.frequency.exponentialRampToValueAtTime(endHz, time + 0.10);

      // Punchy volume envelope with sharp clip
      const kickVol = config.drumStyle === "ambient" ? 0.14 : config.drumStyle === "lofi" ? 0.32 : 0.40;
      kickGain.gain.setValueAtTime(kickVol, time);
      kickGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.18);

      kickOsc.connect(kickGain);
      kickGain.connect(this.mainGain); // bypass high lowpass filter so kick has pure clarity!

      kickOsc.start(time);
      kickOsc.stop(time + 0.20);
    }

    // --- SNARE DRUM ENGINE (Noise burst + 180Hz acoustic body pop) ---
    let playSnare = false;
    let snareVolume = 0.12;
    let snareBandpass = 1000;

    if (config.drumStyle === "techno" && (step === 4 || step === 12)) playSnare = true;
    else if (config.drumStyle === "synthwave" && (step === 4 || step === 12)) { playSnare = true; snareVolume = 0.15; }
    else if (config.drumStyle === "upbeat" && (step === 4 || step === 12)) playSnare = true;
    else if (config.drumStyle === "futurebass" && (step === 4 || step === 12)) { playSnare = true; snareVolume = 0.18; snareBandpass = 1300; }
    else if (config.drumStyle === "lofi" && (step === 4 || step === 12)) { playSnare = true; snareVolume = 0.085; snareBandpass = 800; }
    else if (config.drumStyle === "acoustic" && (step === 4 || step === 12)) { playSnare = true; snareVolume = 0.06; snareBandpass = 1800; }
    else if (config.drumStyle === "bossa" && (step === 4 || step === 10 || step === 12)) { playSnare = true; snareVolume = 0.05; snareBandpass = 2000; }
    else if (config.drumStyle === "minimal" && step === 8) playSnare = true;

    if (playSnare && this.noiseBuffer) {
      // Layer 1: Filtered high-quality noise burst
      const noiseNode = this.ctx.createBufferSource();
      noiseNode.buffer = this.noiseBuffer;
      
      const snareFilter = this.ctx.createBiquadFilter();
      snareFilter.type = "bandpass";
      snareFilter.frequency.setValueAtTime(snareBandpass, time);
      snareFilter.Q.setValueAtTime(1.5, time);

      const snareGain = this.ctx.createGain();
      snareGain.gain.setValueAtTime(snareVolume, time);
      snareGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.14);

      noiseNode.connect(snareFilter);
      snareFilter.connect(snareGain);
      snareGain.connect(this.mainGain);

      // Layer 2: 175Hz acoustic "body sweep" tone (gives the physical snare real drum presence & pop!)
      const snappyOsc = this.ctx.createOscillator();
      const snappyGain = this.ctx.createGain();
      snappyOsc.type = "triangle";
      snappyOsc.frequency.setValueAtTime(175, time);
      snappyOsc.frequency.exponentialRampToValueAtTime(80, time + 0.08);

      snappyGain.gain.setValueAtTime(snareVolume * 0.7, time);
      snappyGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.08);

      snappyOsc.connect(snappyGain);
      snappyGain.connect(this.mainGain);

      noiseNode.start(time);
      snappyOsc.start(time);
      
      noiseNode.stop(time + 0.18);
      snappyOsc.stop(time + 0.18);
    }

    // --- HI-HAT / SEED SHAKERS ENGINE ---
    let playHat = false;
    let hatVolume = 0.04;
    let hatHighpass = 7000;

    if (config.drumStyle === "techno" && (step % 4 === 2)) {
      playHat = true; // Off-beat high-pass house pump
      hatVolume = 0.08;
    } else if (config.drumStyle === "synthwave" && (step % 2 === 1)) {
      playHat = true;
      hatVolume = 0.045;
    } else if (config.drumStyle === "futurebass") {
      // Fast rap-trap hat rolls (rolls on semi-steps)
      if (step % 2 === 1 || step === 14 || step === 15) {
        playHat = true;
        hatVolume = (step >= 14) ? 0.07 : 0.035;
        hatHighpass = 8500;
      }
    } else if (config.drumStyle === "bossa" && (step % 2 === 0)) {
      playHat = true; // Bouncy latin maraca loop
      hatVolume = 0.035;
      hatHighpass = 6500;
    } else if (config.drumStyle === "acoustic" && (step % 2 === 1)) {
      playHat = true;
      hatVolume = 0.032;
    } else if (config.drumStyle === "lofi" && (step % 2 === 1)) {
      playHat = true;
      hatVolume = 0.025;
    } else if (config.drumStyle === "upbeat" && (step % 2 === 1)) {
      playHat = true;
      hatVolume = 0.055;
    } else if (config.drumStyle === "ambient" && (step % 8 === 4)) {
      playHat = true; // Ocean wind chime loop
      hatVolume = 0.01;
      hatHighpass = 4000;
    }

    if (playHat && this.noiseBuffer) {
      const hatSource = this.ctx.createBufferSource();
      hatSource.buffer = this.noiseBuffer;

      const hatFilter = this.ctx.createBiquadFilter();
      hatFilter.type = "highpass";
      hatFilter.frequency.setValueAtTime(hatHighpass, time);

      const hatGain = this.ctx.createGain();
      hatGain.gain.setValueAtTime(hatVolume, time);
      const hatDecay = config.drumStyle === "ambient" ? 0.28 : 0.045;
      hatGain.gain.exponentialRampToValueAtTime(0.0001, time + hatDecay);

      hatSource.connect(hatFilter);
      hatFilter.connect(hatGain);
      hatGain.connect(this.mainGain);

      hatSource.start(time);
      hatSource.stop(time + hatDecay + 0.01);
    }

    // ==========================================
    // 5. Ambient Vinyl dust static crackles
    // ==========================================
    // Gives lofi beats an incredible, cozy warmth
    if (config.drumStyle === "lofi" && this.noiseBuffer && Math.random() < 0.25) {
      const popSource = this.ctx.createBufferSource();
      popSource.buffer = this.noiseBuffer;

      const popFilter = this.ctx.createBiquadFilter();
      popFilter.type = "bandpass";
      popFilter.frequency.setValueAtTime(1500 + (Math.random() * 3000), time);
      popFilter.Q.setValueAtTime(12, time); // highly resonant pop focus

      const popGain = this.ctx.createGain();
      popGain.gain.setValueAtTime(0.005, time);
      popGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.008);

      popSource.connect(popFilter);
      popFilter.connect(popGain);
      popGain.connect(this.mainGain);

      popSource.start(time);
      popSource.stop(time + 0.02);
    }
  }

  // Stop everything instantly
  public stop() {
    this.isPlaying = false;
    
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }

    // Stop and discharge active oscillators
    this.activeOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {}
    });
    this.activeOscillators = [];

    if (this.mainGain) {
      try {
        this.mainGain.disconnect();
      } catch (e) {}
      this.mainGain = null;
    }

    if (this.filterNode) {
      try {
        this.filterNode.disconnect();
      } catch (e) {}
      this.filterNode = null;
    }

    if (this.delayNode) {
      try {
        this.delayNode.disconnect();
      } catch (e) {}
      this.delayNode = null;
    }

    if (this.delayGain) {
      try {
        this.delayGain.disconnect();
      } catch (e) {}
      this.delayGain = null;
    }

    if (this.ctx) {
      try {
        this.ctx.close();
      } catch (e) {}
      this.ctx = null;
    }
  }
}

// Export pre-initialized singleton for simple imports
export const vibeTrackSynth = new AudioVibeSynth();
