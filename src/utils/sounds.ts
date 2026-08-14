/**
 * Оюндар үчүн жеӊил, тышкы аудио файлсыз, Web Audio API менен синтезделген үндөр.
 * Ар бир функция коопсуз — AudioContext колдоого алынбаса же тыюу салынса, унчукпай эч нерсе кылбайт.
 */

let audioCtx: AudioContext | null = null;

const getContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return null;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => undefined);
  }
  return audioCtx;
};

const playTone = (frequencies: number[], duration: number, type: OscillatorType = 'sine') => {
  const ctx = getContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  frequencies.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    const start = now + i * 0.08;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.18, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + duration + 0.02);
  });
};

/** Туура жооп үчүн жагымдуу мажор аккорд. */
export const playCorrectSound = () => playTone([523.25, 659.25, 783.99], 0.16, 'sine');

/** Ката жооп үчүн төмөн, кыска "бузук" үн. */
export const playWrongSound = () => playTone([220, 155], 0.22, 'sawtooth');

/** Оюн/деӊгээл утулганда чыгуучу салтанаттуу аккорд. */
export const playWinSound = () => playTone([523.25, 659.25, 783.99, 1046.5], 0.2, 'triangle');
