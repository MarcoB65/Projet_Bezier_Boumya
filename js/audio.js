export const rhythmPatterns = {
  basic: {
    name: "Base",
    pattern: [1, 0, 0, 0],
    description: "Pattern base - un colpo ogni quattro",
  },
  waltz: {
    name: "Valzer",
    pattern: [1, 0, 0],
    description: "Pattern valzer - un colpo ogni tre",
  },
  shuffle: {
    name: "Shuffle",
    pattern: [1, 0, 1, 0, 0, 0],
    description: "Pattern shuffle - due colpi ogni sei",
  },
  complex: {
    name: "Complesso",
    pattern: [1, 0, 1, 0, 1, 0, 0, 0],
    description: "Pattern complesso - tre colpi ogni otto",
  },
};

export class AudioManager {
  constructor() {
    this.currentScale = null;
    this.currentSpeed = 0.001;
    this.globalVolume = 0.2;
    this.currentRhythm = rhythmPatterns.complex;
    this.currentBeat = 0;
    this.isPlaying = false;
    this.delayTime = 0.3;
    this.delayFeedback = 0.3;
    this.noteCooldown = 275;
    this.lastNoteTime = 2;
    this.sequencer = null;
  }

  initialize(scale) {
    this.currentScale = scale;
    this.setupSequencer();
  }

  setupSequencer() {
    this.sequencer = new Tone.Sequence(
      (time, step) => {
        if (this.isPlaying && this.currentRhythm.pattern[step] === 1) {
          // Suona un suono di battuta
          this.synth.triggerAttackRelease("C2", "16n", time);
        }
        this.currentBeat = step;
      },
      this.currentRhythm.pattern,
      "16n"
    );
  }

  createSynth() {
    return new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: "sine",
      },
      envelope: {
        attack: 0.01,
        decay: 0.05,
        sustain: 0.2,
        release: 0.3,
      },
    }).toDestination();
  }

  createFilter() {
    return new Tone.Filter({
      type: "lowpass",
      frequency: 2000,
      Q: 1.5,
    }).toDestination();
  }

  createDelay() {
    return new Tone.FeedbackDelay({
      delayTime: this.delayTime,
      feedback: this.delayFeedback,
    }).toDestination();
  }

  playNote(note, synth, volume) {
    const currentTime = Date.now();
    if (currentTime - this.lastNoteTime >= this.noteCooldown) {
      synth.volume.value = Tone.gainToDb(volume);
      synth.triggerAttackRelease(note, "8n");
      this.lastNoteTime = currentTime;
      return true;
    }
    return false;
  }
}
