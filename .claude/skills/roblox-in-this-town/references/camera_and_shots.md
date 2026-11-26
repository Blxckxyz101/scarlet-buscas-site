# Camera, shot sizes and cuts: the decision logic

This is the part of the workflow that decides, per sentence of narration, what the viewer sees: which shot size, whether the camera keeps
moving or cuts, where it goes and how fast. Numbers come from measuring viral Roblox story shorts (TikTok, Nov 2026) and from film craft
(`craft.md`, with sources). Apply it per sentence when you plan the video.

## 1. The core idea: places, not shots

A viral story short does not jump between unrelated pictures. It stays in a place and the camera travels through it like a drone,
showing the next thing the narrator talks about. Cuts happen for a reason.

| Measured | Studio-style hits (recent) | Soft-render hits | Weak videos |
|---|---|---|---|
| Time in camera moves of 3 s or longer | 34-73 %, median 49 % | 15-52 %, median 38 % | similar |
| Camera moving | 82-96 % of the time | 68-89 % | similar |
| Median shot length | 1.35-2.6 s | 1.4-2.2 s | 1.4-3.2 s |
| Cuts that stay in the same place | 49-83 % | | 18-33 % |

Camera numbers alone do not separate hits from flops. What separates them: staying in a place, showing the right thing at the right word,
and a world worth looking at. So the camera rules below serve the story beat, never the other way round.

## 1b. The base camera: a player camera, not an interview

The most common way to make a lifeless video: every sentence framed as one person, at eye level, with a long lens. Measured on a full test
video built that way: 66 % of the time exactly one person in the picture, 3 % two people, 54 % of the time close-up or medium close-up,
field of view 40 degrees, camera at eye height. The author judged it far too close, always only one person, the town felt dead.
The viral references showed 25-60 % of shots with two or more people, only 7-15 % close-ups, a wide lens and a camera that is often above
head height: the place and its people are part of every picture, like in the game itself. The same 13 s re-shot with a player camera and the
place's own people: two or more people in frame went from 0 % to 44 %, close-ups from 70 % to 7 %, and the author judged it clearly better.
This is the tested default; other camera styles and their numbers are in `styles.md`.

**Default framing for most of the video:**
| | Value |
|---|---|
| Field of view | 55-70 degrees (Roblox's own camera uses 70) |
| Camera height | 7-13 studs above the floor (2-6 studs above head height), looking down 15-30 degrees |
| Distance | 9-16 studs from the main subject |
| In the picture | the main subject plus the place: counter, room, street, and the people who belong there |

- Long lenses (FOV 30-45) and close-ups are an accent for punchlines, shocks and the one key reaction of a scene: about 10-15 % of the time.
  Drama and horror stories use more of them than comedy and everyday stories.
- Shoot over something: a customer's shoulder, the counter edge, a door frame. Foreground in the lower third gives depth and the feeling of
  standing inside the place.
- A repeated gag (a catchphrase said again and again) does not need a face punch-in every time: keep the player camera and add a graphic
  accent (speed lines, a sticker) or an action instead.
- Measure it on your own plan before rendering (see `pipeline.md` section 9): people in frame, field of view, camera height, close-up share.

## 2. Per sentence: pick the shot size by what the sentence is about

| The sentence is about ... | Shot size | Why |
|---|---|---|
| A new place, a new day, scale, a crowd, "everyone in this town" | **Wide** (head ~6 % of frame height) or drone | geography first; a new place needs a wide within its first 2 s |
| What a character does with their body (walks, falls, runs, waves), physical comedy | **Full** (head ~12 %) | comedy reads in the long shot |
| Normal narration about a character, two characters together | **Medium** (head ~20 %), two-shot in profile | the default; whole attitude visible |
| A feeling, a realisation, a decision, a reaction, a spoken line | **Medium from the base camera**, pushing in; **medium close-up** (head ~30 %) only for the key reaction of a scene | a first-person narrator talks about feelings in almost every sentence: close-ups for all of them make the video one face |
| The punchline face, shock, the twist | **Close-up** (head ~45 %) as a short punch-in, at most 1-1.5 s | emphasis by contrast; never two in a row |
| A thing the narrator names (clock, sign, phone, letter, eye, door) | **Insert** of the object | the viewer must read or notice it |

Mix to aim for over a whole video: about 45-55 % wide/full (the place with its people), 30-40 % medium, 10-15 % medium close-up/close-up,
5-10 % inserts. Two or more people in the picture 40-60 % of the time. (Defaults of the player-camera style; `styles.md` has the values for others.)
The hook is the exception: a character is big and readable by 1.5 s (11 of 12 hits did this, 0 of 5 flops), then the camera pulls back to show the place.

Distances for a 5-stud R6 character in 9:16 (vertical field of view; see `craft.md` section 3 for the math):

| Size | Head share | FOV | Distance | Camera height |
|---|---|---|---|---|
| Player camera (base) | ~8-15 % | 55-70 | 9-16 | 7-13, pitch -15 to -30 |
| Close-up | ~45 % | 30 | 5.2 | 4.2 |
| Medium close-up | ~30 % | 35 | 6.7 | 3.9 |
| Medium | ~20 % | 40 | 8.7 | 3.6 |
| Full | ~12 % | 45 | 12.1 | 3.0 |
| Wide | ~6 % | 50 | 21 | 6-15, pitch -10 to -20 |
| Drone | ~2 % | 60 | 52 | 25-60, pitch -15 to -35 |

FOV above 45 for medium close-ups or tighter distorts faces and busies the background; use it only when the distortion is the joke.

## 3. Keep moving or cut?

Default: **keep moving** while the narration stays in the same place and the next subject is within about 30 studs.
The camera glides from one "station" (a framing for a sentence) to the next in 1.5-3 s without stopping.

**Cut** when:
1. the place or the time changes (new day: hard cut or whip pan),
2. a punchline or reveal lands (cut or punch-in exactly on the stressed word, then hold at least 30 frames),
3. the reaction of a different character matters (cut to them for 0.8-1.5 s),
4. an object must be read (insert, 0.5 s + 0.25 s per word of text on it),
5. reaching the next framing would need more than 90 degrees of turn or a size change of more than 3x in under 1 s.

Cut rules:
- The new picture lands on the word that names it, 0-3 frames early.
- Two shots of the same subject differ by at least 30 degrees of camera direction or 1.5x in size (else it reads as a jump cut).
  A punch-in on the same axis is allowed when the size changes by 1.6x or more on a stressed word.
- Cut during movement (a turn, a door opening), not before or after it.
- Keep the 180-degree line: per scene, all cameras stay on one side of the line between the two characters (or a character and what they watch).
  Cross it only with a continuous move, a shot exactly on the line, or an insert.
- At least one visible change per sentence (cut, new move phase or new pose); no static picture for more than 3 s unless the stillness is the point.
- A character that changes state inside a shot (sitting to standing, a prop disappearing, a teleport to a new spot) pops visibly: put a cut
  exactly on that moment.
- Wide shots with life in them may run 3-6 s; fast cuts belong to gags.

## 4. Camera moves and what they mean

| Move | Use | Duration and size |
|---|---|---|
| Drone/crane in | opening of a place, scale | 2.5-5 s, from 25-60 studs high |
| Glide (track) | follow a walking character, travel between stations | as long as the walk, camera lags 0.2-0.4 s |
| Push-in | tension, "this matters", realisation | 2-4 s, frame shrinks 20-35 % |
| Pull-back | reveal of the place or of the problem, loneliness | 1.5-3 s, frame grows 2-4x |
| Orbit | a still moment that should feel big | 20-60 degrees in 2-4 s, never more than 90 |
| Whip pan | transition to a new place or time | 6-10 frames, cut in the middle of the blur |
| Shake | shock, impact | decays in 0.3-0.6 s, 1-3 degrees |
| Hold | after a punchline | 0.6-1.5 s, nearly still |
| Crash zoom (FOV) | comic punch-in | 3-5 frames |

- Every move needs a reason (someone walks or turns, a sound, a reveal). Write the reason next to every shot in your plan.
- Move the camera, do not zoom (parallax makes the place feel real). FOV zoom only for comic crash zooms.
- Ease in and out over at least 8 frames. Never linear starts or stops.
- **Rotation speed:** frames rendered one by one have no motion blur, so a pure pan between about 4 degrees per second and a whip pan strobes.
  Prefer travelling with the subject staying in frame; turn slowly or fast, never in between. Keep turns under 90 degrees per sentence.
- During a dialogue exchange, hold the camera still and cut between speakers.
- **Turns between subjects:** stay on the old framing, then swing over at the end of the gap in about 0.27 s (whip) or 0.6 s (turn).
  A slow drift between two far-apart subjects shows parked cars and empty pavement.

## 5. Framing in 9:16

- Safe box for faces and important things: x 120-900 px, y 240-1260 px (TikTok's own template: top 240, bottom 660, right column 180 px for the buttons).
- Eyes on the upper third (medium close-up: eyes at 0.30 of the height).
- Look room: a character looking right sits at x 0.38-0.42, looking left at 0.52-0.56.
- Two characters: profile two-shot facing each other, 2.5-3 studs apart (head ~13-15 %). Front-facing side by side only as a wide.
  Over-the-shoulder works only with the near shoulder at most a third of the width.
- Flat drawn faces disappear in pure profile. For a meeting (someone congratulates, hands over, asks), stage it so both faces read: side by side
  turned three-quarters towards the camera like a photo, or over the shoulder of one onto the other. An automatic two-shot placed "where both
  face" ended up behind two backs of heads and once inside a crowd.
- Keep look targets within ~35 degrees of where the body faces; a head turned further shows the back of its head to a front camera.
- **Stage for the camera like theatre.** Whoever speaks or reacts faces the camera at about 45 degrees; a fight or argument in pure profile
  hides both faces. Groups (witnesses, a crowd around an event) open towards the camera in a horseshoe, never a closed circle with backs
  to the lens; on their reaction, turn them towards the camera side.
- Big things read big only when near: a giant creature 40 studs away looked normal-sized; at ~28 studs with a low camera looking up it was huge.
- Poses that twist the torso (pointing, throwing) read from the side they twist towards: put the camera there.
- Check every walk and escape path against the camera: people fleeing past the lens or a crowd packed in front of it ruin the shot.
  Send them away from the camera, to the sides of the place.
- Coworkers, friends, a family: place them close enough to share a frame (3-6 studs), not at opposite ends of the room.
- Nothing in front of the face: check every camera key with a raycast (trees, awnings, lamp posts, other characters).
- Captions must not cover a face: small captions in the lower third (55-80 % height) leave the face free; close-ups keep the chin above 0.55.

## 6. Building a camera route
1. For each sentence, place one station: framing (size from section 2, subject, side of the line) and a look target (a character's head or chest, or a named spot).
2. Connect the stations with a smooth curve (Catmull-Rom) for the position; blend the **viewing direction as yaw and pitch angles** between stations
   (blending direction vectors makes opposite directions cancel out and the view tips into the sky or the floor).
3. Time each station to the first word of its sentence (the voice's word times are the clock).
4. Speed never drops to zero between stations, only at the end of a route or for a hold.
5. Stations follow moving subjects (resolve the framing at the current time, not once).
6. Two stations on the same subject from very different angles: blending the view direction swings the subject out of frame in the middle
   of the move. Blend the look-at point instead, or cut.
7. A framing relative to where a character faces ("front", "three-quarter") jumps to the other side when the character turns: after a turn,
   use a fixed camera position for that shot.
8. Seated characters: their head is ~1.5 studs lower; lower the camera height for them or the frame cuts their head off at the bottom.

## 7. Keeping the camera out of things (automatic, in the camera code)
- **Line of sight** from the subject's head to the camera must be free of walls and props (furniture, cars, signs). Tree crowns and lamp posts
  do not count (a camera pulled in front of every crown ends up far too close).
- If the wanted side is blocked, try the nearest free angle around the subject (35, 70, 110 degrees, then the opposite side) before pulling in.
  Interiors have one open side; cameras stand there.
- Never closer than ~2.5 studs to a head (inside a head = a white frame), never within ~1.2 studs of a prop (a pillow filled half the frame),
  never below ~2 studs height (very wide framings need a raised camera).
- Two-shots widen until both characters fit: the 9:16 frame is only 0.5625 x its height wide.
- Windows need an invisible blocker for this check, or the camera slips outside through the opening.
- Still check every station with a picture: these rules catch most problems, not all.
