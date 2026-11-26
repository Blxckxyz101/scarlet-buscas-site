# Directing: making every scene worth watching

The technical rules make a scene clean. This file makes it interesting: funny, exciting, mysterious, eerie or warm.
Use it when you plan each place (per-video step 4). Tags: **[hits]** seen in viral videos of the niche, **[tested]** built in this
workflow's test videos, **[craft]** film and comedy craft.

## 1. The script is the story, the staging is yours
- **Never add story.** No new events, scenes, characters with a role, places or lines that are not in the user's script. The user wrote
  what happens; your freedom is *how* it is shown.
- Inside each sentence you are free: how big, how strange, how funny or creepy it looks, who in the place reacts and how, where the camera
  is, what the light does, which prop makes the sentence visible, what the people of the place are doing meanwhile.
- **Show it, then top it.** First the viewer must see exactly what the sentence says. Then push that same thing further than the words:
  "a big chicken" becomes a chicken taller than the houses [tested]; "everyone loved burgers" becomes a counter piled with burgers and a
  queue out of the door [tested].
- One strong idea per moment, then let it land. Unexpected is good when it grows out of the sentence or the town's rule; noise (random
  people dancing, effects that mean nothing) is not [tested].

## 2. How to find the idea for a sentence
For each sentence of a place, think of 2-3 ways to show it, from these angles, and pick the one that is most surprising and still reads
at once on a phone with the sound off:
- **Literal and over the top:** take the words exactly, then scale them up (size, number, speed, loudness of the reaction).
- **The rule in daily life:** how does the town's rule look on a normal thing in this place (a menu, a sign, a bus stop, a school desk)? [hits]
- **Contrast:** calm narration over chaos on screen, or chaos told while someone stands deadpan and bored [craft].
- **The reaction:** who in the place reacts, and differently from the hero (one screams, one keeps eating) [hits: half the room screams].
- **The thing in the world:** text on a sign, a screen, a calendar, a clock that says the sentence without words [hits].
Write the chosen idea as the shot's `why`. With the plan of place 1, show the user a short list of your biggest staging ideas: they are the director.

## 3. Toolbox by feeling
| Feeling | What works |
|---|---|
| **Funny** | exaggerated scale and numbers (a mountain instead of one) [tested]; two normal reactions, the third absurd [craft]; a deadpan face next to chaos, hold 1 s [craft]; a running gag when the script repeats something (same sound, same pose each time) [hits]; things popping into or out of the frame [craft]; comic stickers on the word ("???", "ZZZ", speed lines) [hits, tested]; body comedy in a wide shot, pause 0.3-0.6 s before the payoff, hold 1 s after [craft] |
| **Exciting** | a ticking clock, countdown or sign in the world; a push-in of 2-4 s on the decision; a short shake on impact; slow motion once at the peak; each failed try looks bigger than the last [craft] |
| **Mysterious** | show the reactions before the thing; show the thing only in part (a shadow, a glow behind a door, half in frame); the strange thing the script names, placed in an otherwise normal place; a pull-back that reveals what was around the subject [hits]; text in the world that only makes sense later [craft] |
| **Eerie** | stillness: everyone stops at once, room sound drops, a long hold on purpose; many identical people doing the same thing (normally "twins" are a mistake, here they are the effect); all faces turning to the camera together; one practical light, a slow red pulse [craft] |
| **Warm** | golden light, slower moves, a small gesture (a hand on a shoulder, sharing food), the one close-up on the key reaction [hits, craft] |
Rules from the other files bend for a feeling on purpose (a long still shot in a horror story, twins for eerie, a look into the lens as the joke).

## 4. Places with personality
- **The rule is visible in the place** when the script's rule touches it: what would a shop, a street, a classroom look like in this town? [hits]
- **One landmark per place** the viewer recognises when the story comes back (a black ball in an empty room, a burger counter) [tested].
- **The people of the place live:** they do what the place is for in a loop and react to the event, staggered [hits]. Small odd details
  in the background are fine (someone asleep at a table) as long as they stay calm and never sit in front of a punchline.
- **A place the story revisits shows what the script says has changed** (the mess after the event, other light, the crowd in a new state).

## 5. Making exaggeration work in Studio
- Giant things: scale a model (`Model:ScaleTo`), place it close, camera low looking up (`camera_and_shots.md` 5) [tested].
- Crowds: clones of the extras you built, switching between a few states on the beats (`world_and_light.md` 3) [tested].
- Impossible things (a vanish, a laser, an explosion): flicker-free effects from `animation_and_effects.md` 3, neon cubes, Highlights [tested].
- Props as code from simple parts: a laser gun from five blocks, bread from two; no upload, no Toolbox scripts [tested].
- Faces: one exaggerated face on the punchline gets the laugh; the dose keeps it funny (`characters_and_faces.md` 5).

## 6. Check before rendering
- With the sound off, can a viewer tell in every shot what happens?
- Does every big idea come from a sentence of the script? Remove what only adds noise or adds story.
- Is there at least one moment per place someone would want to show a friend? If not, push the strongest sentence of that place further.
