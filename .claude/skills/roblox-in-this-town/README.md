# Roblox story shorts with Claude Code

A free Claude Code skill for making vertical Roblox story shorts in the style of the viral "In this town, ..." videos:
a narrator tells a strange little story, and real Roblox characters act it out in real Roblox places.

Claude drives Roblox Studio itself. It builds the places, dresses the characters, plans every camera move to the spoken words, renders the
video frame by frame and adds voice and captions. No AI video generator is involved: everything you see is real Roblox, made by code you own.

The skill is a foundation, not a template. Your story, your characters and your style stay your own.

## What you get instead of starting from zero
- **The traps, already solved.** About 75 problems that cost hours to find: flickering bodies, blurry characters, the camera inside a tree,
  captions out of sync, hidden scripts in free models, faces that render blocky, hair that silently disappears. Each with the fix.
- **Measured numbers instead of guesses.** What viral shorts of this kind had in common and what weak ones got wrong, measured frame by frame:
  the first 1.5 seconds, how many places, how the camera moves, how long a shot lasts, how loud, how fast the narrator talks.
- **A workflow that does not waste your time.** Story, voice, first place, your yes, then the rest. Built-in checks find problems before a
  30-minute render does, and token rules keep chats fast.
- **A style menu instead of one look.** Options for tone, world, faces, camera, captions, voice, graphics and sound. Pick what you like;
  everything you do not choose stays on tested defaults.

What it does **not** give you: ready-made code, characters or maps. It is knowledge: Claude writes your toolkit with you in the first
session (see below), guided step by step, with code for the spots where things silently go wrong.

## What you need
- [Claude Code](https://claude.com/claude-code)
- Roblox Studio with its built-in MCP server connected to Claude Code
  (Studio's Assistant settings, "MCP Servers"; see [Roblox's guide](https://create.roblox.com/docs/studio/mcp))
- Python 3.10+ and ffmpeg
- Tested on Windows.

## Install
Copy this folder to `~/.claude/skills/roblox-in-this-town/` (or into your project's `.claude/skills/`). Then tell Claude:
*"Help me make Roblox story shorts"*, or paste your story: *"Make an In This Town short: In this town, ..."*.

## What happens
**The first time (once):** Claude checks your setup and builds your own small toolkit in your project folder: the Studio connection,
place builders, characters, a face set, the camera, the render loop, voice, assembly and a quality report. You choose your style from the
menu and your channel's hero from a few options. This first session is long (expect several hours), but you only do it once.

**Every video:**
1. You bring the story. Claude shapes it into a script with the structure of the hits and changes nothing without your yes.
2. Voice: a free local text-to-speech voice, or your own recording. The spoken words become the clock of the whole video.
3. Claude plans and renders the **first place only** (5-15 s) and shows it to you.
4. After your yes, it does the rest, checks the finished video against measured numbers and shows it to you.

In the author's runs, once the toolkit existed, a 74 s video with 4 places took 30 minutes to the first approval and 76 minutes in total
(32 of them rendering). Use one fresh chat per video; long chats get slow and expensive.

## Good to know
- While frames render (15-35 minutes per video), Roblox Studio has to stay visible on screen; a covered window gives empty frames.
- The first session uses a lot of Claude usage; plan it for a day with room in your plan's limits.
- The free local voice and the word timing download their models on first use (a few hundred MB).
- In your place file, set `StarterPlayer > AvatarJointUpgrade` to Disabled once by hand (in the Properties window); code poses need it.

## What's inside
| File | What it is |
|---|---|
| `SKILL.md` | Principles, what is fixed and what is free, the workflow step by step, the time and token budget |
| `references/styles.md` | The style menu: options per area, marked tested / seen in hits / possible |
| `references/viral_patterns.md` | What viral shorts do and weak ones do not (story, hook, places, camera, look, cast, faces, captions, sound) |
| `references/story.md` | Story structure, writing rules, the hook check |
| `references/directing.md` | Staging: how to show each sentence so it is funny, exciting, mysterious, eerie or warm, without changing the story |
| `references/camera_and_shots.md` | Shot size per sentence, when to move and when to cut, distances, 9:16 framing, staging for the camera |
| `references/world_and_light.md` | Building places from Creator Store kits safely, filling them with life, light per mood, colour |
| `references/characters_and_faces.md` | Dressing characters by code, the hero and side characters, drawing your own face set, using faces well |
| `references/animation_and_effects.md` | Animation, acting, props, flicker-free effects, comic stickers |
| `references/pipeline.md` | How the toolkit fits together, with code for the spots where things silently go wrong |
| `references/troubleshooting.md` | Every bug hit so far: what you see, why, what to do |
| `references/craft.md` | Film craft research with sources (cutting, moves, framing math, acting, light) |

## Fair play
- Use your own stories and characters. Never copy another channel's characters, videos or look one to one.
- Creator Store models often contain scripts: the skill strips them before use.
- Nothing is uploaded to Roblox without your consent; never upload images you do not own.
- Add only music and sounds you have the rights to.

## License
MIT (see `LICENSE`). Roblox and Roblox Studio are trademarks of Roblox Corporation; this project is not affiliated with Roblox.
Roblox allows creators to make and monetize videos of Roblox content (check its current terms).
