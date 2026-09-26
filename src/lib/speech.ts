// Browser-native STT/TTS (Web Speech API). Works in Chrome/Edge (incl. Chromium on Raspberry Pi) over HTTPS or localhost.

type Recognition = {
  lang: string;
  interimResults: boolean;
  onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void;
  onend: () => void;
  onerror: (e: { error: string }) => void;
  start: () => void;
  stop: () => void;
};

export function getRecognition(lang: string): Recognition | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
  const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
  if (!Ctor) return null;
  const r = new Ctor();
  r.lang = lang;
  r.interimResults = false;
  return r;
}

/** Speaks text; returns false when the device has no voice for this language (common for Bengali on desktop). */
export function speak(text: string, lang: string): boolean {
  if (typeof window === "undefined" || !window.speechSynthesis) return false;
  const synth = window.speechSynthesis;
  const base = lang.slice(0, 2);
  const voice = synth.getVoices().find((v) => v.lang.replace("_", "-") === lang) ?? synth.getVoices().find((v) => v.lang.startsWith(base));
  if (!voice && synth.getVoices().length > 0) return false;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  if (voice) u.voice = voice;
  u.rate = 0.95;
  synth.speak(u);
  return true;
}

export function stopSpeaking() {
  if (typeof window !== "undefined") window.speechSynthesis?.cancel();
}
