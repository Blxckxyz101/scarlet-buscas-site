# Troubleshooting: every bug this workflow has hit, and the fix

Look here first when something looks wrong. Each entry: what you see -> why -> what to do. Build the fixes into your tools from the start.

## Picture quality
| You see | Why | Fix |
|---|---|---|
| Characters near the camera soft or blurred, background sharp | a depth-of-field effect (often left by another tool or plugin) blurs everything closer than its focus | switch off every post effect your light preset does not own (see `pipeline.md` section 5); check before every render |
| Edges crawl / shimmer between frames | depth of field switches anti-aliasing off; Studio "Automatic" quality lowers detail | no depth of field; capture at Studio edit quality level 21 |
| Faces blocky, eyes like little steps | face decals render coarsely | show faces as an image on a card in front of the head (`characters_and_faces.md`) |
| A glowing green square on every nose | a WeldConstraint is drawn by Studio | join the face card with a classic Weld |
| The whole picture slightly soft | the 9:16 crop of the viewport is only ~534 px wide and is scaled to 1080 | expected while testing; a bigger screen or a 4K device simulator for the final helps |
| Colours shrill | many competing hues (neon + pastel rainbow), not the saturation number | one colour world per place (a neon world is fine, a neon-pastel mix reads shrill) |
| Colours doubled or odd | two colour corrections or two atmospheres active (one left by another tool) | keep exactly one colour correction and one Atmosphere |

## Camera
| You see | Why | Fix |
|---|---|---|
| Camera inside a tree, a wall, a person; a shoulder fills the frame | station too close or on the wrong side | check stills at every station; keep 12-14 studs for full shots; line-of-sight and free-angle rules in `camera_and_shots.md` |
| Camera pulled close in front of leaves | earlier versions treated tree crowns as walls | tree crowns and lamp posts must not count as obstacles |
| During a big turn the view swings into the sky or the floor | blending two opposite look directions as vectors cancels them out | blend directions as yaw/pitch angles (`pipeline.md` section 3) |
| Long turns show parked cars and empty pavement | a slow drift between far-apart subjects | stay on the old framing and whip over in ~0.27 s (or turn in ~0.6 s) |
| Camera at foot height | a ground point (`place@x,z` or an anchor) used as camera position | lift ground points to eye height for cameras |
| Pans judder | mid-speed pure rotation without motion blur | travel with the subject, or turn slowly (< ~4 degrees/s) or as a whip |
| Rows of characters come out mirrored | looking along +Z, +X is screen-left | remember when placing rows |
| In a room the camera films from outside through the window | the wanted side was behind the back wall and the window opening let the ray through | put invisible blockers in window openings; move a blocked camera to the nearest free angle; let characters face the open side |
| A pillow or a chair fills half the frame | the camera stood inside furniture | keep the camera 1.2+ studs from props; props on the line of sight block the angle too |
| A two-shot shows an empty floor | the two characters stand further apart than the 9:16 frame is wide | widen two-shots until both fit (frame width = 0.5625 x height); better: stand them 2.5-3 studs apart |
| A wide shot looks up from below the floor | the level-camera height formula goes negative for very wide framings | raise the camera for wide framings; never below ~2.2 studs |
| The video feels lifeless and "too close", always one person | eye-level long-lens framing per sentence; places without their people | base camera = player camera, every place gets its people (`camera_and_shots.md` 1b, `world_and_light.md` 3); measure composition |
| The subject slides out of frame in the middle of a camera move | two stations on the same subject from very different angles; the view direction is blended | blend the look-at point, or cut |
| The camera flies to the other side (into an effect) after a character turns | "front"/"three-quarter" are relative to where the character faces | use a fixed camera position for shots after a turn |
| A two-shot shows two backs of heads, or sits inside a crowd | the automatic two-shot camera goes to "the side both face" | stage the meeting for the camera (photo pose, over the shoulder) with a fixed position |
| A seated character's head is cut off at the bottom | framing heights assume standing people | lower the camera height for seated characters |
| A face turns away and the character looks faceless | look target far to the side | keep look targets within ~35 degrees of the body direction |
| A prop on the counter covers the face in three-quarter shots | props between the camera side and the character | place props on the side away from the cameras; check every angle |
| High wide shots show only tree crowns | street trees between camera and action | archive the trees near the action (film-set trick) |
| Two characters fight or argue and neither face is visible | staged in pure profile | turn both ~45 degrees towards the camera |
| A group stands with its backs to the camera | staged as a closed circle | open the group towards the camera (horseshoe); turn them to the camera on their reaction |
| Someone runs through the camera | an escape path crosses the lens | send paths away from the camera, to the sides |
| A giant thing does not look giant | it stands too far away | bring it closer and film it from a low camera looking up |

## Characters and faces
| You see | Why | Fix |
|---|---|---|
| A hat, hair or dress is missing | R6 silently drops layered clothing, "3.0" items and many newer hair items | count accessories after building; pick a rigid item or a classic shirt |
| Hair hides the eyes; a moustache hides every mouth | accessory covers the face | check head portraits; choose other hair; no moustache accessory |
| The hero reads as a girl (or the wrong gender) | on R6 only hair, face and colours tell | short hair or a cap for male; female face variant for female characters |
| A shirt has text or is a crop top | catalog thumbnails not checked | always look at the thumbnails before using an item |
| The old face shows for one frame | a swapped texture shows one capture late | render a warm-up frame; preload face textures |
| Poses stick out sideways / arms do strange things while walking | R6 shoulders posed by code fight the walk animation | no arm poses during walks; attach carried props to the torso; start the walk 0.2 s after a pose ends |
| Animations from an earlier build keep playing or point to deleted models | old tracks still loaded | stop foreign tracks every frame; reload tracks after rebuilding characters |
| Poses do nothing at all | the place uses AnimationConstraints (Avatar Joint Upgrade) | set `StarterPlayer.AvatarJointUpgrade = Disabled` by hand in Studio |
| A character sinks into or floats over the floor | pivot at the head vs the feet | position by the feet; add the hip height (~3 studs) |
| Grunts or effort sounds look like random face changes | talking-mouth faces swap eyes and brows too | one strong expression face for effort sounds |
| A character pops from sitting to standing, or a prop just vanishes | a state change inside a running shot | cut on that moment |
| A walker passes through the hero | a fixed walker lane crosses a story mark | check lanes against story positions |
| A character floats a little over the road | the ground height of the sidewalk was used everywhere | find the ground with a downward raycast at each spot |
| Heads turn away after someone vanished | others still look at the vanished character, which is parked far away | after a vanish, look at fixed points |
| A character that vanished never comes back, or arrives in a new place still looking at the old one | the vanish state or the look/pose/talk state is not reset | reset a character's state when it reappears or changes place |
| The body jumps round in one frame when a walk ends | the walk was still running when a turn began | end walks before the next turn; switch to big animations on a cut |
| A character smiles while screaming | talking-mouth faces are friendly | one strong face for shouts and screams, no talking mouth |

## Effects
| You see | Why | Fix |
|---|---|---|
| Bodies flicker during a vanish | Roblox sorts half see-through parts wrongly | never partial transparency on bodies; vanish with blinks, a white Highlight and neon cubes (`animation_and_effects.md`) |
| Hair loses its front layer for a frame | transparency around 0.1 on hair | same: no transparency on bodies |
| The pixel burst is invisible | reused effect parts kept an old transparency; or the body was removed before the burst started | reset reused effect parts to opaque every frame; keep the body until the burst starts |
| Stickers or floating text are missing in the frames | BillboardGuis do not show in Studio's `screen_capture` | camera-facing parts with a SurfaceGui, or 2D overlays in assembly |
| A sign's text is blank | the SurfaceGui faces the wall | check the sign's front face in a still |
| Faces in a cold room are unreadable | night ambient plus a cold lamp | interior ambient, cold lamp, soft fill near the camera |
| Faces almost black at night | real night light | blue hour plus a fill light that follows the camera (`world_and_light.md` 4) |
| A night room shows a blue daytime sky in its windows, a black object looks blue | windows and reflections show the global sky | dark window panes, low `Reflectance` on dark objects |
| Long words on a sign or screen are cut off | `TextScaled` stops at 100 px | lower `PixelsPerStud` until the longest word fits |
| Text or a prop appears far too early | the word anchor hit an earlier occurrence of a common word | check each anchor's sentence; use `word#2`, `word#3` |

## Studio, MCP, Lua
| You see | Why | Fix |
|---|---|---|
| "Failed to parse command code" for a whole file | a `--` comment before `end` on the same line | put comments at the end of the line |
| "attempt to index function with ..." after updating | an older version stored a function where a table is expected now | make modules overwrite non-table leftovers on load, then load again |
| Commands go to the wrong Studio | several windows open | select the Studio window by its place file name |
| Everything gone after a Studio restart | `_G` state lives only in memory | reload all modules, rebuild places, cast and plan from files (keep one command for this) |
| Studio crashed ("Device removed") | the graphics driver reset | let the user press OK; never force-close Studio; save the place file regularly |
| White or empty captures | the Studio window was covered or minimised | keep Studio visible while rendering |
| Every call times out, even `return 1+1`, while Studio looks fine | Studio has been fully covered by another window for a while | bring Studio to the front (works again at once); keep it visible during stills and renders |
| Mouse look in Studio stops working after a render | the camera stayed Scriptable (saved with the file) | set the camera back to Fixed after every capture run |
| Kits bring scripts | Creator Store models often contain scripts (one cafe had 50) | remove every script, click detector, prompt, sound and remote before use |
| Faces missing after a Studio update | Studio installs into a new version folder | copy the faces into the new content folder again |
| Catalog search returns HTTP 429 | rate limit | wait and retry; search less at once |
| Terrain pokes through roads | terrain snaps to 4-stud cells | carve terrain under roads or use parts only |
| Lights blow out a room | many lamps plus high brightness | fewer lamps, lower brightness; check one still |
| Rendering is much slower than usual (0.8+ s per frame) | many characters, neon, shadow-casting lamps | `Shadows = false` on story lights where the shadow does not matter; archive unused characters |

## Voice and sound
| You see | Why | Fix |
|---|---|---|
| Numbers take forever and captions show digits | digits in `script.txt` | write numbers as words |
| Captions drift from the voice | `words.json` does not belong to `voice.wav` | regenerate both together; make assembly refuse mismatching words |
| Video too quiet | the voice was not normalised | normalise to about -15 LUFS in assembly |
| Recording does not match the script (match under 90 %) | the speaker changed words | edit `script.txt` to what was said, align again |
