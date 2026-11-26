# Pitfalls: what went wrong in 7 test rounds, and how to avoid it

The template's 10 s example went through 7 render → compare → critic → fix rounds (majors per round: 9, 7, 5, 6, 4, 2,
0). Every item below was a real defect in a render.

## Look
| defect | cause | fix |
|---|---|---|
| candy-bright, neon toy look (L* 64, chroma 45 vs targets ~48 / ~28) | the toon defaults: high ambient, high saturation | ambient ≈ half, stronger sun, saturation ≤ 1, grass #4f8f2c not neon; measure every version with `scripts/compare.py` |
| no deep shade, flat | hemisphere light dominating | hemisphere ≈ 0.66, contact shadows under every foot, body, rock, trunk and house base |
| grass read as polka dots | tiled blotchy texture | value noise at two scales + fine specks; never round blobs |
| the "wilted" patch read as mud, then as a spotlight, then as a smudge | wrong colour; then a hard disc; then a wide blur | grey-green #646a55 / #8a8f7a, cracks + dead stalks, a defined edge ~20% soft |
| sparkles landed on a tree or a forearm | burst centred on the head, random directions | burst around the prop, upward directions only |
| dust puffs read as soap bubbles | translucent spheres | opaque, flat, fast scale-out |

## Things passing through each other
| defect | fix |
|---|---|
| shoes hover above the grass, shadow detached | soles pressed 8–15 mm into grass + a contact blob + a darker footprint |
| the held cone inside the arm box | hold the prop 5 cm **past** the hand end, never inside the arm |
| her cone leaned 35° into her face | after any arm raise, apply the exact inverse rotation so the prop is upright in the world, then add the deliberate tilt |
| petals through the shoe | spawn flowers beside/behind the planted heel, never under the swing path; `check_motion.ts` tests flowers vs soles |
| a corner of the rock inside the toe | move props a few cm; `check_motion.ts` reports overlaps |
| raised arms cut into the torso | arms raised sideways also move outward from the shoulder |

## Framing (the most frequent major)
| defect | fix |
|---|---|
| the action happened half out of frame (the trip at the left edge) | `framing_check.ts`: project every character's boxes through every camera on every frame; fail if cut |
| the end two-shot cropped one character and left 40% empty grass | centre the pair, ≥ 6% margins, fill the lower half with the story (patches, flowers) |
| the hero's own near arm covered his face in the hook | hold the prop in the far hand, swing the near arm low; the check tests face and prop vs the own arms |
| a lamp pole / mailbox "growing" out of a head | the check measures props near heads (≥ 1 head width away) |
| the foreground back of a character took 40% of the frame | keep a foreground body ≤ 30% of the frame width |
| a 1.1 s shot of nearly empty sky | ≤ 0.65 s, keep a roof or tree at the frame edge, make the flying object 6–8% of the width |
| thumbnails disagreed (critic vs builder) | judge on full frames, not on the contact sheet; trust the numeric checks for framing |

## Motion and blur
| defect | cause | fix |
|---|---|---|
| flowers in the hook showed 6–8 stacked hard-edged copies | big close objects sliding fast past a moving low lens; 4 blur samples | keep the camera still relative to the ground in that shot; shutter 45° there (`BlockyTest.tsx`) |
| the fall smeared into a "plank" | 180° shutter on a fast whole-body move | 126° by default, 72° on the fall shot |
| the fall read as floating at 45° | the motion restarted from zero speed mid-fall | one continuous accelerating ease-in from the tip to the impact; the hip never rises |
| the fall ended as a flat heap of overlapping boxes | limbs folded into the body | arms forward in a V, legs straight, the shin resting on the rock, a small bounce |
| the walk read as a slide | legs only | ±30° legs, counter-swinging free arm, small body dip and sway |
| three near-identical frames in one shot | only the push changed | one pose change or head turn per ~0.5 s, or split the shot |
| a cheering arm ghosted for 3 frames | arm rotating too fast for 4 samples | fewer degrees per frame (≤ ~4 rad/s) |
| the flicker tool flags a frame | real cut between two shots of the same character, or fast motion | trace each flag on full frames; a new flag at a code change is real |

## Story readability
| defect | fix |
|---|---|
| the hook was a shin and a shoe: no one to care about | the hero's face, the prop and the rule's effect in one frame from 0.0 s |
| "the catch" was cut away (scoop in the sky → already on the cone) | show the landing on screen: the cone lifted toward it, a 2-frame squash, a pop ring, the face flips on that frame |
| the twist's other half (his loss) was too small to see in a wide | wilt 4–5 flowers clearly (tilt ≥ 60°, shrink, grey-brown) and end on a closer over-the-shoulder two-shot |

## Process
- A critic told to "find problems" always finds some, and some are wrong. Verify each item on full frames before
  fixing; stop when the verified majors are gone.
- Keep every render (`render.sh` refuses to overwrite a version) and compare versions side by side.
- An unattended run stops at the first approval prompt. Pre-approve only the commands the run needs (`render.sh`,
  `npx --no-install remotion`, the Python scripts) before you leave; never switch approvals off.

# Round 2: a voiced Short

One voiced Short, built with the library in `template/src/library/`. Every row was a real defect; the rule column makes the first
version right. In short: **set every lens with numbers** (a numeric lens check), **look at every shot** (`shot_sheet.py`),
**measure the film** (`critic.py`) before calling a version done.

## Voice and plan
| defect | cause | rule |
|---|---|---|
| Whisper skipped the first 3 lines (0–6.9 s got guessed times) | the script's opening was passed as `initial_prompt` | never give Whisper the script as a prompt; align Whisper's words to the script afterwards (`template/vo/transcribe.py`), and warn on any unheard word |
| "99" in the transcript vs "Ninety-nine" in the script | Whisper writes numbers as digits | captions use the script's words, Whisper only gives the times |
| the planner warned on every shot | its old comment said 4–7 s per shot | shots follow style.md §5 (a cut every ~1.25–1.5 s); warn only under 0.75 s or over 2.2 s |

## Lenses and framing (the most frequent defects again)
| defect | rule |
|---|---|
| the lens sat inside a character (a walking character, a sitting character's shoe) | run your numeric lens check after every staging change: LENS_IN fails if the lens is inside a body or furniture |
| a character or a customer stood between the lens and the subject | BLOCKED check (the lens→subject line); move background extras off every lens line |
| a face shot showed the back / side of the head (5 shots) | FACING check: in a face shot the face must turn toward the lens (dot > 0.3). When a character faces a shelf or a wall, shoot **from inside the shelf** (frame-in-frame between two boards) or from the far end of the aisle |
| the near arm covered the face while pointing / waving | point and wave with the arm **far** from the lens (compute which side the lens is on) |
| the lens aimed at a moving prop and jerked with it | aim at a fixed point (or a face); never at a prop that is being raised |
| a caption covered a price tag / a held card | keep diegetic text above the caption band (y < ~0.6 of the frame): raise the prop or lower the lens |
| text ran off its sign (a long word lost its first and last letters) | every text card shrinks its font to fit 86 % of its width (`textTex` in `library/props.tsx`) |
| a small character (0.7×) leaning in sank behind a counter: a one-colour frame | hide a box under small characters so their head clears the furniture in the close-ups |
| a moving pair: the camera ahead of the kid was inside the dad | the follower walks **behind**, never between the lens and the hero |
| shots of a set aimed by guessing took 3–4 tries | search lens positions numerically: "face toward the lens + subject and prop inside ±12.5° + nothing in between" |

## Passing through each other
| defect | rule |
|---|---|
| a background customer stood inside the dad; the dad stood inside the sitting kid; the kid stood inside a shelf; the kid's chest went into the window sill | OVERLAP check: characters vs characters (cylinders) and vs furniture boxes, on every frame; move people when you move anyone |
| a body in a bed / at a sill | leave 5–10 cm between a leaning body and the furniture |

## Motion
| defect | rule |
|---|---|
| characters stiff in stills, frozen between moves | an idle layer on every actor (`alive()`): breathing bob, slow sway, head + arm drift, antenna wobble |
| big moves flat | anticipation + overshoot (`pop()`): a small dip back, a fast move, a settle |
| shock arms / a raised card smeared into a blur ("out of focus") | a big arm move takes ≥ 0.7 s (≤ ~4 rad/s); a raised prop ≥ 1.0 s |
| the strongest flicker spikes | trace each on full frames: lightning, a caption switch and a big prop sweeping are legit; a jerking lens is not |

## Look
| defect | cause | rule |
|---|---|---|
| a flat, "not premium" look | ambient-only light | key + soft fill + strong rim per shot (style.md §8), bloom on emissives, fake AO, coloured bounce lights |
| a hidden sign behind a hanging mobile | props hung at sign height | hanging props ≥ 0.5 m below signs |
| an orange shirt washed to peach | a strong practical light right over the hero's walk | practicals ≤ ~3 near characters; check skin and shirt colours on the hero in every set |
| a store wide at L* 62 | white floor tiles + low bloom threshold | store exposure ~0.28, tiles ≤ #d4c6f4, bloom threshold 0.8 indoors |
| a night room 30 % near-black | dark navy walls + only moonlight | walls ≥ #4a52b0, hemisphere ≥ 0.65, a warm lamp fill |
| Jupiter's top blown out | a lightning point light next to the planet | effect lights ≤ 1 intensity, ≤ 1.6 m range |
| the hero planet's storm on its back side | the spin turned it away | time a planet's slow spin so its feature faces the lens in its insert |
| a glass jar rendered as solid white | opacity 0.2 + a glow light against the glass | glass opacity ~0.1, front faces only, glow lights off the glass |

## Process
| defect | rule |
|---|---|
| a version or a still overwritten by reusing a name | never overwrite: `render.sh` refuses an existing version and keeps the raw sub-frame render (`v<N>_sub.mp4`); `stills.sh` refuses a used tag; `compare.sh` / `shot_sheet.py` refuse an existing sheet. Number the full film apart from tests (`NAME=short_v`) |
| `render.sh` stopped after the video (no QA) | its line `tr -d ",<CR>"` holds an invisible carriage return (ffprobe prints `369,\r` on Windows); a Python re-save turned it into a line break. Edit shell scripts byte-safe; never re-save them through a text round-trip |
| a filtered render output hid the failure | write every render's full output to `v<N>_render.txt`; never pipe it through `grep` |
| a `// comment` appended mid-line commented out the rest of a code line (twice) | comments on their own line; typecheck after every code edit, before any render |
| a failed bundle left a half-written `build/` that blocked the next one | delete `build/` (generated files only) after a failed bundle |
| `python3` opened the Microsoft Store | Windows stub; `render.sh` / `stills.sh` now skip it (`tools/pick_python.sh`); `PYTHON=/path` still overrides |
| faster-whisper crashed (`metadata_errors`) | pin `av<16` with faster-whisper 1.2.x |
