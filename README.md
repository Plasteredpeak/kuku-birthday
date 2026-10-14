# kuku-birthday

A small, grumpy, phone-first website for **Samiya's 22nd birthday (15 October 2026)**, made by Ali.
Kuku, an angry cat sticker, guides her through seven levels, comments on everything and changes mood as she goes. There are 17 hidden easter eggs to find.

- **Live:** https://plasteredpeak.github.io/kuku-birthday/
- **Opens at:** 00:00 on 15 Oct, Pakistan time (PKT, UTC+5). That's 20:00 on 14 Oct in Ireland (IST, UTC+1). Before then, the site shows only the countdown.
- **Built for:** Samsung Galaxy S25 (Chrome or Samsung Internet), portrait. It works on any phone and on desktop too.

---

## Testing links

| URL | What it does |
|---|---|
| `/kuku-birthday/` | The real thing. Loader, then the countdown until 12 PKT, then the "Open your surprise" button. |
| `/kuku-birthday/?ali` | Skips the countdown: the reveal button shows straight away. |
| `/kuku-birthday/?ali&wait&reset` | Fakes a 20-second countdown so you can watch the reveal happen, from a fresh start. |
| `/kuku-birthday/?ali&reset` | Skips the countdown and wipes saved progress (levels, eggs, pets, Wordle). |
| `/kuku-birthday/?ali&all` | Unlocks every level at once (all 9), to jump straight to any section. |

Progress is saved in the browser (localStorage), so if she closes the tab she'll pick up where she left off. **Before sending the link, open it once with `?reset`** on your own phone, so your test progress doesn't confuse you later.

---

## How it opens

1. **Loader.** Kuku in the middle with every other sticker orbiting her as the site loads. Loading lines cycle underneath ("calibrating sarcasm", "removing Ali's excuses", "buying a Cinnabon"…). When it reaches 100%, the stickers collapse into Kuku and **Tap to open** appears. **The button runs away from her first 4 taps**, jumping to a random spot each time ("nope." → "too slow." → "almost. no." → "ok ok. last one. probably."), then turns into **Fine. Open it** and works on the 5th tap. That tap is also what lets the music start, since phones block sound until a tap.
2. **Kuku's intro screen (first visit only).** A separate full-screen page before the timer: a big Kuku sticker that changes mood with each line, a speech card that types out, progress dots and "tap anywhere" to go on. It's kept apart from the corner Kuku so it doesn't get mixed up with her reactions.
   - angry: "hi. i'm Kuku."
   - eyes: "Kuku is ME. the angry cat. not you."
   - flower: "you're Samiya. the birthday one."
   - angry: "i'm the mascot of this website. being angry is my whole personality."
   - buff: "i'll be in the corner the whole time. tap me and i'll react. badly."
   - sleep: "right now my job is guarding your surprise until 12. Pakistani 12. come wait with me." (or yay: "and it's already 12. so. let's go." if it's past 12)

   Then **ok Kuku. show me the timer**.
3. **Countdown.** A full-screen timer (hours, minutes, seconds) over animated backgrounds that change every 25 seconds, each with its own music track:
   - the cave: glowing fireflies drifting up under stalactites (cave music)
   - the night sky: twinkling stars and shooting stars (soft piano)
   - petals: pink petals falling (anime music)
   - kuku clouds: faded stickers floating up (Wordle loop)
   - aurora: drifting green, blue and pink light (music-box waltz)

   **Tapping Kuku before 12** doesn't count towards the 15 pets. She goes through: "don't get hasty. wait." → "have some patience." → "it's not 12 yet." → "asking won't make it faster." → "you've been asking him for an hour. he told me." → "Pakistani 12. look at the clock." → "tap tap tap. no." → "patience. you've heard of it?" → "i'm getting sleepy from all this waiting…". Then she **falls asleep** ("wake me at 12. (don't.)"). Tapping her while asleep cycles: "it's not time yet. don't wake me up." / "zzz… still not 12…" / "five more minutes…" / "DON'T wake me up." / "zzz… cinnabon… zzz". She also falls asleep after 45 seconds of no taps. Long-pressing her before 12 gets "no picking me up until 12." At 12 she wakes up yelling "I'M AWAKE. it's 12. press it. PRESS IT." and **stays on the yay sticker until Samiya presses the button**. Tapping her then just gets "the BUTTON. not me. PRESS IT." and she won't fall asleep again.

   Tapping the scene name at the bottom skips to the next scene. Teaser lines rotate under the timer. Only Kuku (she can be petted) and the sound button are visible. Nothing else on the site shows, and easter eggs can't be collected yet.
4. **Reveal.** At 00:00:00 the heading changes to "It's 12. Your 12.", confetti fires and an **Open your surprise** button appears. Tapping it zooms and flashes white, then the site opens with confetti, a cat rain and Kuku saying "happy birthday noob. it's 12. YOUR 12."

After the first reveal, later visits go loader, then straight into the site where she left off.

## The levels

Each level unlocks the next one. Every level has its own music track.

| # | Level | What happens | Music |
|---|---|---|---|
| 0 | **Gate** | Ireland, Pakistan and a fake "GST" clock. Countdown until 12 PKT, then the question "Merey 12 ya apkay 12?" "My 12, obviously" continues. | Music-box waltz with a ticking clock |
| 1 | **Wordle** | Birthday Wordle. The answer is **DUMBO**. Six tries, a real keyboard and a "Copy my result" button. **If she fails**, the answer is NOT revealed. Kuku cries, a crying-cat popup shames her and a **Reset and try again (shameful)** button appears (plus "Give up and keep going"). The shame escalates: fail 1 "Six guesses. Five letters. Zero brain cells." / "kuku is embarrassed to be seen with you."; fail 2 "Twice. TWICE." / "i am telling ali."; fail 3+ "It starts with D. It ends with O. It is you." | Light plucky loop |
| 2 | **The cave** | "The cave of things you made me do." Tap 5 lanterns to light them, each showing a real quote from the chat (the first is "play hollow knight"). Then "Rest at the bench". | Dark cave ambience with bells (the Hollow Knight-feeling one) |
| 3 | **Anime corner** | **Saiki K.:** tap Ψ to read her mind (her real chat lines). **Black Butler:** lift the cover to find her birthday mithai, a bowl of gulab jamun in syrup ("Gulab jamun, my lady. Warm, in syrup…", then "Yes, my lady"). **Take My Brother Away:** eat a chocolate bar before the brother steals it. | Upbeat anime-opening feel |
| 4 | **Gym arc** | Her 23 Sep gym trip ("omw back to home… gym", holding a Cinnabon). Tap **Curl** 22 times (one per year) while buff Kuku squashes and Kuku coaches ("What's the point of gym – Ali, 23 Sep"). At 22, a Cinnabon appears: **Eat it** ("You ate half. 'I didnt eat it pura.' Respect.") or **Resist** ("Character development. Kuku ate it instead."). | Training montage: kick drum and punchy bells |
| 5 | **Cake** | 22 candles. "Blow out the candles" uses the mic, so she blows into the phone. "My mic is shy" lets her tap each candle instead. | Happy Birthday on a music box |
| 6 | **Timeline** | 2024 (almost a day late), 2025 (on time, "Ur big 16"), 2026 (on time plus a website). | Soft piano |
| 7 | **Wrapped** | "Samiya × Ali: Wrapped", a story-style quiz from the real chat export (16 Jun 2024 → 14 Oct 2026). Cards: intro → 7,465 messages → who texts more (3,943 vs 3,522; she texted first on 127 of 196 days) → voice notes (144 vs 8) → emojis (😭 ×122 vs 😂 ×27) → insults (~60 Ali vs ~35 her, with breakdowns) → "idk" trick question (26 = 26, always correct) → toilet announcements (3 / 7 / **12**) → score /6 with summary, **Copy my Wrapped**, **Play again** (if under 6/6) and **Open the letter**. Bars count up from 0, ✓/✗ on her pick, Kuku goes yay/crying with a short aside. Answers and position are saved. | Bright "year in review" synth-pop |
| 8 | **Letter** | Ali's letter with the translation guide, then the "Get lost" button, then the finale with her easter-egg score and hints for the ones she missed. | Soft piano |

---

## All 19 easter eggs

Each one shows a yellow toast ("Easter egg n/19"), plays a jingle, buzzes the phone and adds to the counter in the top right. At the end, she sees which ones she found and gets a hint for each one she missed.

| # | Egg (id) | How to get it | What happens | Hint shown at the end |
|---|---|---|---|---|
| 1 | GST clock (`gst`) | Tap the **GST** clock on the gate | Kuku: "I DONT HAVE GST CLOCK" (her own line), crying Kuku | A clock that does not exist. |
| 2 | Ali's 12 (`ali12`) | On the gate, tap **"Ali's 12"** | Screen shakes, angry chibi Samiya pops up: "you, every time he is late". Kuku: "that's 4 hours late. as usual 😭" | The wrong answer at the start. |
| 3 | Batman (`batman`) | Two places: on the first screen after the reveal, tap the **"Ali (Ireland)" clock box 3 times quickly**. Or tap the **"– Ali" signature** at the very bottom of the letter. | Batman cat with a bass riff: "I'm Batman. – Ali Hamza, a.k.a. pp" | Poke Ali's clock. Or his name. |
| 4 | HAMZA (`hamza`) | Guess **HAMZA** in the Wordle | Kuku: "why is HE in your head. on your birthday." | Guess a name in the Wordle. |
| 5 | Pick up Kuku (`hold`) | **Long-press Kuku** (hold about 1 second) | Buff Kuku: "put me DOWN. i go to the gym." | Don't just tap Kuku. Hold. |
| 6 | Rude cat (`sign`) | Every 12 to 26 seconds after the reveal, a rude cat slides in from the **left or right** edge (never mirrored, so the signs are always readable) at a random height for about 4.5 seconds: **"ur short"**, **"UR GAY."** or the **middle-finger cat**. **Tap one** before it leaves. They keep coming after the egg is found. | Hiss, crying Kuku. "rude. accurate though." / "kuku did not write that sign." / "KUKU. language. (that was not kuku)" | Rude cats keep peeking in from the sides. Tap one. |
| 7 | Shake (`shake`) | **Shake the phone** | It rains cat stickers. Kuku: "it is raining kukus. happy now?" | Shake things up. |
| 8 | Title (`title`) | Tap **"samiya's 22nd"** (top left) **5 times quickly** | Kuku: "stop poking things. you're 22." | Poke the top-left corner. |
| 9 | Birth time (`born`) | Have the site open **between 1:30 and 1:59pm Pakistan time** (she was born at 1:30pm) | Kuku: "1:30pm. you were born now-ish. I remember things. sometimes." | Come back at the time you were born. |
| 10 | Sideways (`turn`) | **Turn the phone to landscape** | Full-screen nag: "Phone seedha karo. This is a portrait birthday." | Hold your phone the wrong way. |
| 11 | Bench (`bench`) | Light all 5 lanterns in the cave, then tap **"Rest at the bench"** (everyone gets this one) | Sleepy Kuku: "progress saved. unlike your sleep schedule." | Sit down somewhere. |
| 12 | Mind reader (`psi`) | Tap the **Ψ** in the Saiki panel **5 times** | Kuku: "psychic diagnosis: mostly food." | Keep reading your mind. |
| 13 | Gojo (`gojo`) | In the Anime corner, a tiny blindfolded **Gojo peeks out at the bottom right of the "Take My Brother Away" panel**. Tap it. | Big chibi Gojo: "Throughout heaven and earth, you alone are the birthday one." Kuku: "he's cute. i'm cuter." | Something blindfolded is hiding in the anime corner. |
| 14 | Sleepy Kuku (`idle`) | **Don't touch anything for 45 seconds** | Kuku falls asleep: "zzz... khana khalo... zzz". Tap to wake her ("i was SLEEPING.") | Do nothing for a while. |
| 16 | Resist (`resist`) | In the gym level, after 22 curls, choose **Resist** instead of eating the Cinnabon | Buff Kuku: "resisted. ali is shook." | Say no to cinnamon. |
| 17 | By hand (`candles`) | Blow out all 22 candles **by tapping them** (with "My mic is shy" or just tapping), without the mic blowing any | "by HAND. all 22. dedication." | Skip the mic. Do the candles yourself. |
| 18 | 😭 rain (`sob`) | In Wrapped, after answering the emoji card, **long-press the 😭 option** | It rains 😭. "this is your fault." | Hold the crying. |
| 19 | Flush (`flush`) | In Wrapped's toilet card, **tap the 🚽 in the corner 12 times** | It spins down the drain and a wave crosses the card. "he's in there right now probably." | Twelve is the magic number. |
| 15 | Brother (`bro`) | In the chocolate bar, keep eating until the **brother has stolen 3 pieces** (each bite has a 45% chance he steals one) | Kuku: "you let him win. very big sister of you." | Let the brother win. |

### Other secrets (not counted as eggs)
- **Pet Kuku 15 times** (15 for the 15th). This only counts after the reveal. She counts "(n/15)" with grumpy lines, then gives in: heart Kuku, "...ok fine. happy birthday 😾". From then on she stays calm and blushes. Extra pets after that get purrs.
- **Wordle words with replies:** IDIOT ("translation: text me when you get home"), PAGAL, SHORT ("the sign cat agrees"), KUKUS, HAPPY, CAKES.
- **Wordle:** solving it in 1 or 2 gets "Wordle in 2, as promised", a callback to the letter.
- **Letter:** tap the red words **noob / idiot / pagal** for their translation. Tap **gym** for buff Kuku.
- **"Get lost":** Kuku turns into the middle-finger cat, zooms off-screen, then comes back holding a heart: "...i came back. you didn't go either. good."
- **Countdown:** if she has the countdown open at exactly midnight, the reveal button pops up on its own with confetti and Kuku yelling "PRESS IT."

---

## Sticker book

A **📖 book button** in the top bar (after the reveal) opens Samiya's sticker book. Everything she finds sticks in it automatically and is saved, so it fills up as she plays. **53 collectibles: 17 stickers + 36 Kuku lines.** (Wrapped added the **Wrapped Kuku** sticker for a perfect 6/6, plus 4 Wrapped lines.)

- **New finds:** a pink "+ sticker: Sleepy Kuku" / "+ quote for the book" pop-up, and a red count badge on the book button until she opens it.
- **Pages** (tabs at the top, ‹ › arrows, or swipe left/right):
  1. **Kuku**: her 11 moods (Kuku, Sparkle, YAYYY, Crying, Sleepy, Flower, DJ, Gym, Calm, Soft, Rude).
  2. **Guest stars**: Batman (Ali), Gojo, Samiya angry, Sign cat "ur short", Sign cat "UR GAY.".
  3. **Things Kuku said**: 32 lines. Unheard ones show as blacked-out word bars with a hint underneath.
  4. **Easter eggs**: all 17, found ones ticked, missing ones as ??? with hints.
  5. **Last page**: padlocked ("This page is stuck shut") until all 53 are collected. Then it shows a note from Ali and **the only photo of Samiya and Ali together** as a taped polaroid with heart Kuku on the corner ("you: in focus. me: a thumbs up and a lens flare."), ending in "Noob. (See the translation guide, line one.)". The photo (`src/assets/us.jpg`) is resized and has its metadata (including location) stripped. It is the only photo on the site, and like everything in the public repo, the file itself is publicly reachable.
- **Collected stickers** are taped in at a slight tilt. Tap one to see it big with a caption ("YAYYY Kuku: Pure joy. Rare. Like Ali being on time.").
- **Uncollected stickers** are dark silhouettes with "???". Tapping one shakes it and shows a hint.
- **Completing the book:** heart Kuku, confetti and "the sticker book is FULL. go look at the last page. noob."

When things get collected: a sticker counts the first time it appears (Kuku changing mood, the intro screen, a pop-up). The sign cats count when she **catches** one. A line counts the first time Kuku says it. The cat rain and the loader don't count. Sticker names, captions and hints are in `STICKERS` in `src/book.js`; collectible lines are in `QUOTES` (matched exactly against what Kuku says).

## Kuku's moods

Kuku (bottom right) switches stickers depending on what's happening, then goes back to her base mood. Reactions stay on screen for at least 4.5 seconds and speech bubbles for at least 3.5 seconds, so they don't flash past. A level's intro mood waits until any reaction still on screen finishes instead of replacing it.

| Mood | Sticker | When |
|---|---|---|
| angry (base) | `angry` | Default, until she's been petted 15 times |
| calm (base) | `calm` | After 15 pets |
| heart (base) | `heart` | 15th pet, and permanently after "Get lost" |
| yay | `yay` | Gate opening, picking "My 12", Wordle win, lifting the cover, candles out, cake intro |
| cry | `cry` | Wordle loss, Ali's 12, GST clock, brother steals, shake |
| eyes | `eyes` | Wordle, cave and letter intros, Ψ, insult words, mic listening, lanterns done, HAMZA |
| sleep | `sleep` | Bench, and the idle egg (stays asleep until tapped) |
| music | `music` | Turning sound on, anime intro |
| flower | `flower` | Timeline intro, extra pets |
| buff | `buff` | Long-press, "gym" in the letter, the whole gym level |
| finger | `finger` (middle-finger cat) | "Get lost" (Kuku flips her off and zooms away), also one of the rude peekers |

Pop-up stickers: `batman`, `gojo`, `samiya-angry`. Rude peekers: `sign-short`, `sign-gay`, `finger`. The shake cat-rain uses the 11 mood stickers.

---

## Sound

- **Music:** original tracks played live with Web Audio (`src/audio.js`): clock waltz, Wordle loop, cave ambience, anime opener, gym montage, Happy Birthday music box and soft piano, so there are no audio files to download. The Hollow Knight soundtrack is copyrighted, so these are new pieces in that mood. "Happy Birthday" is public domain.
- **Effects:** button taps, Wordle keys and tile chimes, lantern bells, geo tinkles, meows and hisses, chocolate crunch, candle puffs, confetti pops, the Batman riff, a Gojo "domain" chord and the egg jingle.
- **Mute:** the headphones cat in the top bar. The choice is remembered.
- Phones block sound until the first tap, so the music starts after her first touch.

---

## Before sending (checklist)

1. On GitHub, **Actions** → the latest "Deploy to GitHub Pages" run is green.
2. On your own phone, open `https://plasteredpeak.github.io/kuku-birthday/?ali&wait&reset`, turn the volume up and play through quickly. (Your progress is stored on your phone only and never affects hers.)
3. Send her the **plain link**: `https://plasteredpeak.github.io/kuku-birthday/`. Never send a link with `?ali`, `?wait`, `?all` or `?reset` in it.
4. WhatsApp shows a preview card (Kuku + "Samiya's 22nd"). If it doesn't appear straight away, wait a few seconds before sending.

Sending it 1 to 2 hours early is fine. She gets the loader, Kuku's intro and the live countdown, and nothing else unlocks until 12 PKT. The screen stays awake while the countdown is open.

## Tested scenarios

Automated tests in a phone-sized Chromium (384×832, plus 360×740 and 412×915), with the clock faked to specific moments:
- Link opened 2 hours early: intro ends with the "guarding your surprise" line, countdown shows ~2:00:00, only timer + Kuku + sound visible.
- Reload mid-countdown: no second intro, straight to the timer.
- Countdown reaching zero on its own: reveal button appears, Kuku switches to yay and stays there until pressed.
- First opened after 12: intro says "it's already 12", reveal button straight away.
- Coming back after the reveal: straight into the site where she left off.
- 1:35pm PKT next day: birth-time egg triggers.
- Reduced-motion setting, browser blocking saved progress, double-tapping every big button.
- Every Kuku mood in every level, all stickers load, sticker book collection and completion, no sideways scrolling on any screen size.

Not testable here, so check on a real phone: sound, vibration, the mic for the candles and shaking for the cat rain.

## Extras
- **WhatsApp preview:** `public/og.jpg` with Open Graph tags.
- **Send Ali my score:** button at the very end that opens WhatsApp with "Kuku report: I found X/17 easter eggs and Y/48 things for my sticker book…".
- **Phone hardening:** no long-press "save image" menus, no double-tap zoom, Samsung's forced dark mode blocked, screen wake lock during the countdown, double-tap guards on the open, ok Kuku and reveal buttons.

## Project structure

```
index.html              all level markup and the letter text
src/main.js             loader, countdown, reveal, levels, Wordle, gym, Kuku moods, easter eggs
src/bg.js               the five animated countdown backgrounds
src/book.js             the sticker book: collectibles, pages, last page
src/wrapped.js          the Wrapped quiz: cards, answers, score, its two eggs
src/audio.js            music themes + sound effects
src/style.css           styling (Gaegu + Atkinson Hyperlegible fonts)
src/assets/cats/*.webp  stickers (background removed, white outline)
src/assets/kuku-*.png   original Kuku (angry) and calm Kuku
art-originals/*.jpg     the original cat images
.github/workflows/deploy.yml  builds with Vite and deploys to GitHub Pages
```

**Common edits:**
- Letter text: `index.html`, inside `<article class="letter">`
- Wordle answer: `ANSWER` in `src/main.js`
- Cave quotes: `MEMORIES` in `src/main.js`
- Mind-reader thoughts: `THOUGHTS` in `src/main.js`
- Opening time: `BIRTHDAY` in `src/main.js` (in UTC)
- Countdown teasers: `TEASES` in `src/main.js`; loader lines: `LOADER_LINES`
- Gym coach lines: `GYM_LINES` in `src/main.js`
- Rude peekers and their lines: `PEEKERS` in `src/main.js`
- Music: `THEMES` in `src/audio.js`

## Develop and deploy

    npm install
    npm run dev       # local dev server
    npm run build     # production build into dist/

Every push to `main` builds and deploys to GitHub Pages automatically through `.github/workflows/deploy.yml` (Settings → Pages → Source must be **GitHub Actions**). Only keep that one workflow, because GitHub's "static content" template publishes unbuilt files and breaks the site.

Built with Vite, GSAP and canvas-confetti. The only photo is the one on the sticker book's last page.
