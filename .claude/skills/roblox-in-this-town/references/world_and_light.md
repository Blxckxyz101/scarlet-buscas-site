# Places, light and colour: how to build them

## 1. Where the look comes from
- Default look: places that look like real Roblox games, built from free **Creator Store** models (modular buildings, shops, interiors,
  furniture, realistic trees, vehicles, street props). Weak videos and the author's first tests: self-made pastel blocks read as a toy world; big ready-made whole maps look
  like boxes up close. A deliberately different world (retro, one colour, horror) is the user's choice: keep it consistent and judge it at phone size.
- Find models through the public store search API (`apis.roblox.com/toolbox-service/v2/assets:search?searchCategoryType=Model&query=...`):
  it returns votes, script count and triangle count. Make a preview sheet of the thumbnails (`thumbnails.roblox.com/v1/assets?...`) and pick by eye.
  Prefer well-voted models; a high triangle count is fine for videos.
- Load a model in Studio with `game:GetObjects("rbxassetid://<id>")`. **Strip everything executable before use**: every `LuaSourceContainer`,
  `ClickDetector`, `ProximityPrompt`, `Sound`, `Remote*`, `Bindable*`, `Tool` (one cafe model carried 50 scripts). Anchor all parts. Keep loaded
  models in `ServerStorage` and clone pieces into the scene.
- A story needs 2-5 places, revisited from new angles. Typical: a main street, a home interior, a school or workplace, a shop or cafe, one special
  place for the twist.

## 2. Building a place (do it as code, so it can be rebuilt)
- One builder function per kind of place (`build_street`, `build_room(kind)`, ...) that creates everything under one folder and can run again.
- Put walls and solid buildings into a sub-folder (e.g. `Buildings`): the camera's collision check only needs those. Furniture and props in another.
- Interiors: build them as a film set with one open side (no fourth wall) where the cameras stand; real materials (wood planks, fabric,
  plaster); windows with light coming in (day) or dark blue (night); a warm practical lamp; a floor apron in front of the open side so wide shots
  do not show the void. Put an invisible blocker in window openings so camera checks do not slip through.
- Export **named anchors** for every spot the story uses (cafe_front, bed, desk, door, seat1 ...), so the plan says "Hero at bed_side" and not coordinates.
- Ground height comes from a downward raycast at the spot, not from one constant per place: roads sit lower than sidewalks, and characters
  placed with the sidewalk height floated over the road.
- After building, take 3-4 stills from where cameras will stand before planning anything.

## 3. Life and story in the place
- **Every place has its people** (unless emptiness is the story: then show it on purpose). Before planning shots, write down who belongs in each place and what they do there: customers in a queue
  and at tables, coworkers behind the counter, kids in the cafeteria, people waiting at the bus stop. Stage them in depth (foreground,
  middle, background) so the base camera always sees some of them. Target: two or more people in the picture 40-60 % of the time.
  "More is not better" is about random people and busy effects, never about the people who belong to a place: a burger restaurant without a
  single customer for 15 seconds reads as a dead set.
- Each of them does the place's activity in a loop (eats, waits and looks around, carries, works); one or two come and go (someone leaves
  with a bag). They never cheer, dance or run into the lens, react to the event together (head first, 0.25 s after it, a little staggered),
  and calm down during the punchline. Streets: walkers and 1-2 cars on top of the people who belong to the spot.
- A walker on a fixed lane can walk straight through a story character: check every lane against the story characters' marks.
- **Crowds** ("a thousand people"): clone the extras you already built (no animation, joints reset), place them in rows or groups, and switch
  the whole crowd between a few states on the beats (queue, eating, cheering, working): face, pose and a prop per state, all as a function of time.
  Around a hundred clones render fine.
- **Story props are code too:** build them in a dressing step per story (burgers on the counter, a menu board, shelves in a freezer) and
  attach hand props (phone, broom, ice cream, hat) to the joints every frame after posing (a joint change moves the limb at once).
- Props that tell the story (a counter full of burgers, a pizza box, party bunting), not random clutter.
- Text in the world: signs, calendars, clocks, counters, phone screens (SurfaceGui with `LightInfluence = 0`).
- Before placing cameras, check trees, lamp posts, awnings and doors near the camera path; hide a set piece for one shot like on a film set.
  Make this a standard step: move street trees, newspaper stands and similar pieces near the action into an archive folder (not deleted).
  Trees on the sidewalk covered every high wide shot of a test, and a camera move passed straight through a newspaper stand.
- Generic room builders place furniture where the main camera axis wants to be (a dining table right in front of the counter); shop shelves full
  of books do not fit a restaurant. Look at the room from the camera side and move what is in the way.
- Builders that place new rooms at "next free position" by counting existing ones collide after a place was deleted: give rooms explicit positions.

## 4. Light per mood (one preset per place, change only on a story turn)
| Mood | When | Starting values (check with a test frame) |
|---|---|---|
| Day | normal life, comedy | ClockTime 13-15, Brightness ~3.5, sun high enough that streets are lit (low sun puts streets in house shadows), ShadowSoftness ~0.3, light haze |
| Golden hour | cosy, nostalgic, happy end | ClockTime ~17.5, warm ambient, sun from the side, more haze, warm tint |
| Blue hour | calm, melancholy, "before it happened" | ClockTime ~18.8, cool ambient, warm windows and lamps |
| Night | mystery, horror | ClockTime 0-2, low ambient, light only from lamps and windows; faces still readable (add a soft fill light near the camera) |
| Cold room | freezer, ice, hospital | interior ambient plus a cold lamp and a soft fill near the camera (night ambient plus a cold lamp left faces unreadable) |
| Warm interior | home, secrets | interior ambient, practical lamps as key light |
| Danger | twist, climax | red-orange practicals pulsing 1-2 Hz, higher contrast, or a full-frame red tint for 1-3 s |

- **Faces must stay readable in every mood.** Real night light left faces almost black in a test; blue hour plus a soft fill light worked.
  The fill: a `PointLight` (`Shadows = false`, Range ~16, Brightness ~1, slightly cool white) on an invisible part placed every frame a few
  studs in front of that frame's camera, towards the subject. It lights what the camera sees and nothing else. Use it at night, in dark rooms
  and in cold rooms.
- A night room in a place file where the outside is day: windows show the global daytime sky. Cover them with dark panes (city lights as a
  few small neon dots), switch off daylight spots, and keep shiny dark objects at low `Reflectance` (~0.04): a black ball at 0.22 mirrored
  the blue sky and read as blue.
- Use Lighting's realistic style with priority on quality; capture at Studio edit quality level 21.
- **No depth of field and no blur anywhere** (Lighting or camera): it blurs characters near the camera and switches anti-aliasing off.
  If the user wants a soft background, it has to come from post-processing outside Studio.
  When applying a preset, switch off **every** post effect that is not part of the preset (other tools and plugins leave theirs behind),
  keep exactly one Atmosphere, and check this before every render.
- Colour: the overall look is the user's choice (`styles.md`, colour look). Inside it, one colour world per place (warm red-orange, cold blue, green-gold); saturation 0.45-0.75 inside it is fine. A neon world is a look of its own; neon mixed with pastels reads shrill.
