# Trilha das demos, composta em código (a mesma ideia da aula 6.1) + "pops" nas trocas de cena.
import sys, wave
import numpy as np

saida, dur, tom = sys.argv[1], float(sys.argv[2]), sys.argv[3]
SR, BPM = 48000, 96
batida = 60 / BPM
acordes = {
    "maior": [[261.6, 329.6, 392.0], [196.0, 246.9, 293.7], [220.0, 261.6, 329.6], [174.6, 220.0, 261.6]],
    "menor": [[220.0, 261.6, 329.6], [174.6, 220.0, 261.6], [261.6, 329.6, 392.0], [196.0, 246.9, 293.7]],
}[tom]

def nota(freqs, d, vol=1.0):
    t = np.linspace(0, d, int(SR * d), endpoint=False)
    som = sum(np.sin(2 * np.pi * f * t) + 0.25 * np.sin(4 * np.pi * f * t) for f in freqs)
    return vol * som * np.minimum(1, t / 0.25) * np.exp(-t * 0.7) / len(freqs)

def pluck(f, d):
    t = np.linspace(0, d, int(SR * d), endpoint=False)
    return np.sin(2 * np.pi * f * t) * np.exp(-t * 9)

n = int(SR * dur)
pad = np.tile(np.concatenate([nota(a, batida * 4) for a in acordes]), 8)[:n]
mel = np.zeros(n)
escala = [523.3, 587.3, 659.3, 784.0, 880.0]
rng = np.random.default_rng(4)
for k in range(int(dur / (batida / 2))):
    if rng.random() < 0.55:
        i = int(k * batida / 2 * SR); s = pluck(escala[rng.integers(5)], 0.4)
        mel[i:i + len(s)] += s[: max(0, n - i)] * 0.25
# pop em cada troca de cena: abertura 2,4 s e depois a cada 2,6 s
pops = np.zeros(n)
t_pop = np.linspace(0, 0.12, int(SR * 0.12), endpoint=False)
pop = np.sin(2 * np.pi * (900 - 4000 * t_pop) * t_pop) * np.exp(-t_pop * 40)
for tc in np.arange(2.4, dur, 2.6):
    i = int(tc * SR); pops[i:i + len(pop)] += pop[: max(0, n - i)] * 0.6
audio = pad * 0.6 + mel + pops
fade = int(SR * 0.6); audio[-fade:] *= np.linspace(1, 0, fade)
audio = audio / np.max(np.abs(audio)) * 0.8
st = (np.stack([audio, audio], axis=1) * 32767).astype(np.int16)
with wave.open(saida, "wb") as f:
    f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes(st.tobytes())
