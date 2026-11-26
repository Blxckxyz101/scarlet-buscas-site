"""Narração do ElevenLabs -> narr.wav (pausas cortadas + acelerada) e words.json (tempo de cada palavra do roteiro).

Uso:  python3 narracao.py narr_raw.mp3 narracao.txt PASTA_SAIDA [tempo=1.25]
Precisa: ffmpeg e faster-whisper (pip install faster-whisper).
Depois gere o epNwords.js pro motor (window.WORDS) com:  python3 narracao.py --js PASTA_SAIDA/words.json epNwords.js
"""
import sys, os, json, re, subprocess, difflib, unicodedata, wave

def norm(s):
    return re.sub(r'[^a-z0-9]', '', unicodedata.normalize('NFD', s.lower()).encode('ascii', 'ignore').decode())

def to_js(words_json, out_js):
    ws = json.load(open(words_json))
    # palavra "forte" (amarela na legenda): números, palavras longas, ou terminadas em ! ?
    res = []
    for x in ws:
        raw = x['w']; w = re.sub(r'[^\wÀ-ÿ-]', '', raw.lower())
        hi = bool(re.search(r'\d', raw)) or raw.endswith(('!', '?')) or len(w) >= 8
        res.append({'w': w, 'raw': raw, 's': x['s'], 'e': x['e'], 'hi': hi})
    open(out_js, 'w').write('window.WORDS=' + json.dumps(res, ensure_ascii=False) + ';\n')
    print(len(res), 'palavras ->', out_js, '(revise os "hi" à mão: palavra de impacto = amarela)')

def main():
    if sys.argv[1] == '--js':
        return to_js(sys.argv[2], sys.argv[3])
    mp3, txt, out = sys.argv[1:4]; tempo = float(sys.argv[4]) if len(sys.argv) > 4 else 1.25
    os.makedirs(out, exist_ok=True); P = lambda n: os.path.join(out, n)
    run = lambda *a: subprocess.run(['ffmpeg', '-v', 'error', '-y', *a], check=True)
    # 1) corta silêncio inicial, 2) limita pausas a 0,45 s, 3) acelera
    run('-i', mp3, '-af', 'silenceremove=start_periods=1:start_threshold=-45dB,aresample=48000', '-ac', '1', P('narr_trim.wav'))
    run('-i', P('narr_trim.wav'), '-af', f'silenceremove=stop_periods=-1:stop_duration=0.55:stop_threshold=-42dB:stop_silence=0.45,atempo={tempo}', P('narr.wav'))
    run('-i', P('narr.wav'), '-ar', '16000', '-ac', '1', P('n16.wav'))
    # 4) Whisper com tempo por palavra, alinhado ao texto do roteiro (o roteiro manda na grafia)
    import numpy as np
    from faster_whisper import WhisperModel
    w = wave.open(P('n16.wav')); a = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
    segs, _ = WhisperModel('small', compute_type='int8').transcribe(a, word_timestamps=True, language='pt')
    ws = [{'w': x.word.strip(), 's': round(x.start, 2), 'e': round(x.end, 2)} for s in segs for x in s.words]
    script = open(txt).read().split()
    A = [norm(x['w']) for x in ws]; B = [norm(x) for x in script]
    out_t = [None] * len(script)
    for tag, i1, i2, j1, j2 in difflib.SequenceMatcher(None, A, B, autojunk=False).get_opcodes():
        if tag == 'equal':
            for k in range(i2 - i1): out_t[j1 + k] = (ws[i1 + k]['s'], ws[i1 + k]['e'])
        elif i2 > i1:
            s0, e0 = ws[i1]['s'], ws[i2 - 1]['e']; n = j2 - j1
            for k in range(n): out_t[j1 + k] = (s0 + (e0 - s0) * k / n, s0 + (e0 - s0) * (k + 1) / n)
    for i, o in enumerate(out_t):
        if o is None:
            p = out_t[i - 1] if i and out_t[i - 1] else (0, 0); out_t[i] = (p[1], p[1] + .2)
    res = [{'w': script[i], 's': round(out_t[i][0], 2), 'e': round(out_t[i][1], 2)} for i in range(len(script))]
    json.dump(res, open(P('words.json'), 'w'), ensure_ascii=False)
    print(len(res), 'palavras; fim em', res[-1]['e'], 's  (alvo: 105 a 120 s)')

if __name__ == '__main__':
    main()
