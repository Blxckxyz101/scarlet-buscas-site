# The production pipeline: what to build for the user, and the traps

You build these tools once per user (in their project folder), in small files, then reuse them for every video. Keep each tool small and
testable; check every step with pictures. The code below is only for the spots where things silently go wrong; write the rest yourself.
**This is one way that worked, not the only way.** Ordinary parts (running ffmpeg, text-to-speech, drawing captions) you know already;
what is easy to miss are the Studio-specific traps below. Structure, languages and file names are up to you and the user, as long as
the four ideas of section 0 hold (or you have a better reason).

## 0. Architecture (why it is built this way)
- **Claude plans, scripts execute.** A video has thousands of frames; posing and capturing them must run in a script loop, never one tool
  call per frame from you (that would cost millions of tokens).
- **Everything is code and files.** Places, cast, plan: all rebuilt from files in minutes. Studio can crash (graphics driver resets happen);
  `_G` state is gone after a restart, so a "load everything" command must exist.
- **The voice is the clock.** Script -> voice -> word times -> a plan whose events are anchored to words ("vanishes#1" = the first time the word
  "vanishes" is spoken, plus an optional offset) -> resolved to seconds -> every frame posed at time t.
- **One frame function.** In Studio, `frame(t)` positions every character, sets animations, faces, poses, effects, light and returns the
  camera. It must be a pure function of t (no state carried between frames).

Before the first real video, run a two-sentence story through the whole chain (voice, cast, plan, stills, render, assembly, report):
it finds the broken joints in minutes instead of in the middle of a video.

When the tools work, write a one-page `TOOLS.md` next to them: each command with its measured time; the places, their anchors and their
layout facts (which axis a street runs along, road and sidewalk widths, where trees and lamp posts stand, how big a room is); the cast
options; the plan defaults; and one-line query helpers (run a Luau snippet and print its result, get a character's position at time t,
get the camera at time t). Every later chat reads that page instead of the source code; a missing layout fact costs a round of lookups.

Suggested pieces: a Studio client (Python) - Luau modules (core helpers, kit loading, light presets, place builders, cast, animation,
effects, camera, scene/plan reader) - plan resolver (word anchors -> seconds, rule checks) - stills tool (a strip of key frames) -
render loop - assembly (crop, captions, effects, voice, loudness) - voice tool - quality report.
The stills tool is the most used piece: pose `frame(t)` for a list of times, capture each, and put them on one sheet with the time printed
under each picture, so one look shows a whole place.

## 1. Talking to Roblox Studio
Roblox Studio ships an MCP server (`StudioMCP`; on Windows in `%LOCALAPPDATA%\Roblox\Versions\<newest>\StudioMCP.exe`). Its tools:
`list_roblox_studios`, `execute_luau` (code, datamodel_type "Edit"), `screen_capture` (returns a JPEG of the viewport; optional
`camera_position` + `look_at_position`). Connect Claude to it in Studio's Assistant settings ("MCP Servers"; Roblox's guide:
create.roblox.com/docs/studio/mcp). Claude's own MCP connection is fine for setup and checks; loops need a script client:
```python
p = subprocess.Popen([mcp_path], stdin=PIPE, stdout=PIPE)          # JSON-RPC 2.0, one JSON object per line
rpc("initialize", {"protocolVersion": "2025-03-26", "capabilities": {}, "clientInfo": {"name": "client", "version": "1"}})
send({"jsonrpc": "2.0", "method": "notifications/initialized"})
studios = rpc("tools/call", {"name": "list_roblox_studios", "arguments": {}})   # pick by place file NAME, never "the first one"
rpc("tools/call", {"name": "execute_luau", "arguments": {"code": "return 1+1", "datamodel_type": "Edit", "studio_id": sid}})
```
Traps: several Studio windows may be open (always pass `studio_id` of the window whose file name matches); only one process should own the
StudioMCP connection (a tiny local HTTP bridge lets several scripts share it); a Luau error comes back as text with `isError`.
A `--` comment before `end` on the same line breaks a whole chunk ("Failed to parse"): put comments at line ends.

## 2. Rendering frames
```python
luau("settings().Rendering.EditQualityLevel = Enum.QualityLevel.Level21")          # "Automatic" lowers detail on its own
cam = luau(f"return frame({first_t})"); capture(cam)                              # warm-up: a swapped texture shows one capture late
for i in range(i0, i1):                                                            # name frames by global index -> resume, partial re-renders
    if exists(i): continue
    cam = luau(f"return frame({i / fps:.4f})")                                     # "cx,cy,cz,lx,ly,lz"
    img = capture(cam)            # retry up to 5 times; a single capture can fail
finally: luau("workspace.CurrentCamera.CameraType = Enum.CameraType.Fixed; settings().Rendering.EditQualityLevel = Enum.QualityLevel.Automatic")
```
- ~0.3-0.9 s per frame (a 60-75 s video at 30 fps ~ 15-35 min). Many characters, neon parts and shadow-casting lamps make it slower:
  give story lights `Shadows = false` unless the shadow matters. Run it as a **background** process; Studio must stay visible
  (covered windows give empty frames). Name frames by global index so a fix re-renders only the frames it touches.
- The capture is the viewport (e.g. 1067 x 949). Crop 9:16 from the **measured** height (it changes after a restart), then scale to 1080 x 1920.
  That crop is only ~534 px wide, so frames are slightly soft; a bigger Studio window or a high-resolution device in Studio's device simulator should give sharper frames (not tried yet).
- A camera left `Scriptable` is saved with the place and blocks the user's mouse look in Studio: always set it back to `Fixed`.
- Before rendering, check: no enabled DepthOfField/Blur anywhere (they blur characters near the camera and disable anti-aliasing).

## 3. Camera code
```lua
-- blend look directions as angles, never as vectors (opposite vectors cancel out -> the view tips into sky or floor)
local function angles(d) return math.atan2(-d.X, -d.Z), math.asin(math.clamp(d.Y / d.Magnitude, -1, 1)) end
local y1, p1 = angles(look1 - pos1); local y2, p2 = angles(look2 - pos2)
local dy = ((y2 - y1 + math.pi) % (2 * math.pi)) - math.pi                -- shortest way round
local yaw, pitch = y1 + dy * u, p1 + (p2 - p1) * u
local dir = Vector3.new(-math.sin(yaw) * math.cos(pitch), math.sin(pitch), -math.cos(yaw) * math.cos(pitch))
```
Frame size from the vertical FOV: distance = H / (2 tan(FOV/2)), where H is the frame height in studs at the subject (sizes in
`camera_and_shots.md`). Level camera height = eye height (~4.65 for R6) - 0.167 H, but never below ~2.2. Collision rules: `camera_and_shots.md` section 7.

## 4. Sharp faces and characters
```lua
local card = Instance.new("Part"); card.Size = Vector3.new(1.25, 1.25, 0.05); card.Transparency = 1; card.CanCollide = false; card.Massless = true
local w = Instance.new("Weld"); w.Part0 = head; w.Part1 = card; w.C0 = CFrame.new(0, 0, -0.62); w.Parent = card   -- NOT WeldConstraint (green square)
card.Parent = head
local g = Instance.new("SurfaceGui"); g.Face = Enum.NormalId.Front; g.SizingMode = Enum.SurfaceGuiSizingMode.PixelsPerStud; g.PixelsPerStud = 400; g.Parent = card
local im = Instance.new("ImageLabel"); im.BackgroundTransparency = 1; im.Size = UDim2.fromScale(1, 1); im.Parent = g   -- im.Image = face texture
```
Character building, accessory checks and face drawing: `characters_and_faces.md`.

## 5. Light preset reset
```lua
local OURS = { MyCC = true, MyBloom = true, MySun = true }         -- the effects your preset owns
for _, root in ipairs({ game.Lighting, workspace.CurrentCamera }) do
  for _, e in ipairs(root:GetDescendants()) do
    if e:IsA("PostEffect") and (not OURS[e.Name] or e:IsA("DepthOfFieldEffect") or e:IsA("BlurEffect")) then e.Enabled = false end
  end
end
```
Also keep exactly one Atmosphere (move extra ones out). A leftover depth-of-field effect from an earlier tool made every character soft in one project.

## 6. The plan (what you write per video)
A JSON file you write after the voice exists, read by the scene code:
- `places`: which place, mood, life (groups that react to events, walkers, cars).
- `cast`: ids and where their look comes from (the user's saved hero, archetypes you built).
- `shots`: from/to time, a `why`, and a camera route (stations with size, subject, side, or explicit position and look target; whip/turn timing).
- `beats` per character: start position (named anchor), walk paths, animation, face, pose (+ until), look at, turn to, effects (vanish), talking.
- `post`: full-frame flashes, black, tint, timed to words.
- Per story there is always something the general scene code does not have (a burger pile that grows, a phone in a hand, a crowd, stickers).
  Give the scene code a per-story hook that runs every frame after posing, written as a pure function of t, and let it use the same word
  anchors as the plan: write it with placeholders like `@T(huss#10)` and fill in the seconds from `words.json` with a tiny script, so a new
  recording moves the props with the words.
Resolve word anchors to seconds in a script; check the plan (unknown characters, shots without a reason, two close-ups in a row, a single
static station over 3 s; limits from the chosen style, `styles.md`) before loading it. Then take stills at every station and event, fix, and only then render.
- **Word anchors pick the wrong occurrence easily.** Common words ("we", "the", "next", "running") appear in several sentences: in one test a
  word screen showed "NEXT" from sentence 4 on because "next" was said there first. Let the resolver print every anchor with its time and its
  sentence, and keep a list "word -> all times" at hand while planning.
- A plan for place 1 only ends with a shot that runs to the end of the voice: limit warnings and measurements to the planned range.
- **Character state belongs to a place.** When a character vanishes, teleports or reappears somewhere else, reset its look target, pose and
  talking; old targets from the previous place make heads turn away. Park hidden characters far away and never let others look at them.

## 7. Voice
- Local and free: Kokoro text-to-speech (`kokoro-onnx`) for a placeholder or final voice; word timings with `faster-whisper` (word_timestamps).
  Decode audio with ffmpeg and pass samples (faster-whisper's own decoder breaks with some PyAV versions).
- The user's own recording (or an AI voice they have rights to): transcribe it and align the recognised words to `script.txt` with a sequence
  matcher (keep the recognised timing, the script's spelling; spread unmatched words over their section).
- `words.json` = `[{"w": word, "s": start, "e": end}]`. Report words per second and the longest pause.

## 8. Assembly
- Crop and scale frames, draw captions per frame (Pillow is enough; no subtitle library needed), add full-frame effects, pipe raw frames into
  ffmpeg (x264, crf ~16, yuv420p, 30 fps), mux the voice. Captions: every spoken word exactly once and in sync - assert it in code before
  rendering; break chunks at punctuation. Size, position and colour are style (`styles.md`); a highlighted stressed word is common.
- Loudness: `ffmpeg -i in.mp4 -c:v copy -af loudnorm=I=-15:TP=-1.5:LRA=11 -ar 48000 -c:a aac -b:a 192k out.mp4`.
- Music and sound effects: ask the user. Many creators add music in the app (TikTok/YouTube sound library) or cut sound themselves; then deliver
  the video with the voice only. Never put a copyrighted song into the file; use only sounds the user has rights to.
- Make a smaller phone copy (e.g. crf 23-26, under ~30 MB) so the user can watch it on their phone right away.
- Fonts: use a bold font that exists on the user's system or a free font file in their project.

## 9. Quality report (before showing the user)
Measure on the finished video and compare with `viral_patterns.md` and the user's chosen colour look: resolution and fps; first cut or strong motion by 1.5 s; median shot
length; share of time with the camera moving; share of time in shots of 3 s or longer; median saturation (mean of (max-min)/max over pixels of
a small downscale); mean brightness; single-frame flashes, black frames and jumps that are not planned (flicker); loudness and true peak; silence.
Use the same measuring method for references and for your own videos - two different methods once made a fine video look broken.
**Composition** (measure it from the plan in Studio, no capture needed, every 0.5 s): pose the frame, project every visible head into the 9:16
crop, skip heads hidden behind walls, and report people in the picture (0 / 1 / 2+), the biggest head as a share of the frame height
(close >= 30 %, medium close 18-30 %, medium 10-18 %, full 5-10 %, wide < 5 %), field of view and camera height. Targets in
`camera_and_shots.md` section 1b. This was the measurement that explained why a technically clean video felt lifeless.
Add a contact sheet (one frame per shot) and a 0.25 s strip of the first 3 s. Numbers never replace looking: show the user the clip.
