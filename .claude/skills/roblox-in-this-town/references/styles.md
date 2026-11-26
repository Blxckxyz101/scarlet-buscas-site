# Style menu: what the user chooses

Everything in this file is the user's choice. The technical rules of this skill work for all of it.
- **tested** = built and judged in this workflow's test videos
- **seen** = found in viral videos of the niche (Nov 2026), not built here
- **possible** = ordinary Roblox or video craft, not tried here: build a sample before a whole video
- ★ = the default when the user has no wish

**How to choose with the user:** ask about feelings, not technique ("eerie or funny?", "like a real game or like a toy?"), at most 3-4
questions, and ask for 1-3 links to creators they like (to look at, never to copy). Build one sample place with one character in the chosen
style, show a still and 3 seconds of video, change it until they say yes. Areas they do not care about stay on ★.
Start with the colour look (below): it is the choice people care most about and can least put into words.

## Tone and genre
How to stage each feeling: `directing.md` section 3.
- ★ Rule world with a twist ("In this town, ..."): tested.
- Eerie / horror: seen, among the strongest genres. Darker moods, slower camera, fewer jokes; faces still readable.
- Comedy and chaos: seen. Body comedy in wide shots, stickers, quick cuts on gags.
- Warm and emotional: seen. Golden light, slower moves, close-ups kept for the key reactions.
- Dark hero stories, classic tales retold in Roblox: seen.

## World
- ★ Looks like a real Roblox game, built from Creator Store kits: tested.
- One strong colour or mood world (all-red horror, foggy and empty, pastel dream): possible. Keep it consistent from place to place.
- Simple self-built blocks: read as a toy world in weak videos and in the author's first tests. Use it only on purpose (e.g. a nostalgic
  "old Roblox" story).

## Colour look (choose with a picture)
People cannot describe a colour look in words, but they know it at once when they see it: the author needed three rounds to find his.
So build one sample corner with one character, render the same frame in the three looks below as one sheet, and ask one question:
"Which one feels like your channel?"
| Look | What makes it | Saturation |
|---|---|---|
| Bright game | daylight, many clear colours on real materials, colourful props; comedy | 0.50-0.75 (current Studio-style hits 0.53-0.76) |
| Natural | real kit materials (brick, cobblestone, wood), natural light (afternoon, golden hour, evening), calmer colours | 0.40-0.50 (the author's final look) |
| Film mood | darker, one colour world per place, strong practical lamps, haze; horror, drama | not measured here |
- Not offered: the **toy look** (smooth plastic, flat noon light, empty places; 0.24-0.30 on the author's first streets). It is the beginner
  trap and read as "dead". Use it only on purpose.
- "Dead" came from materials, flat light and emptiness more than from the colour number: more colour alone fixed it only half; real kits
  and natural light fixed it. Too much colour in a toy world (0.60) read as shrill.
- Save the choice with its saturation range next to the user's tools (e.g. in `TOOLS.md`). The quality report compares every video with it.
  Ask again only when a story clearly needs another mood (a horror story on a bright channel).

## Cast
- ★ A recurring hero with one signature look, the same in every video: seen in the hits.
- A new lead for every story (anthology channel): possible. Recurring side characters still help.

## Body
- ★ R6, the classic 6-block body: tested.
- R15 (bendable elbows and knees): possible; needs its own pose table and animations.

## Faces
- ★ An own drawn set, simple and readable: tested.
- An exaggerated meme-style set for punchlines: tested. Dose it: in the author's test, shock faces 59 % of the time felt far too traumatic.
- Other drawing styles (anime eyes, a classic smiley look): possible, same technique.

## Camera
- ★ Player camera: wide lens, above head height, the place and its people in the picture, close-ups as accents: tested, judged clearly
  better than eye-level framing.
- Cinematic drama: more medium close-ups and close-ups (about a third of the shots in drama hits), slow push-ins: seen.
- Drone documentary: long glides over the town while the narrator explains: seen (Studio-style hits spend 34-73 % of the time in moves of 3 s or longer).
- First person: the camera at the hero's eyes, hands in the picture: possible.
- One person in close-up at eye level, sentence after sentence: tested, and the author found it far too close, the town felt dead.
  Fine for an intimate story on purpose; as the main style of a town story it lost against the player camera.

## Captions
- ★ Small bold text in the lower third, 1-3 words, the stressed word highlighted: tested; most recent Studio-style hits.
- One big word in the middle: seen (soft-render channels). Keep faces out of the middle band.
- A whole line on screen with the spoken word lighting up: possible.
- None in the file, the user adds them in the app: possible; app captions are less exact.

## Voice
- ★ A free local text-to-speech voice: tested. Pick a lively one; 3.5-4.7 words per second.
- The user's own recording, or an AI voice they have the rights to, aligned to the script: tested.
- Delivery: lively storyteller (measured in the current hits) or a flat, eerie narrator (where the format started): seen both.
- Extra voices for dialogue lines: possible; one file per line, aligned the same way.

## Graphics
- ★ Small comic stickers on the words (ZZZ, ???, speed lines, "1 HOUR LATER"): tested and seen.
- Text inside the world instead (signs, phone screens, a talking object): tested.
- No graphics, pure film look: possible.

## Light
- One mood per place, changed only on a story turn: day, afternoon, golden hour, blue hour, night, warm interior, cold room, danger: tested
  (starting values in `world_and_light.md`).

## Sound
- ★ Voice only in the file; the user adds music in the app: tested. Every hit has sound, so do not publish it silent.
- Music or room sound 8-12 dB under the voice plus effects on visible events: seen in the hits. Only sounds the user has the rights to.

## Length and format
- Length follows the story: 56-180 s in the hits, median about 100 s; the tests were 54-74 s.
- 9:16, 1080 x 1920, 30 fps works for TikTok, YouTube Shorts and Instagram Reels.

## Numbers that move with the style
The checks in this skill (plan check, composition measure, quality report) use these values. They are the defaults of the tested style;
when the user picks another style, set the values with them and let the checks read them.

| Value | Tested default | Measured in hits / note |
|---|---|---|
| Close-up and medium close-up share | 10-15 % | 7-15 % in everyday and comedy hits, about a third in drama hits |
| Two or more people in the picture | 40-60 % | 25-60 %; a lonely or horror story may want fewer on purpose |
| Longest still picture | 3 s | hits never stood still longer; a slow horror shot may hold on purpose |
| Close-ups in a row | none | a deliberate rhythm of reaction close-ups is a style choice |
| Big shock faces | about 2 per video | more turns comic into grim |
| Field of view for close faces | 30-45 | wider distorts the face: fine when the distortion is the joke |
| Narrator | 3.5-4.7 words/s, lively | a flat, eerie narrator is slower and lower |
| Saturation inside a place | 0.45-0.75 | a neon or a washed-out world is a look of its own |

## The same in every style
Everything in `troubleshooting.md`: no half-transparent bodies, no depth of field in Studio, the camera never inside things, faces readable,
captions in sync with the voice, kits stripped of scripts, nothing uploaded to Roblox without the user's consent.
