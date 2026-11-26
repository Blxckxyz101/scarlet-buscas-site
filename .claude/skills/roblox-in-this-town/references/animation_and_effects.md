# Animation, acting and effects

## 1. Moving characters (frame by frame, deterministic)
- Every frame is posed from scratch as a pure function of time t, so any frame can be rendered alone and renders can resume.
- Roblox's own R6 animations (walk 180426354, idle 180435571, idle2 180435792, wave 128777973, point 128853357, laugh 129423131,
  cheer 129423030, dance 182435998, jump 125750702, sit 178130996) give natural motion. Load them once per character with
  `Animator:LoadAnimation`; per frame: `Play(0)` if needed, `AdjustSpeed(0)`, set `TimePosition`, then `Animator:StepAnimations(0)`.
  Stop every track you do not use this frame (tracks from earlier runs blend in otherwise). Walk speed: playback rate = studs per second / 14.5.
- Code poses go on `Motor6D.C0` (rest C0 times an offset), never on `.Transform` (the animator overwrites it). Keep a fixed table of the
  R6 rest C0 values; never read the rest pose back from the model (a previous pose becomes the new rest).
- Posing by code needs classic Motor6D joints: in new places set `StarterPlayer.AvatarJointUpgrade = Disabled` by hand (cannot be set by script).
- Do not pose arms on top of the walk animation (they fight it); start a walk a moment after a pose ends. Carried props attach to the torso.
- Place characters by their feet on the ground (the hip is ~3 studs above the feet; positioning by the head sinks them).
- **A walk must end before the next turn starts.** A path that was still running when a turn began made the body jump 59 degrees in one frame
  on arrival. Switch to a big animation (dance, fall) exactly on a cut.
- **Props in the hand:** build the prop as a model with its grip at the pivot; after posing, every frame
  `prop:PivotTo(rightArm.CFrame * CFrame.new(0, -1.05, 0) * CFrame.Angles(math.rad(-90), 0, 0))` (the hand end of an R6 arm, pointing forward).
  Hide it far away outside its time window.
- **A character lying down** (knocked over, asleep on the floor): after the animation is applied, rotate the whole model about its feet:
  `PivotTo(CFrame.new(feet) * CFrame.Angles(0, yaw, 0) * CFrame.Angles(math.rad(90 * k), 0, 0) * CFrame.new(0, 3, -0.5 * k))`, k from 0 to 1
  over ~0.35 s with an ease-out (and back for standing up).

## 2. Acting without facial animation
- Pose to pose: 1-3 key poses per sentence; anticipation 4-8 frames, the move, 10-20 % overshoot, settle 6-12 frames, then a moving hold
  (tiny drift, never a dead freeze). Useful poses: arms up, shock (arms out, lean back), point, shrug, hand to mouth, facepalm, head down, look up.
- Reactions start 6-8 frames after the event; the head snaps first, the body follows 3-6 frames later.
- Silhouette: blocky arms in front of the torso vanish; lift them away from the body or show the pose in three-quarter view.
- Comedy in the wide shot, feelings in the close shot; hold at least 1 s after a punchline.
- Extras: random phase, smaller motion than the hero, never in sync ("twins"), calm during the hero's key moment.
- **Activity, not idle.** Every character in a place does what the place is for, as a loop tied to time: packing, flipping, typing,
  sweeping, eating (hand to mouth with the food), scrolling a phone (head down, screen light on the face). Standing in idle carries no scene;
  in the hits people flip burgers, throw clothes, carry and eat. Arm loops on `Motor6D.C0` with the shoulder `Transform` cleared, so the idle
  animation does not swing them.
- A "talking mouth" made by swapping face images resets eyes and brows to the talking face: on grunts and effort sounds ("huss", "hngh")
  it looks like random faces. Use one strong expression face for those (gritted teeth) and keep mouth swaps for real dialogue.
  The same for shouts and screams ("SHOOT IT!"): talking faces are friendly, so a screaming character smiled. Use one strong face instead.

## 3. Effects without glitches
- **Never use partial transparency on body parts.** Roblox sorts half see-through parts wrongly: bodies flicker from frame to frame,
  and around 0.1 transparency hair loses its front layer.
- A vanish / teleport that works: in the 0.8 s before, 3-4 single-frame white blinks with a tiny sideways jump (a `Highlight` on the
  character); then 0.2 s turning fully white (Highlight fill to 0); then the body is gone and bursts into glowing neon cubes (~0.35-0.6 studs)
  that fly out slowly and shrink to nothing (change size, never transparency). Keep the body in place until the burst starts. Effect parts you
  reuse must be reset to opaque every frame.
- Auras, glows, danger: `Highlight` with a colour; `PointLight` on the character; particle emitters frozen per frame (`TimeScale = 0`, emit manually).
- Full-frame effects (white flash, black, red tint, shake) are added in assembly, timed to words.
- One effect at a time with space around it; busy effects read as confusing.

## 4. The graphic layer: comic stickers
Viral narrated shorts put small comic graphics into the picture on the words: speed lines while someone works fast, "ZZZ" over a sleeper,
"???" over a confused crowd, "!" on a shock, a ticking clock, "1 HOUR LATER", a label on a door. They make a scene readable with the sound off
and give the comedy a rhythm. One sticker at a time, short (0.5-2 s), never over a face.
- **BillboardGui text does not appear in Studio's `screen_capture` frames** (tested: nothing visible). Build stickers as parts with a
  SurfaceGui that turn to the camera of each frame (orient them after the camera position for that frame is known), or draw them as 2D
  overlays in assembly from screen positions you export per frame.
- Speed lines that read: 15-25 thin white neon bars radiating around the character's upper body in the plane facing the camera, starting
  outside the head (no line over the face), length and angle jittered about 15 times per second.
- Rising "Z" letters: three letters drifting up and to the side from the head, growing, fading only at the end of their path (text
  transparency, which is fine: the no-transparency rule is about body parts).
- Text on a surface (a screen, a sign that types word by word): `TextScaled` stops growing at 100 px, so with a high `PixelsPerStud` long
  words get cut off. Choose `PixelsPerStud` so the longest word fits at 100 px (e.g. ~48 instead of 140), and check the longest word in a still.
