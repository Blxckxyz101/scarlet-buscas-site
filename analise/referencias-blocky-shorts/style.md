# Style: the blocky-world Short look, as rules and numbers

These rules describe the look of narrated "in this world…" Shorts with blocky toy-like avatars, measured on a private
sample of 58 Shorts (13 channels) and rebuilt with our own characters and world. Use the numbers as targets; check them
with `scripts/measure.py` and `scripts/compare.py`. Our characters, props and sets are original: never import a game's
avatars, logos, textures or meshes.

## 1. Characters (one family, written down)
| rule | value | where in the template |
|---|---|---|
| unit | U = 0.27 m (one block unit); everything is a multiple of U | `template/src/blocky/motion.ts` `U`, `SPEC` |
| torso | box 2 U wide × 2 U tall × 1 U deep | `SPEC.torso` |
| arms | box 0.92 U wide × 2 U long × 0.92 U deep (≈ half the torso width, as long as the torso); pivot 0.5 U below the arm top | `SPEC.arm` |
| legs | box 1 × 2 × 1 U; shoe block 1.06 × 0.42 × 1.08 U in a contrasting colour with a coloured sole | `SPEC.leg`, `SPEC.shoe` |
| head | rounded box, **0.50–0.55 of the torso width** (template 0.51), a small neck gap | `SPEC.head` |
| height | **~4.5 heads** (template 4.6) | |
| limbs | rigid: no elbows, no knees; arms pivot at the shoulder, legs at the hip, head at the neck | `Blocky.tsx` |
| face | a **flat decal** on the head front, slightly proud of the surface (≥ 4 mm): two black ovals as eyes (~1/5 of the head width, with a small white catch-light), one angled brow stroke per eye, a mouth as a line / arc / filled red "O" / open grin | `Blocky.tsx` face canvas |
| emotion | brow angle + mouth shape + mouth **size**; extremes only in close-ups (tears, wide shock mouth) | `emotionA`, `emotionB` in `motion.ts` |
| hair | chunky separate meshes (shaggy blocks, buns, puffs) that never read wider than the head | `Blocky.tsx` hair kit |
| clothes | flat-colour plastic parts + one simple printed graphic (a bolt, a heart); **every character carries one saturated colour** | `KID_A`, `KID_B` looks |
| hands | a lighter end cap on each arm, so a raised arm reads as an arm, not a plain box | |
| motion | rigid swings and poses; walk ±28–30° leg swing at ~2.3 steps/s, counter-swinging free arm, 2 cm body dip per step, soles pressed 8–15 mm into grass; no squash and stretch on bodies (props may squash) | `poseA`, `poseB` |
| cast | 1 hero in about half the shots, 2–3 characters in a fifth | |

## 2. Light (a game-engine day)
- **Key = the sun**, 42–48° high, from the lens's front-left, set per shot from the shot's starting lens and kept
  constant inside the shot (shadows never swim). Golden hour (15–25° high, warmer) for drama or endings.
- Hemisphere/ambient ≈ 0.66 with a dark olive ground colour; sun ≈ 4.1; small cool fill ≈ 0.22; lens fill ≈ 0.12.
- Shadows crisp but soft-edged; **contact shadows** under feet, bodies on the ground, rocks, tree trunks and along house
  bases (`template/src/blocky/Contact.tsx`).
- **No outlines**, **no depth of field**, no rim light, no grain. Mild bloom on whites and sparkles only.
- Sky: saturated blue gradient (#2a5fd6 top → #3f7ae6 → #8fb6ea horizon) with soft clouds that have darker bases; haze
  only on distant hills.
- Mood in code: `template/src/blocky/mood.ts` (`moodForShot`).

## 3. Colour and tone (measured targets)
| measure | target | why |
|---|---|---|
| mean L* | 46–50 | sample median 46 |
| L* p95 | 82–86 | brighter highlights leaned viral in 9 of 10 channels |
| L* p5 | 12–16 | |
| chroma (mean) | 26–30 | sample median 25; the most-viewed group ~29 |
| near-black share | not forced | in the sample it comes from interiors and night scenes; a sunny exterior has less |
- Palette: warm skin / wood / gold against saturated blue sky and green grass (lit #4a8a2a–#4f8f2c, shade #22371c);
  brick reds, siding blues/greens/creams; one primary accent per character (yellow, orange hair, pink, purple).
- **Never a grey world**: overcast skies, flat shadowless interiors and all-beige casts were typical of the weakest
  videos in the sample. If a scene must be grey, keep one saturated colour on every character.

## 4. Materials
- Characters: smooth plastic (MeshStandard, roughness 0.42–0.6, metalness 0), flat colours, the printed graphic as an
  unlit-looking decal.
- Sets: textured — brick or siding houses with metre UVs, concrete-noise sidewalk slabs, darker road with yellow
  dashes, noise grass (two scales + fine specks, never circles), low-poly faceted trees, white picket fences, a hydrant,
  a mailbox, a street lamp, rocks. Library: `template/src/blocky/World.tsx`; materials: `template/src/blocky/mat.ts`.
- Story props (flowers, scoops, patches, sparkles, dust, pop ring): `template/src/blocky/Flowers.tsx`.
- Grey "wilted" ground: dull grey-green #646a55 (strong) or dry grey #8a8f7a (light), cracked texture, dead stalks, a
  soft but defined edge (a hard disc reads as a spotlight, a wide blur reads as a smudge).

## 5. Camera and pace
| rule | value |
|---|---|
| frame | 1080 × 1920, 30 fps, motion blur from 4 sub-frames (`references/render.md`) |
| cuts | **hard cuts**, one about every **1.25–1.5 s** (sample median 5.5 cuts per 10 s; shot median 1.5 s) |
| push-in | inside every shot a constant push of **8–11% of the lens distance per second** (`PUSH` in `plan.ts`) |
| still frames | < 6% of frames (sample median 4%); the camera never rests |
| roll | small, 1–2° drift inside a shot |
| shot mix | ~50% face/bust close-ups, ~25% medium, ~25% wide/action |
| close-up size | the head fills 25–45% of the frame width; faces at 35–47% of the height from the top |
| lens | vertical fov ~49–62°; low angles for action, a high 3/4 to show something on the ground, over-the-shoulder for the payoff |
| margins | every character meant to be in a shot stays ≥ 2–6% inside the frame edge (`template/tools/framing_check.ts`) |
- A shot = subject point + offset (or a fixed lens position) + fov + face height; see `SHOTS` in
  `template/src/blocky/plan.ts`. The shot is picked by the output frame, so motion-blur samples never mix two shots.

## 6. Captions (for voiced Shorts; the 10 s example has none)
- One lowercase word at a time, switched on the word onset (2 frames early), white heavy rounded sans (Poppins
  ExtraBold, included) with a dark ~5 px outline and a soft shadow.
- Word ≈ 13% of the frame width, cap height ≈ 4% of the frame height, centred at **~68% of the height** (on the torso,
  under the face).
- Story facts that must read muted go on diegetic signs and labels (unlit text on props), not in extra captions.
- No title card, no end card. Engine helper: `template/src/engine/core/captions.tsx` (set its position to 68%).
- **Proven variant (used in a voiced Short):** white only (no accent words), Poppins ExtraBold, a thin dark
  outline (~7 px) + a soft shadow, a 12 % safe margin each side, ≤ 2 lines, and a **pop-in** on every new chunk (50 % →
  112 % → 100 % in 0.17 s): `template/src/library/PopCaptions.tsx`. Diegetic text must sit above the caption band.

## 7. Sound (for voiced Shorts)
- One fast narrator (~260 words per minute), first word at 0.0 s, a quiet music bed under the voice, a hit or whoosh on
  most cuts. The 10 s example is silent by design.

## 8. The premium pass (proven in a voiced Short; library: `template/src/library/`)
The plain template look reads as flat once a Short is longer than a test. Build these in **from the first version**.

**Light, per shot** (`library/mood.ts`): key from the lens's front-left (constant inside the shot), a soft fill from the
front-right in a complementary colour, and a **strong rim from behind the subject** (opposite the lens, ~32° up, a little
to the side, intensity 4.5–5.5) that outlines characters against the background. Bloom threshold ~0.7–0.8 (strength
0.5, radius 40 px) so emissive things glow: neon signs (emissive ≥ 2.4), holograms, screens, stars, planet atmospheres.
Vignette 0.2–0.5. One mood per scene, e.g. bright and colourful (exposure ~0.28, hemi 0.85), a secret / whisper (darker,
warm low key, magenta rim, vignette 0.5), night (blue moonlight through a window as key, a warm lamp fill), the ending
warm and golden (gold key + rim, warm highlights).

**Shadow and bounce:** no screen-space AO in the engine, so fake it: soft dark gradients along every wall/floor corner
and under shelves, beds and counters (`AO` in `library/sets.tsx`), contact blobs under every character and prop.
Coloured point lights next to strongly coloured surfaces stand in for bounced light; keep practicals ≤ ~3 near the hero.

**Products (planets)** (`library/planets.tsx`): every one slowly spins and has its own texture and a fresnel atmosphere
glow. Gas giants: domain-warped swirling bands, darker poles, spiral storms (time the spin so the storm faces its
insert). Ringed: banded, coloured, semi-transparent rings with gaps (radial UVs). Earth: shiny oceans (roughness map),
raised continents (bump), clouds on their own slow spin, city lights (emissive), a blue glow; a dusty variant.

**Sets** (`library/sets.tsx`): never empty. Shelves with two rows of products in different sizes (a back row for depth),
holographic price tags, hanging mobiles (≥ 0.5 m below signs), neon signs with tube frames, wall shelves, a few
background extras (off every lens line), and a **foreground layer** in every shot: a display island, a shelf edge, a
planet, a jar. Every shot has foreground, middle and background.

**Characters** (`library/characters.ts`): recognisable from the silhouette alone: one accessory set each (the dad: a hat
the antennae come out of + a shoulder bag; the kid: eyes 1.38× + a rocket backpack; the seller: 0.7×, hunched, apron, tiny
round glasses, one antenna). Belts and sleeve cuffs on everyone. Eyes always carry two catch-lights. Expressions change
on the story beats (curious, sly, shock, sad with a tear, love, joy). Motion: the `alive()` idle layer on everyone,
anticipation + overshoot (`pop()`) on big moves (≥ 0.7 s), talking gestures (a "why?" shrug, a hand to the mouth for a
whisper, a wagging finger). Nobody ever stands still.
