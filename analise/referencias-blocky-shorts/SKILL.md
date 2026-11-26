---
name: blocky-shorts
description: Make vertical "in this world…" animated Shorts with blocky toy-like 3D characters (our own original characters and worlds) in Remotion + three.js - the story formula (rule, hook, twist, ending, titles), the look (blocky character family, decal faces, cinematic key/fill/rim light, palette), the edit (hard cuts every ~1.4 s with constant push-ins, word-synced to a voice-over), a working 10 s template with a character builder, a library of reusable characters (aliens with accessories, humans), planets and store/room props and sets, Whisper word timing, motion blur, a GPU lock, numeric framing and motion checks, a strict critic loop, and every pitfall found in testing. Use when planning, building, rendering or fixing a blocky 3D Short or a scene with blocky avatars.
---

# Blocky Shorts

Build narrated or silent vertical Shorts (1080×1920, 30 fps) in a blocky-avatar world: rigid toy-like characters with
flat decal faces, cinematic game-engine light, a hard cut every ~1.4 s and a camera that never rests. Everything needed
is inside this folder; all paths below are relative to it. History: `CHANGELOG.md`.

| file | what it is |
|---|---|
| `references/scripts.md` | the story formula: hook at 0.0 s, the world's rule, twist at ~70%, ending, length, titles |
| `references/style.md` | the look as rules and numbers; §8 the premium pass (light, planets, sets, characters) |
| `references/pitfalls.md` | every defect found in testing and its rule (round 1: the 10 s template; round 2: a voiced Short) |
| `references/render.md` | engine map, determinism, GPU lock, motion blur, render recipe, QA, versions, tools, sound, Windows |
| `template/` | the 10 s example as a Remotion project (our own characters and world) |
| `template/src/blocky/` | `Blocky.tsx` character builder (eye scale, catch-lights, antennae, hats, bags, aprons, glasses, backpacks, held/chest props), `World.tsx` suburb, `Flowers.tsx`, `Contact.tsx`, `mood.ts`, `motion.ts`, `plan.ts`, `BlockyTest.tsx` |
| `template/src/library/` | **reusable for the next Short:** `characters.ts` (alien looks + pose kit + `alive()` + `pop()`), `planets.tsx` (planets with atmospheres, swirling bands, storms, banded rings, Earth), `props.tsx` (jar, tags, holo tags, neon signs, shelves, counter, catalog, card, rocket car, saucers, sandwich, flashlight), `sets.tsx` (planet store, kid's room at night, shop in space, fake AO), `layout.ts`, `mood.ts` (cinematic scene moods), `PopCaptions.tsx` |
| `template/src/engine/` | view, lights, sky, shadows, post chain, materials, camera maths, captions |
| `template/render.sh`, `template/tools/` | versioned render (never overwrites, keeps the sub-frame render); `stills.sh`, `compare.sh` (before/after), `shot_sheet.py` (every shot), `critic.py` (sync, static, edges, sound), `checks.sh` (the template's motion + framing) |
| `template/vo/transcribe.py` | word timings: faster-whisper aligned to the script's words |
| `scripts/` | `gpu_lock.py`, `flicker.py`, `analyze_pacing.py`, `measure.py`, `compare.py` (Python 3; numpy, Pillow for compare) |
| `LICENSE`, `THIRD_PARTY_NOTICES.md` | MIT for this skill; notices for included third-party code and the Poppins fonts (OFL); copies in `template/` so a project keeps them; Remotion's own license |

## Requirements
Node 18+ (tested with 22 and 26), ffmpeg + ffprobe on PATH, Python 3 with numpy (Pillow for `compare.py`), for voiced
Shorts `faster-whisper` (with `av<16`), a GPU with WebGL in headless Chrome, bash (Git Bash on Windows). `render.sh` and
`stills.sh` find Python themselves (`tools/pick_python.sh`: python3, python, `py -3`, the first that runs Python 3 with
numpy, so the Windows Store `python3` stub is skipped); `PYTHON=/path/to/python` overrides.

**First-run downloads** (the skill's own code makes no network calls; npm itself talks to registry.npmjs.org on
`npm ci`, its audit, and `npx --no-install` lookups): `npm ci` installs the
locked npm packages from registry.npmjs.org; the first `render.sh` or `stills.sh` makes Remotion download Chrome
Headless Shell (~300 MB unpacked, from remotion.media or Google's Chrome for Testing storage) into
`node_modules/.remotion/`; the first `vo/transcribe.py` downloads the Whisper `small` model (~0.5 GB) from Hugging Face
into `~/.cache/huggingface/` (set `HF_HOME` to move it; afterwards `HF_HUB_OFFLINE=1` works offline). The scripts call
`npx --no-install`, so a missing `npm ci` fails instead of fetching packages. Python packages, in a venv if you
like: `python -m pip install numpy pillow "faster-whisper==1.2.*" "av<16"`.

**Remotion's license:** Remotion is not open source and is not covered by this skill's MIT license: `npm ci` installs
it under the Remotion License (https://www.remotion.dev/docs/license). It is free for individuals, for-profit
companies with up to 3 employees, non-profits and evaluation; any larger company needs a Remotion Company License
before using it (https://www.remotion.dev/docs/license/pricing). The other npm dependencies keep their own licenses.

## Workflow: idea → final render
1. **Start a project.** Copy `template/` to a new folder and `scripts/` into it as `scripts/`. `npm ci`. Smoke test:
   `bash render.sh 1 BlockyTestSub 0-89`. Build your story's sets and cast from `src/library/`, in your own
   composition (with a `<Comp>Sub` variant at 4 sub-frames per frame for motion blur, like `BlockyTestSub`).
2. **Write the idea** with `references/scripts.md`. For a voiced Short: `python vo/transcribe.py voice.wav script.txt vo/timings.json`
   (never pass the script to Whisper as a prompt), then anchor every shot to a word in `plan/plan_src.py` and run it
   (writes `src/plan.gen.ts` + a readable `plan/SHOTS.md`). A cut every ~1.25–1.5 s, the store/world in frame 0.
3. **Design the cast** inside the one family (`style.md` §1, §8): one silhouette each (an accessory set), one saturated
   colour each. Start from `library/characters.ts`. Never import a game's avatars, logos or textures.
4. **Build the world** from `library/sets.tsx` / `blocky/World.tsx`: products in two rows, signs, extras, a foreground
   layer for every shot, fake AO in every corner.
5. **Stage and shoot**: poses as pure functions of `t` with `alive()` on everyone and `pop()` on big moves (≥ 0.7 s);
   lenses as subject + offset or a fixed position. Point / wave with the arm far from the lens; extras off every lens
   line; small characters on hidden boxes behind furniture; followers walk behind the hero.
6. **Light** with `library/mood.ts`: key + fill + strong rim per shot, one mood per scene, bloom on emissives
   (`setMoodShots(whisperIds, endingIds)` picks the shots that get the darker whisper and the golden ending moods).
7. **Numbers first:** typecheck after every edit, then numeric checks until 0 issues: `bash tools/checks.sh` runs the
   template's (motion + framing); for your own story write the same kind of checks on the pattern of
   `tools/framing_check.ts` (lens inside things, blocked views, overlaps, heads out of frame, faces turned away).
   A hard lens: search positions numerically.
8. **Look-dev stills** in batches of 3: `bash tools/stills.sh <new-tag> <frames>` (0.4 scale), `tools/compare.sh` for
   before/after, `scripts/measure.py` against `style.md` §3. Check every set: hero colours, darkest scene, signs readable.
9. **Motion test** a 10–15 s stretch with the most animation: `bash render.sh <N> <Comp>Sub <a-b> > out/renders/v<N>_render.txt 2>&1`.
10. **Render a version** of the whole film: `NAME=short_v bash render.sh <N> <Comp>Sub > …_render.txt 2>&1`
    (never overwrites); mux the voice at −14 LUFS (`render.md`).
11. **Strict critic loop:** `tools/shot_sheet.py` (every shot), `tools/critic.py` (sync, static ≥ 2 s, caption edges,
    sound), 20 full frames weighted to flagged shots and flicker spikes, your numeric checks. Fix, render the next
    version, repeat until nothing important is left. `references/pitfalls.md` lists the usual suspects.

## Rules
- **Original only:** our characters, world, rules and stories. No game logos, avatars, textures, meshes, or copied
  stories. Reference frames of other people's videos are for private analysis only.
- **The rule is visible in the first second**, with the hero's face in frame; the first frame is already the world.
- **The camera never rests:** a push-in inside every shot, still frames < 6%, nothing static for 2 s.
- **Every frame is a pure function of the frame number** (`references/render.md`).
- **Every face shot shows the face** (FACING), **no lens inside anything, nothing between the lens and the subject,
  nobody passes through anybody** (numeric checks, step 7).
- **Captions and signs stay readable:** text fits its card, diegetic text above the caption band, captions in the safe
  zone (≥ 6 % from the edges, ≤ 2 lines), synced to the voice (every cut on its word frame).
- **Every render goes through `scripts/gpu_lock.py`**, one at a time; its full output goes to a log file.
- **Keep every version**: renders, sub-frame renders, stills, sheets; never reuse a version number or a tag.
- **Numbers before eyes, then eyes on every shot**: the checks, then the shot sheet and full frames.
- **Licensed assets only:** the included OFL fonts; music or sound only with a licence you hold, outside this skill.
