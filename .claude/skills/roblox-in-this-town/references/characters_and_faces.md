# Characters and faces: how to make them for each user

Every user gets their own cast. Build it with them; never reuse another channel's characters.

## 1. Building a character
- Default: Roblox's **R6** body (6 blocks): the classic look of the genre, simple to pose, and Roblox's own R6 animations fit it.
  R15 (bendable elbows and knees) is possible, but needs its own rest-pose table and animation ids; the pose code in this skill assumes R6.
  Dress it by code like the avatar editor: a `HumanoidDescription` (skin colours, classic `Shirt`/`Pants` ids, accessory id strings for
  `HairAccessory`, `HatAccessory`, `FaceAccessory`, `NeckAccessory`, `BackAccessory`, ...), then
  `Players:CreateHumanoidModelFromDescription(desc, Enum.HumanoidRigType.R6)`. Remove the generated `Animate` script; keep the `Animator`.
- Find items with the public catalog search (`catalog.roblox.com/v1/search/items/details?Category=...&Keyword=...`) and a thumbnail sheet.
  Pick by looking: check every shirt thumbnail for text and wrong cuts.
- **R6 silently drops** layered clothing, "3.0" items and many newer hair items (rigid accessories work). After building, count the accessories against what you asked
  for; replace missing ones with rigid items or classic shirts. Search with a short delay between requests (the API rate-limits with HTTP 429).
- Wrong hair or hat colour: dye it in code (clear the mesh texture, set the part colour).
- Prefer items made by Roblox itself where they fit (famous and safe in videos); other creators keep the rights to their items.
- Do not load other players' avatars, and do not use Toolbox characters (hidden scripts, someone else's look).

## 2. The cast system
- **A recurring hero** (the default; the hits have one, an anthology channel may not): chosen once by the user from 2-3 options you build and
  show as a sheet (whole figure + head portrait, in a real place). Save the choice (e.g. `my_cast.json`) and reuse it in every video. Signature look: one colour, one emblem or one iconic piece.
  On R6 only hair, face and colours tell gender: short hair or a cap reads male; long hair or a ponytail plus the female face variant
  (small lashes, finer brows) reads female. Check it on the cast sheet: a test hero with soft features and no cap was read as a woman.
- **Colours that feel fun, not shrill:** every main character owns one strong, saturated colour (a red cap, a yellow hoodie, a green jacket),
  different from the other main characters and from the colour world of the place, so each is found at a glance on a phone. Side characters
  and the people of a place wear calmer tones. Vary skin tones. Tested default: no neon, no pattern mixes (they read shrill on a phone), no shirts with text (unreadable, and often
  someone else's design). Judge colours on the cast sheet
  in the place's real light: a colour that pops by day can turn muddy at night.
- **Side characters** read their role from one piece (chef hat, police cap, top hat with sash, party hat, nightcap and glasses).
- **Archetypes**: give every character an attitude and let its default face show it (bored, smug, calm grandma smile, blank dad stare);
  plain clothes in 1-2 colours, exactly one detail that gives the type away: exaggerated in attitude, minimal in clutter.
- Current avatar fashion (messy hair, plaid shirts, hoodies, headphones) makes characters feel like real players.
- Keep the face free: the drawn face carries all the acting, so bangs over the eyes, a moustache accessory or glasses hide it.
  Draw glasses or a moustache into the face texture instead.
- 1 hero plus 1-2 partners most of the time; side characters return instead of new faces. Besides them, every place has its own people
  (customers, coworkers, passers-by): they are part of the place, not new story characters (`world_and_light.md` section 3).

## 3. Faces: draw your own set
Roblox moved its classic faces to 3D heads in March 2026; classic face ids are no longer reliable. Generate a face set by code (Python + Pillow):
- 1024 x 1024 PNG, transparent, features inside the middle ~70 % (the head shows about that), eyes at ~40-45 % height, mouth at ~62-68 %.
- Tested default: simple and readable - solid dot or oval eyes with a tiny highlight, strong brows, simple mouth lines; expression from brows and mouth.
  Other styles (exaggerated meme faces, anime eyes, a classic smiley look) follow the same technical rules below.
- About 25-30 expressions: neutral, talk_a/b/c (only the mouth changes, for lip sync), blink, smile, grin, laugh, happy, smug, side_eye, bored,
  worried, sad, cry, angry, furious, shocked, scared, surprised, suspicious, determined, nervous, sleepy, evil, confused, embarrassed, love,
  dead. A male and a female variant (small lashes, finer brows). Optional: a few exaggerated meme faces for rare punches.
- Draw thick strokes as filled polygons, not wide lines (wide lines get jagged edges); check every face at phone size (~96 px) before using it.
- Make expressions bigger than life: a blocky head has no other way to act. Useful extras: eye size changes (tiny pupils for shock, huge
  eyes for love), a sweat drop, blush marks, a tear streak, sharp brows for a villain, heavy lids for a tired character.
- Give each main character one face of their own that fits their attitude (smug half smile, permanent bored stare), not only the shared set.
- Meme energy is welcome, copies are not: draw your own version of a kind of expression, never a known meme image or another creator's face.
- Match the user's style: if they want another look, change the drawing rules, not the system.

## 4. Showing faces sharp in Studio
- Face decals render coarsely in close-ups. Show the face as an image on a **SurfaceGui** (`PixelsPerStud` ~400) on an invisible thin part
  0.62 studs in front of the head, joined with a classic `Weld` (a `WeldConstraint` showed up as a glowing green square in Studio captures in the author's setup).
  Hide the original decal.
- No upload needed for videos: copy the PNGs into Studio's own content folder (`<Roblox Studio install>/content/textures/<folder>/`) and use
  `rbxasset://textures/<folder>/<name>.png`. Studio updates install into a new folder: copy again after each update. (Uploading images to
  Roblox runs through the user's account and moderation: only with their consent, and never with other people's images.)
- Preload all face textures before rendering and render one warm-up frame: a swapped texture can appear one capture late.

## 5. Face dosing
- A calm talking face most of the time; blinks; mouth shapes switch every ~0.12 s on spoken lines.
- Shock at most about twice per video; "traumatized" stays comic. Big expressions only at turning points.
- Faces switch on the beat word; characters near an event react 6-8 frames after it, head first, then body.
