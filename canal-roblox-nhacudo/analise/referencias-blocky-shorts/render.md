# Render pipeline, determinism and QA

The template is Remotion 4.0.540 + three.js 0.186 via React Three Fiber, rendered in headless Chrome with WebGL
(`--gl=angle`). The engine in `template/src/engine/` provides the view, lights, sky, shadows, post chain and camera
maths; the blocky series code is in `template/src/blocky/`.

## Engine map
| file | what it does |
|---|---|
| `engine/core/View.tsx` | `<View mood cam t blur>`: the canvas, the camera set every render, lights, sky, shadows, post |
| `engine/core/moods.ts`, `engine/lookdev/` | light/fog/sky/grade presets; the blocky mood builds on them (`blocky/mood.ts`) |
| `engine/core/shadows.ts` | texel-snapped shadow box + a patch that removes three's screen-locked PCF dither |
| `engine/core/rig.ts` | `aim` (lens aimed so a point sits at a chosen height in the frame), beat moves, shake |
| `engine/core/frame.tsx` | fonts (waits for them) and `subFrame` timing for motion blur |
| `engine/post/` | the post chain: (ink, off for blocky), grade, bloom, depth of field, vignette, dither |
| `engine/mat/` | procedural painted textures (brick, siding, grass…), sky, glow |
| `engine/core/captions.tsx`, `ik.ts`, `kit.tsx`, `liquid.tsx`; `engine/char/` | captions, arm IK, mesh helpers, thick liquids, a neutral base character (unused by blocky) |

## Every frame is a pure function of the frame number
Remotion renders with several browser tabs, each with its own WebGL context. Anything that depends on history makes a
frame depend on which tab drew it and it flickers with the tab stride.
- No `Math.random`, `Date`, `performance.now`, `useFrame` deltas or accumulated physics. Derive everything from
  `t = frame / fps`; use seeded hashes (`hash`, `mulberry` in the template).
- Set cameras and shadow cameras every render and call `updateProjectionMatrix()`.
- No caches keyed by `Object3D.id`; bound every cache.
- Motion maths lives in plain functions (`blocky/motion.ts`) so `tools/check_motion.ts` and `tools/framing_check.ts`
  can evaluate exactly what the render shows.
- Z-fighting: decals ≥ 4 mm proud; coplanar boxes offset ≥ 1 cm; bars and frames only touch, never overlap.
- Cycles ≤ ~2 Hz, gestures ≤ ~4 rad/s, big lens moves ≥ ~0.85 s, or 4 blur samples separate into ghosts.

## One render on the GPU at a time
Two renders sharing a GPU lost GL state and produced dark frames. Wrap every `remotion render` and `remotion still` in
`scripts/gpu_lock.py` (an OS file lock released when the process ends, even after a crash):
`python scripts/gpu_lock.py -- npx --no-install remotion render …`. `render.sh` and `tools/stills.sh` already do. Concurrency ≤ 8
for finals, ≤ 3 for quick tests; a heavy scene can use > 10 GB of RAM at high concurrency.

## Motion blur
- A second composition at 4× fps and 4× frames (`BlockyTestSub`, `SUB = 4`). Sub-frame k of output frame n is drawn at
  `n + ((k + 0.5) / 4) · shutter − shutter / 2`. The shot (camera) is chosen by the **output** frame, so the 4 samples
  of one frame never mix two shots; captions are keyed to the output frame so text stays sharp.
- Shutter per shot: 126° by default, 72° on fast whole-body moves, 45° where big objects slide past a close lens.
- `render.sh` averages with ffmpeg:
  `tmix=frames=4:weights='1 1 1 1',select='eq(mod(n\,4)\,3)',setpts=N/30/TB`, `-r 30`.

## Render recipe (`template/render.sh`)
`bash render.sh <N> [COMP] [FRAMES]` → `out/renders/v<N>.mp4` (h264, crf 16, yuv420p, 30 fps, metadata stripped, no
audio track) + `v<N>_contact_sheet.jpg` (2 fps) + `v<N>_qa.txt`. It typechecks, bundles, renders the sub-frame
composition through the GPU lock, averages, and runs the QA scripts. It refuses to overwrite a version. A 3-second
smoke test: `bash render.sh 1 BlockyTestSub 0-89`.
To add sound later: render muted, then mux the mix with ffmpeg (copy video, AAC 256k, `-movflags +faststart`), loudness
two-pass to −14 LUFS, −1 dBTP.

## QA after every render
| check | tool | target |
|---|---|---|
| one-frame spikes, broken-tab stride | `scripts/flicker.py` | exit 3 = a broken tab; trace each spike on full frames (cuts and fast motion are legit) |
| pacing | `scripts/analyze_pacing.py` | hard cuts ~1 per 1.25–1.5 s, still frames < 6%, beats/min ≥ 60 |
| tone vs targets | `scripts/measure.py`, `scripts/compare.py` | `references/style.md` §3 |
| motion plausibility | `template/tools/checks.sh` | no sole below the press depth, no prop overlaps, no flower under a sole |
| framing | `template/tools/checks.sh` | every character inside the frame with its margin, faces never covered, no props at heads |
| eye check | the contact sheet, then full frames where something looks off | read it **muted**: does the story read? |
| frame count | `ffprobe -count_frames` | = duration × 30 |

## Working budget
Test stills at `--scale=0.4` (`tools/stills.sh`), render full resolution only for real versions, keep sub-agents few
with narrow briefs, look at contact sheets before single frames, and verify a critic's items on full frames.

## Versions, tools and sound (from a voiced Short)
- **Keep every version.** `render.sh` refuses an existing version number, keeps the raw sub-frame render as
  `v<N>_sub.mp4`, and writes a contact sheet + QA. Use `NAME=short_v bash render.sh <N> <Comp>Sub > out/renders/short_v<N>_render.txt 2>&1`
  for the full film (tests stay `v<N>`); never pipe a render through `grep`. `tools/stills.sh` refuses a used tag.
- **Before a full render:** typecheck, your numeric checks (`bash tools/checks.sh` for the template; for your own sets
  lens / overlap / framing / facing checks on the pattern of `tools/framing_check.ts`), then stills of every changed shot in batches of 3 with
  `tools/compare.sh <before-tag> <after-tag> <sheet.jpg> <frames…>`.
- **After a render:** `python tools/shot_sheet.py <video> <sheet.jpg>` (the middle frame of every shot, labelled) and
  `python tools/critic.py <video> <voiced.mp4>` (SYNC: every cut vs its word frame; STATIC: the longest near-still run,
  FAIL ≥ 2 s; EDGES: caption pixels vs the side edges, FAIL < 6 %; SOUND: the audio streams). Then 20 full frames for the
  eye, weighted to flagged shots and flicker spikes. Repeat until nothing important is left.
- **Voice:** `python vo/transcribe.py voice.wav script.txt vo/timings.json` (faster-whisper words aligned to the script's
  words; one turn per script line) → `python plan/plan_src.py vo/timings.json`.
- **Loudness:** two-pass `loudnorm` I −14 / TP −1 on the voice (`linear=true`), mux with `-c:v copy -c:a aac -b:a 256k`.
  Music and whooshes only from files you hold a licence for (none = the voice alone).
- **Windows:** the scripts skip the Microsoft Store `python3` stub on their own (`tools/pick_python.sh`); see SKILL.md
  for first-run downloads; ffprobe prints `\r` after numbers; keep
  shell scripts byte-exact; faster-whisper 1.2 needs `av<16`; a failed bundle can leave a half-written `build/` to delete.
