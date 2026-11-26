---
name: roblox-in-this-town
description: Know-how and workflow for making viral-quality vertical (9:16) narrated Roblox story shorts ("In this town, ..." and similar) with Claude driving Roblox Studio over MCP - what goes viral and what does not (measured), how to build places, characters, faces, acting, camera moves, effects, voice, captions and quality checks, and the known pitfalls with their fixes. Use when the user wants to make Roblox story videos, an "In this town" short, a Roblox TikTok/YouTube Short with narration, or asks how such videos are made. The user brings the story and their style; this skill gives the technical foundation and measured defaults so the production does not hold the story back.
---

# Roblox story shorts ("In this town, ...")

This skill is knowledge and a workflow, not a template. It tells you what viral Roblox story shorts have in common, what to avoid,
how to build every piece, and where things silently go wrong. You build the user's own tools, places, characters and faces with them,
in their style. Nothing here should make two users' videos look the same.

## Principles
1. **The story is king.** Hits share a production baseline (`references/viral_patterns.md`); the story decides. Protect the baseline, help
   sharpen the story, never replace the user's idea with your own.
2. **The voice is the clock.** Script -> voice -> word times -> every event anchored to a spoken word.
3. **Places, not shots, and places full of their people.** Few places, revisited; each place has the people who belong there; cut only for a
   reason. The tested default camera travels through a place like a player camera (wide lens, above head height); other camera styles are
   in `references/styles.md`.
4. **Look before you show.** Stills of every camera position, the first 3 s as a 0.25 s strip, faces at full size. The camera inside a tree,
   a wall or a person, and faces turned away from the camera (profile, backs of heads), are the most common failures.
5. **One place first.** Build and render place 1 (5-15 s), get the user's yes, then the rest. Change one thing at a time.
6. **Readable beats busy, and surprising beats flat.** In every style the viewer must see at once who, where and what happens. Within that,
   stage each sentence as boldly as it allows: bigger, funnier, stranger (`references/directing.md`). Never add story the script does not
   have. Random extras, effects and cuts that serve nothing made the author's test videos worse.
7. **Never upload images to Roblox without the user's consent, never use other creators' images, characters, scripts or videos.**

## What is fixed and what is free
Keep these three layers apart, also when you talk to the user:
1. **Technical foundation - always.** How Roblox Studio, rendering, voice and assembly break, and the fixes (`troubleshooting.md`, `pipeline.md`).
   This is not taste: a flickering body, a camera inside a wall or captions out of sync are broken in every style.
2. **Measured baseline - the default.** What viral shorts of this kind had in common in November 2026 (`viral_patterns.md`): a readable face
   early, few places, captions, a clear voice. Formats move; break a point on purpose if the user wants to, and look at the result.
3. **Style - the user's.** World, body type, faces, camera style, captions, voice, tone, graphics, music. The numbers in this skill describe
   the tested defaults, not the only way. Offer the options in `styles.md`, build one sample in the chosen style, let the user judge it.

## Workflow
**Once per user (setup)** - if the user's tools already exist, read their `TOOLS.md` and go straight to the per-video steps:
1. Check the environment: Roblox Studio with its built-in MCP server connected to Claude (Studio's Assistant settings, "MCP Servers";
   Roblox's guide: create.roblox.com/docs/studio/mcp), a place file saved under a clear name, Python 3.10+, ffmpeg.
   In that place set `StarterPlayer.AvatarJointUpgrade = Disabled` by hand (code poses need classic joints).
2. Build the user's tools in their project folder, small and testable (`references/pipeline.md` describes one proven way and its traps;
   adapt it freely): Studio client, Luau modules, plan resolver,
   stills tool, render loop, assembly, voice, quality report. Run a two-sentence story through the whole chain once, then write `TOOLS.md`.
   Reuse them for every video.
3. Agree on their style (`references/styles.md`): first the colour look as a picture choice (one sample corner rendered in three looks),
   then at most 2-3 questions about feeling and taste and links to creators they like. Change the sample until they say yes.
   Unchosen areas stay on the defaults.
4. Build their cast: if they want a recurring hero, 2-3 options in their style, shown as a sheet; the user picks; save it. Draw their face set (`references/characters_and_faces.md`).
5. Build the places their stories need (`references/world_and_light.md`). New stories add places over time.

**Per video:**
| # | Step | Read |
|---|---|---|
| 1 | Story: idea -> script. Rule stories: rule, hero, planted details, escalation, twist; other stories keep their own shape. **User approves.** | `story.md`, `viral_patterns.md` |
| 2 | Voice and word times (local text-to-speech or the user's recording) | `pipeline.md` 7 |
| 3 | Places and cast needed by this story (reuse, add what is missing), each place with its own people and the story's props | `world_and_light.md`, `characters_and_faces.md` |
| 4 | Plan **place 1 only**: per sentence what the viewer sees and the idea that makes it worth watching, camera route, beats per character, effects | `directing.md`, `camera_and_shots.md`, `animation_and_effects.md`, `pipeline.md` 6 |
| 5 | Measure composition (people in frame, close-up share, field of view), one stills sheet; fix in one pass | `troubleshooting.md`, `pipeline.md` 9 |
| 6 | Render place 1 + assemble, look at it yourself -> **user approves**. While they watch, build and check place 2 (do not render it yet) | `pipeline.md` 2, 8 |
| 7 | Plan the other places the same way (measure, one sheet each), render all in the background, assemble, quality report, fix, show | `pipeline.md` 9 |

## Token and time budget
In the author's runs (toolkit already built) most of the time went into the model reading and writing, not into the scripts: the first
video took 48 minutes to the approved first place. With the rules below, the next one (74 s, 4 places, 46 shots) took 30 minutes to that
point and 76 minutes in total, 32 of them rendering.
- **One video = one fresh chat.** Never continue a long conversation or fork one: every step re-reads the whole history.
- **Keep a one-page command sheet** (`TOOLS.md`) next to the user's tools: commands, measured times, existing places and anchors, cast
  options. Read it instead of the source code (reading the whole source once cost about 15 minutes, and it stays in context).
- **Plan place by place.** Write the plan for place 1 only, take stills, render it, get the user's yes, then plan the rest. A whole
  50-shot plan in one message was the biggest single cost, and every fix after the stills rewrote it.
- **Short plans through good defaults:** the scene code's default framing is the player camera; write sizes only for accents.
  Fix plans with small edits, not with scripts that rewrite the file.
- **Measure before you render:** the composition check (people in frame, close-up share, field of view) runs in seconds from the plan and
  finds "too close, only one person" before a 15-minute render does.
- **Stills: one sheet per place** (8-12 frames), fix everything you see on it in one pass, then confirm only the frames you changed.
  Looked-at pictures are the biggest token cost of a video; keep sheets small (about 1400 px wide is enough to judge).
- Read a reference when you reach its step, not all at once. `craft.md` (film craft with sources, long) only for specific questions: search it.
- Never pose and capture frames one tool call at a time: the render loop is a script running in the background (~0.3-0.9 s per frame;
  a 60-75 s video takes ~15-35 minutes). Wait for it to finish; do not poll.
- Read the quality report as text first. Things made once per user (tools, hero, face set, places in the saved place file) are reused, never rebuilt.

## Talking to the user
- Talk in their language. Ask once which language the video's voice and on-screen text should be in, and keep it.
- Ask about feelings and choices they can judge ("should the shock feel bigger?", "which hero?"), never about technique; give one recommendation.
- After criticism: measure and look first, then change one thing, then show the same moment again. Keep every version; never overwrite an approved one.

## References
- `references/styles.md` - the style menu: options per area (world, body, faces, camera, captions, voice, tone, graphics, music) and how to choose
- `references/directing.md` - staging each sentence so it is funny, exciting, mysterious, eerie or warm, without adding story
- `references/viral_patterns.md` - what hits do and weak videos do not (story, hook, places, camera, look, cast, faces, captions, sound)
- `references/story.md` - structure, writing rules, hook check
- `references/camera_and_shots.md` - shot size per sentence, move or cut, routes, distances, 9:16 framing, keeping the camera out of things
- `references/world_and_light.md` - finding and loading kits safely, building places, life, mood light, colour
- `references/characters_and_faces.md` - dressing R6 by code, the cast system, drawing a face set, sharp faces in Studio, dosing
- `references/animation_and_effects.md` - stepping animations, poses, acting timing, flicker-free effects
- `references/pipeline.md` - what to build and how it fits together, with code for the traps (Studio MCP, rendering, camera, faces, light, voice, assembly, QA)
- `references/craft.md` - film craft research with sources (cutting, moves, framing math, acting, light)
- `references/troubleshooting.md` - every known bug and its fix
