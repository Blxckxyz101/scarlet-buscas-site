# Film craft for code-driven Roblox story shorts (research, Nov 2026)

Goal: rules a script can apply on its own for 9:16 (1080x1920, 30 fps) narrated "In this town" shorts with blocky R6 characters.
Tags: **[n]** = source in the list at the end. **[C]** = craft knowledge, unsourced. **[D]** = derived here by calculation.
**[M]** = our own measurement (viral videos: shot median 1.35-2.6 s, 15-73 % of time in moves longer than 3 s, camera moving 68-96 % of the time,
captions one word in the middle (soft-render channels) or 1-3 small words in the lower third (Studio channels), saturation 0.45-0.75 inside one colour world; hits show a face big and free by 1.5 s; close-ups in hits = head ~30 % of frame height).
Weak sources (vendor blogs, used only where nobody better publishes numbers): [19], [20], [35]-[37], [40].
**Where this file and the other references disagree, the other references win:** they come from building and testing real videos.
The main case: the base camera of a video is a raised player camera looking down (`camera_and_shots.md` 1b), not a level camera at eye height.

---

## 1. Shot grammar

**Order of shots in a scene**
- Default progression: wide/establishing, then medium, then close, getting tighter as emotion rises [1][2]. Reverse it (open close, withhold the place) only for the hook [2] [M: hits show a face within 1.5 s].
- Every new place opens with a wide that shows geography within its first 2 s, even inside one continuous drone move [1] [C].
- **Wide** for geography, a new place, scale, crowds and *physical comedy of the whole body* ("life is a tragedy in close-up, a comedy in long shot", Roud, often credited to Chaplin) [29]. **Close** for emotion, a reveal, a decision, the punchline face [1][2]. **Insert** (object, clock, sign, phone) whenever the narration names a thing the viewer must read or notice [2][39].
- Close-ups need a still or very slow camera [2]. Rule: during a CU, translation speed < 0.3 studs/s and no rotation faster than 2 deg/s [C].

**When to cut**
- Priority for every cut (Murch's Rule of Six): emotion 51 %, story 23 %, rhythm 10 %, eye-trace 7 %, 2D plane 5 %, 3D space 4 %. Give up the bottom ones first [5]. In fast short-form, eye-trace matters more than Murch's weight: put the next shot's focus point where the eye already is (within ~15 % of the frame width of the previous focus point) [6].
- **30-degree rule:** two consecutive shots of the same subject must differ by >= 30 deg in camera direction, or the cut reads as a jump cut. A tiny size change (full body to "ankles up") is the worst case [4]. Code: flag if `angle < 30 deg AND frame-height ratio < 1.5` [4][D]. Deliberate exception: a *punch-in* on the same axis is allowed if the frame height shrinks by >= 1.6x and it lands on a stressed word [C].
- **Cut on action:** cut while the character moves (turn, sit, stand, door opens), at the fastest part of the motion. The outgoing shot shows the start, the incoming one continues it [9]. Because we render from one simulation clock, use a straight cut with no repeated or missing frames; a 2023 viewer study preferred straight cuts over overlaps [9 summary].
- **Cut on narration:** the new image lands on the word that names it (the noun or stressed verb), 0-3 frames early so it is already there when the word is heard [C]. At least one visual change per narration sentence and every 2-3 s at the latest [37][M].
- **Do not cut less than ~1 s after a key line or punchline** (classic beginner mistake) [7]. Code: after a line tagged `punch`, hold >= 30 frames.
- **Reaction shots:** after something happens to A, cut to B's reaction when the story is about B's feelings. Hold "a beat or two", long enough to read the pose: 0.8-1.5 s [38] [C].
- **Inserts with text:** hold 0.5 s + 0.25 s per word, minimum 0.6 s [C].
- **J/L cuts with narration:** narration (and room sound) runs across cuts anyway. J-cut: the sound effect or ambience of the next place starts 6-12 frames before its picture. L-cut: keep the picture on the listener while the line finishes, for reactions [8] [C for frame counts].
- **Match cut:** link two places or times through the same shape, motion or object in the same screen position (bone to satellite) [10]. Code: keep the matched object's screen centre within 5 % of the frame between the two shots [C].
- **Smash cut:** hard cut between very different moods (calm to chaos) for comedy or shock [10].

**180-degree rule and eyelines in code** [3]
- Per scene, define the action line: through the two talking characters, from a character to the object they watch, or along the direction of travel.
- Every camera must stay on one side: `sign(cross(lineDir, camPos - A).Y)` is constant for all shots of the scene.
- Allowed ways to cross: a continuous camera move across the line, a neutral shot exactly on the line, or a cutaway/insert with no orientation [3].
- Screen direction: a character who walks left-to-right keeps doing so in every shot until we see them turn [3]. Left-to-right reads as natural, right-to-left as uneasy [13].
- In singles, the character's look direction points to the side where the other character is; leave the open space in front of the face (nose room) [22].

---

## 2. Camera moves: meaning, speed, chaining

| Move | Use it for | Duration / size [C unless noted] |
|---|---|---|
| Push-in (dolly forward) | tension, realisation, "this matters" [11] | 2-4 s, frame height shrinks 20-35 % |
| Pull-back / crane up | reveal of place or problem, isolation [11] | 1.5-3 s, frame height grows 2-4x |
| Track / follow | travel with a character, keeps viewer inside the action [11] | as long as the walk, camera lags 0.2-0.4 s |
| Pan / tilt | follow a head turn, show new information [11] | see speed rule below |
| Crane / drone | establishing, scale, grandeur [11] | 2.5-5 s, starts 25-60 studs high |
| Arc / orbit | intensify a still moment, hero beat [11] | 20-60 deg in 2-4 s, never more than 90 deg |
| Whip pan | energetic transition between places/times, hides a cut [10][11] | 6-10 frames, cut at the blur midpoint |
| Handheld / shake | shock, chaos, subjective panic [11][16] | see shake rule |
| Locked / hold | punchline, stillness, control [12][13] | 0.6-1.5 s after the punchline |
| Crash zoom (FOV) | comedic punch-in on a face or object | 3-5 frames, frame height / 1.5-2 |

- **Every move needs a motive**: a character walks or turns, a sound, a reveal the story needs. Unmotivated motion makes coverage restless and, if everything moves, nothing stands out [12]. Code: every move carries a tag (`follow`, `reveal`, `push`, `establish`, `orbit`, `transition`) and a target; reject moves without one.
- **Dolly, don't zoom:** push-ins move the camera (parallax = "being there"); FOV zooms are only for comic crash zooms [C].
- **Speed (rotation):** a pan should take >= 7 s to cross one frame width, otherwise it judders (RED, at 24 fps with motion blur) [14]. In 9:16 at vertical FOV 50 the frame is only 29 deg wide, so a smooth pan is <= ~4 deg/s [D]. Our frames have no motion blur, so: rotate either slower than that, or fast as a whip (> one frame width per 0.25 s, with blur). Mid-speed pure rotation strobes [14][C]. Prefer translation (track, drone) where the subject stays put in frame and only the background slides [C].
- **Easing:** linear starts and stops look robotic; real dollies and drones have mass [41]. Ease in and out over >= 8 frames, or 20-30 % of the move [41][C]. Use smoothstep/cubic, never linear keyframes.
- **Aim like a game camera:** keep the target in a dead zone (centre ~10 % of the frame), correct only when it leaves into the soft zone, with damping (time constant 0.2-0.4 s). Add lookahead of 0.3-0.5 s for walking characters so the lead room opens before they move [15] [C for numbers].
- **Shake:** drive it with smooth noise (Perlin), scaled by `trauma^2`; trauma decays to 0 in 0.3-0.6 s [16]. Shock: rotation 1-3 deg, position 0.05-0.2 studs, 8-15 Hz. Handheld idle: 0.2-0.5 deg, 0.5-1.5 Hz [C].
- **Slow motion:** 0.25-0.5x for 1-2 s at the peak of a fall, crash or reveal; rare (max once per video) [C].
- **One continuous route through a place (drone style, [M])**: place a "station" (framing + look-at target) for each narration sentence. Connect stations with a Catmull-Rom or Bezier path for position and a separately damped path for the look-at point. Speed never drops to zero between stations, only at the end of the route. Keep yaw changes <= 90 deg per sentence so the line is never crossed by surprise [C]. Let camera style escalate with the story, as Pixar did in Inside Out: calm, smooth moves while things are stable, chaotic handheld at the peak; open horizontal framing = freedom, tight vertical lines = trapped [17].
- **Cut vs. keep moving** [C, tuned to M]: keep the move while narration stays in the same place and the next subject is <= ~30 studs away (travel 1.5-3 s). Cut when the place or time changes (smash cut or whip), on a punchline or reveal, for a reaction of a different character, or when reaching the next framing would need > 90 deg yaw or a > 3x size change in under 1 s. Target mix: long drone moves of 3-6 s plus short cuts of 0.6-1.5 s (punch-ins, reactions, inserts) gives the measured median of 1.4-2.2 s.

---

## 3. Framing in 9:16 with numbers

**Safe areas (1080x1920).** TikTok's own in-feed template (scaled from 720x1280): top 240 px, bottom 660 px, left/right 120 px, plus a 180 px wide column on the right, 1080 px tall from the bottom, for the buttons [19]. YouTube Shorts estimates: bottom 380-670 px, right 120-190 px, top 180-290 px [20]. Common safe box: **x 120-900 px, y 240-1260 px** (centre at x 0.47, y 0.39 of the frame) [D].
- Faces, props that matter and captions stay in the safe box. Feet may sit in the bottom UI band [C].
- Caption band (one word, middle): about y 0.50-0.62. A face must not overlap it [M][C].
- Headroom: eyes on the upper third line (about 1/3 down from the top) [21]. For the medium close-up (H ~4.2) put the eyes at 0.30, which keeps the chin at 0.48, above the caption band. Close-ups and extreme close-ups (H < 3.5) always overlap a middle caption: use them only as short punch-ins (<= 1 s) or move the caption to y 0.65-0.72 for that shot [D].
- Subject off-centre against its look direction: face centre at x 0.38-0.42 when looking right, 0.52-0.56 when looking left (stays inside the safe box) [22][D].

**Character model (R6, approximate, measure your rig):** legs 0-2 studs, torso 2-4 (2 wide, 1 deep), arms make it 4 wide, head about 3.9-5.15 (1.25 tall and wide), eyes at ~4.65.

**Math [D].** Roblox `Camera.FieldOfView` is the vertical angle, 1-120 deg, default 70 [18]. In portrait the vertical axis is the long one.
- Frame height at the subject: `H = 2 * d * tan(FOV/2)`, so distance `d = H / (2 * tan(FOV/2))`. Frame width `W = 0.5625 * H`.
- Lens feel (full-frame equivalent, long side 36 mm vertical): `f ~ 18 mm / tan(FOV/2)`. FOV 70 ~ 26 mm (wide), 50 ~ 39 mm, 40 ~ 50 mm (normal), 30 ~ 67 mm, 25 ~ 81 mm (portrait), 20 ~ 102 mm.
- With eyes at 1/3 from the top: frame bottom = `4.65 - 0.667*H`, frame top = `4.65 + 0.333*H`. Chin screen position = `0.333 + 0.75/H`.
- Level camera (pitch 0, verticals stay straight), for mediums and closer shots: camera height `= 4.65 - 0.167*H`. That puts the camera at shoulder height for mediums, which StudioBinder calls the more cinematic choice over exact eye level [23].

| Size | Head share of frame height | H (studs) | What you see | FOV | Distance | Camera height |
|---|---|---|---|---|---|---|
| Extreme close-up | ~78 % | 1.6 | face fills frame, sides cropped | 25 | 3.6 | 4.4 |
| Close-up | ~45 % | 2.8 | head + upper chest, head fills 79 % of width | 30 | 5.2 | 4.2 |
| Medium close-up (= hits' "close-up", [M]) | ~30 % | 4.2 | to the belt | 35 | 6.7 | 3.9 |
| Medium | ~20 % | 6.3 | to the shins, almost full body | 40 | 8.7 | 3.6 |
| Full | ~12 % | 10 | whole body, feet at 0.80 from top | 45 | 12.1 | 3.0 |
| Wide | ~6 % | 20 | body = 26 % of height, place readable | 50 | 21.4 | 6-15, pitch -10 to -20 |
| Extreme wide / drone | ~2 % | 60 | town, characters as dots | 60 | 52 | 25-60, pitch -15 to -35 |

- Because R6 heads are a quarter of the body, a "medium" by head size already shows almost the whole body. Define sizes by head share, not by body cut [D][M].
- Same close-up at the default FOV 70: camera only 2.0 studs from the face, strong distortion and a busy background. **Never use FOV > 45 for MCU or tighter** [D][C].
- Recommended range: 25-35 for faces, 35-45 for mediums and two-shots (AnimSchool: no lens longer than 50 mm with two characters, i.e. FOV >= 40 [13]), 50-65 for wides and drone moves. Avoid > 70 [C].
- Angles: eye level = neutral, low (camera 1-2 studs, pitch +10..+20) = power, threat or scale, high (pitch -25..-45) = small, vulnerable, Dutch roll 8-15 deg = unease. Use Dutch angles rarely [23].

**Two characters in 9:16** [D]
- Front-facing side by side (4 studs each + 1 gap + margins = 10 studs wide) needs H ~ 17.8, head 7 %: that is a wide. Use only for whole-body comedy and geography.
- **Default two-shot = profile, facing each other**, roots 2.5-3 studs apart: about 4.5-5.2 studs wide, so H ~ 8-9.3, head 13-15 %.
- **Over-the-shoulder** for dialogue: camera 1.5-2.5 studs behind A, 0.8-1.2 studs to A's outer side; B framed as a medium close-up (H ~ 4.2); A's shoulder/head covers 20-35 % of the width at the frame edge. Both OTS angles stay on the same side of the line [3][40][C].
- **Depth stacking** suits the tall frame: near character lower and bigger, far character higher and smaller. Higher in the frame reads as higher status [40]. Do not stack two faces so that one sits in the caption band.
- During a back-and-forth exchange, hold the camera still and cut between speakers; moving during dialogue distracts [13].

---

## 4. Acting for blocky characters (no face animation)

- **Staging first:** every pose must make the idea "completely and unmistakably clear" [24]. One action at a time, and the important character moves while others hold.
- **Pose-to-pose:** 1-3 key poses per narration sentence, computed in-betweens with slow-in/slow-out, motion on arcs [24]. Hold each key pose 12-36 frames as a *moving hold* (it keeps drifting 1-3 deg, breathing), never a dead freeze [25] [C for numbers].
- **Anticipation -> action -> overshoot -> settle** [24][25]: anticipation 4-8 frames in the opposite direction, action 4-8 frames, overshoot 10-20 % past the pose for 2-4 frames, settle 6-12 frames [C]. Anything shorter than ~4 frames does not read [C, attributed to Williams].
- **Silhouette and line of action:** a pose has to read as a solid black shape [26]. Blocky arms in front of the torso vanish: lift them away from the body or show the pose in 3/4 or profile view. Lean the torso 5-15 deg along the intent (forward = interest/anger, back = shock/fear), head tilt 10-20 deg for emotion [26][C].
- **Reactions:** real visual reaction time is ~0.21-0.23 s [27], so a natural reaction starts **6-8 frames** after the event. Order: head snaps first (3-4 frames), torso follows 3-6 frames later, feet last (overlapping action) [24][C]. A double take (look, look away, snap back with a jolt) lives on timing [28]: first glance, 12-20 frames looking away, snap back in 3-4 frames, hold 15-30 frames [C]. A delayed realisation can wait 0.5-1.5 s, but keep a moving hold so it does not look broken [C].
- **Comic timing:** setup in a wide or full shot so the whole body is seen. Pause 0.3-0.6 s before the payoff, then hold >= 1 s after it [7][29][C]. Things entering or leaving the frame in a funny way are a strong visual-comedy tool [30].
- **Since faces cannot act:** emotion goes into body angle, head angle, arm height and timing. Use decal swaps for the face only on key beats, at most 1 per shot [C].
- **Background characters:** idle loops with random phase and ~50 % of the hero's amplitude; no "twins" (identical poses or timing) [24]. At most 1-2 visibly moving *random* extras in frame; they freeze or slow down during the hero's key pose and punchline; they never look into the camera unless it is the joke [C][M: in a test, random extras and bustle made a version worse]. The people who belong to the place (customers, coworkers) are different: they keep doing the place's activity calmly in the background [M].

---

## 5. Light and colour

- **Plan a colour script:** a strip of small images, one per story beat, showing the colour arc of the whole film [31]. In Finding Nemo the colours get muted on dark beats and brighter on happy ones [31]. Code: every beat carries a mood preset; light changes tween over 1-2 s inside a shot, never flicker across a cut [C].
- **Key/fill/rim:** key light 30-45 deg off the camera axis and 30-45 deg high; fill on the other side; rim from behind for separation [32][C]. Key-to-fill ratio near 1:1-2:1 = high key (comedy, normal day), around 8:1 = low key (drama, mystery) [32].
- **Motivated light:** each light needs a believable source in the scene (sun, street lamp, window, TV, fire) [33].
- **Value separation:** character and background must differ in brightness. Fix this before adding lights, and check it with a squint test [35]. A rim only works against a darker background [35]. Code: mean luminance of the character mask vs. a ring around it should differ by >= 1.3:1 [C].
- **Phone:** grade for the phone, not the desktop. Dark moody grades turn muddy on small screens, and clarity beats mood [36]. Night shots still need mean luma >= 0.15 and faces >= 0.35 [C].
- **Saturation:** 0.45-0.75 is fine inside one colour world per place; shrill comes from many competing hues and neon [M]. Measure rendered frames and adjust `ColorCorrection.Saturation` in steps of 0.05. In a Roblox test, ColorCorrection saturation 0.4 under warm light made all shadow sides clip to pure red, 0.2 kept them orange. Backlight under a warm sun turned everything uniformly red [M].

**Roblox starting values** (Lighting, Atmosphere, ColorCorrection CC, Bloom). Property meanings: [34]. Engine defaults: OutdoorAmbient 127,127,127; ShadowSoftness 0.2; ExposureCompensation 0 (range -5..5) [34]. All preset numbers below are **[C] starting points**, check them with test renders:

| Mood | Light | Atmosphere | CC / Bloom |
|---|---|---|---|
| Normal day: neutral, comedy, exposition | ClockTime 14, Brightness 2.5-3, Ambient 70,70,80, OutdoorAmbient 128,128,140 | Density 0.30, Offset 0.25, Haze 0.5, Color 200,215,235 | Sat 0.10, Contrast 0.10 / 0.4, 24, 1.5 |
| Golden hour: cosy, nostalgic, happy end [33] | ClockTime 17.3-17.8, Brightness 2.5, Ambient 90,60,45, OutdoorAmbient 150,110,85, ColorShift_Top 255,180,110, sun from the side | Density 0.35, Offset 0.1, Haze 1.5, Glare 0.5, Color 255,200,150, Decay 120,90,120 | Tint 255,235,215, Sat 0.15, Contrast 0.15 / 0.6, 28, 1.0 |
| Blue hour: calm, melancholy, "before it happened" [33] | ClockTime 18.6-19.0, Brightness 1.5, Ambient 50,55,80, OutdoorAmbient 80,90,130; warm windows/lamps 255,180,110 | Density 0.35, Haze 1, Color 120,140,190, Decay 60,50,90 | Tint 225,232,255, Sat 0, Contrast 0.15 / 0.5, 24, 1.2 |
| Night mystery | ClockTime 0-2, Brightness 0.5-1, Ambient 20,22,35, OutdoorAmbient 35,40,60; key light only from lamps (Range 30-40) | Density 0.45, Offset 0, Haze 2, Color 60,70,110 | Tint 210,220,255, Sat -0.1, Contrast 0.2 / 0.5, 24, 1.0 |
| Overcast: sad, tense | ClockTime 13, Brightness 1.2, ShadowSoftness 0.8, Ambient 110,110,115 | Density 0.45, Haze 2.5, Color 180,185,190 | Tint 235,240,245, Sat -0.3, Contrast -0.05 / off |
| Danger / climax | red-orange practicals (fire, alarm) pulsing 1-2 Hz, ratio ~8:1 | Density 0.4, Haze 1.5, Color 255,150,110 | Contrast 0.3, Sat 0.1, Tint 255,225,215 / 0.8, 24, 0.9 |

---

## 6. Amateur mistakes and automatic checks

| Mistake | Automatic check |
|---|---|
| Default FOV 70 for everything, distorted faces | flag FOV > 45 when head share > 25 % |
| Jump cuts (same size, same angle) [4][7] | consecutive shots: angle < 30 deg and size ratio < 1.5 |
| Crossing the line [3] | side sign of each camera vs. the scene's action line changes without a move, neutral shot or insert |
| Restless, unmotivated moves [12] | moves without a tag/target; direction reversal within 1 s |
| Robotic starts and stops [41] | acceleration spike > 3x the median at keyframes |
| Strobing pans [14] | rotation-only moves between 1 frame width per 0.25 s and per 7 s |
| Cutting too soon after a punchline [7] | cut < 30 frames after a line tagged `punch` |
| Long static stretches [M] | frame-difference ~0 for > 3 s |
| No visual change per sentence [37][M] | sentence without a cut, move phase or pose change |
| Face under the caption or UI [19] | projected head box outside the safe box or overlapping the caption band |
| Reaction too early or too late [27] | reaction key < 6 or > 20 frames after the event (unless tagged `delayed`) |
| Twin extras, busy background [24][M] | identical animation phase; > 2 random extras moving in frame during a `punch` |
| Character merges with background [35] | mask/ring luminance ratio < 1.3 |
| Garish or too dark [36][M] | many competing hues / neon, or > 2 % clipped pixels; mean luma < 0.12, face < 0.30 |
| Occluded face, camera inside walls | raycast camera to head: > 20 % blocked; camera inside a part |
| Tilted horizon on neutral shots | roll not 0 on shots not tagged `angle` (pitch is fine: the player camera looks down) |
| Missing establishing shot [1] | first 2 s in a new place without a frame where head share < 8 % |

---

## Sources

1. StudioBinder, shot sizes: https://www.studiobinder.com/blog/types-of-camera-shot-sizes-in-film/
2. LearnAboutFilm, shot size and sequences: https://learnaboutfilm.com/film-language/picture/shotsize/
3. StudioBinder, 180-degree rule: https://www.studiobinder.com/blog/what-is-the-180-degree-rule/
4. 30-degree rule (with Murch example): https://en.wikipedia.org/wiki/30-degree_rule
5. No Film School, Murch's Rule of Six: https://nofilmschool.com/2016/11/6-rules-good-cutting-according-oscar-winning-editor-walter-murch
6. No Film School, eye-trace in fast-paced editing: https://nofilmschool.com/2018/08/editing-eye-trace-mind-rule-six-incorrect
7. No Film School, 8 common editing mistakes: https://nofilmschool.com/eight-common-editing-mistakes
8. No Film School, J and L cuts: https://nofilmschool.com/2017/10/editing-101-what-are-j-and-l-cuts-and-why-should-you-be-using-them
9. Match on action: https://howtofilmschool.com/dictionary/match-on-action/ (straight cuts vs. overlap: 2023 study in Psychology of Aesthetics, Creativity & the Arts, seen only as a summary)
10. StudioBinder, match cuts: https://www.studiobinder.com/blog/match-cuts/ ; whip pan, smash cut: https://academy.wedio.com/types-of-transitions-in-film
11. StudioBinder, camera movements: https://www.studiobinder.com/blog/different-types-of-camera-movements-in-film/
12. Motivated camera movement: https://howtofilmschool.com/dictionary/motivated-camera-movement/ ; https://nofilmschool.com/2018/06/key-good-camera-movement-motivation
13. AnimSchool, camera tips for film and games: https://blog.animschool.edu/2025/02/07/camera-tips-for-games-and-films/
14. RED, panning speed (7-second rule): https://www.red.com/red-101/camera-panning-speed
15. Unity Cinemachine composer (dead/soft zone, damping, lookahead): https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/manual/CinemachineRotationComposer.html ; https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/manual/CinemachinePositionComposer.html
16. Eiserloh, "Juicing Your Cameras With Math", GDC 2016: https://gdcvault.com/play/1023146/Math-for-Game-Programmers-Juicing
17. Patrick Lin (Pixar), camera structure in Inside Out: https://www.pluralsight.com/resources/blog/software-development/camera-structure-language-within-inside
18. Roblox Camera API: https://create.roblox.com/docs/reference/engine/classes/Camera
19. TikTok safe zones from TikTok's in-feed template: https://www.manypixels.co/blog/social-media-design/tiktok-ad-specs
20. YouTube Shorts safe zone estimates (third party, no official spec): https://www.clipspeed.ai/blog/youtube-shorts-size.html
21. Headroom, eyes on the upper third: https://human.libretexts.org/Courses/City_College_of_San_Francisco/Video_Production_Handbook_I/08:_Video_Aesthetics/8.05:_Video_Composition
22. Nose room / lead room: https://howtofilmschool.com/dictionary/nose-room-lead-room/
23. StudioBinder, camera angles: https://www.studiobinder.com/blog/types-of-camera-shot-angles-in-film/
24. Twelve principles of animation (Thomas and Johnston): https://en.wikipedia.org/wiki/Twelve_basic_principles_of_animation
25. Animation Mentor, the moving hold: https://animationmentor.com/blog/why-all-animators-need-to-master-the-moving-hold
26. AnimSchool, line of action: https://blog.animschool.edu/tag/line-of-action/
27. Woods et al. 2015, simple visual reaction time (231 ms, 213 ms corrected): https://www.frontiersin.org/journals/human-neuroscience/articles/10.3389/fnhum.2015.00131/full
28. Double take: https://en.wikipedia.org/wiki/Double-take_(comedy)
29. "Comedy in long shot" (origin of the quote): https://quoteinvestigator.com/2017/02/05/comedy/
30. Every Frame a Painting, "How to Do Visual Comedy" (transcript): https://gotranscript.com/public/exploring-edgar-wrights-visual-comedy-a-masterclass-in-filmmaking
31. Pixar colour scripts: https://www-3.collection.cooperhewitt.org/exhibitions/102147315/text ; https://hyperallergic.com/610771/the-art-of-pixar-chronicle-books/
32. Lighting ratio, high key vs. low key: https://howtofilmschool.com/dictionary/lighting-ratio/ ; https://soundstripe.com/blogs/low-key-lighting
33. StudioBinder, golden hour: https://www.studiobinder.com/blog/when-is-golden-hour ; motivated light: https://fiveable.me/cinematography/unit-7/natural-vs-artificial-lighting/study-guide/OwLC2wdGrJBiTDh4
34. Roblox Lighting, Atmosphere, ColorCorrection, Bloom: https://create.roblox.com/docs/reference/engine/classes/Lighting ; https://create.roblox.com/docs/environment/atmosphere ; https://create.roblox.com/docs/reference/engine/classes/ColorCorrectionEffect ; https://create.roblox.com/docs/reference/engine/classes/BloomEffect
35. Readable lighting for animation (value separation, squint test): https://cursa.app/en/page/blender-basics-for-animation-lights-for-readable-animation-and-simple-materials
36. Grading short-form for phones (vendor blog): https://spliceapp.com/blog/aviation-b-roll-color-grading-checklist-for-youtube-shorts/
37. Pattern interrupts every 2-3 s (vendor blogs, unverified data): https://joyspace.ai/pattern-interrupt-reset-attention-span ; https://www.opus.pro/blog/ideal-youtube-shorts-length-format-retention
38. Reaction shots: https://www.backstage.com/magazine/article/reaction-shot-explained-77723/
39. Insert shots: https://www.premiumbeat.com/blog/insert-shots-for-film-and-video/
40. Vertical two-shot / OTS (vendor page): https://morphic.com/resources/shots/vertical-two-shot ; https://morphic.com/resources/shots/over-the-shoulder-vertical
41. Easing camera moves: https://docs.toonboom.com/help/storyboard-pro-20/storyboard/camera/add-ease.html ; https://www.studiomatrx.org/students/architectural-visualization-rendering/camera-paths-and-walkthroughs
