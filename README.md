# kuku-birthday

A small, grumpy, phone-first website for **Samiya's 22nd birthday (15 October 2026)**, made by Ali.
Kuku, an angry cat sticker, guides her through seven levels, comments on everything and changes mood as she goes. There are 15 hidden easter eggs to find.

- **Live:** https://plasteredpeak.github.io/kuku-birthday/
- **Opens at:** 00:00 on 15 Oct, Pakistan time (PKT, UTC+5). That's 20:00 on 14 Oct in Ireland (IST, UTC+1). Before then, the site shows a countdown.
- **Built for:** Samsung Galaxy S25 (Chrome or Samsung Internet), portrait. It works on any phone and on desktop too.

---

## Testing links

| URL | What it does |
|---|---|
| `/kuku-birthday/` | The real thing. Shows the countdown until 12 PKT, then opens on its own. |
| `/kuku-birthday/?ali` | Skips the countdown so you can play it any time. |
| `/kuku-birthday/?ali&reset` | Skips the countdown and wipes saved progress (levels, eggs, pets, Wordle). |
| `/kuku-birthday/?ali&all` | Unlocks every level at once, to jump straight to any section. |

Progress is saved in the browser (localStorage), so if she closes the tab she'll pick up where she left off. **Before sending the link, open it once with `?reset`** on your own phone, so your test progress doesn't confuse you later.

---

## The levels

Each level unlocks the next one. Every level has its own music track.

| # | Level | What happens | Music |
|---|---|---|---|
| 0 | **Gate** | Ireland, Pakistan and a fake "GST" clock. Countdown until 12 PKT, then the question "Merey 12 ya apkay 12?" "My 12, obviously" continues. | Music-box waltz with a ticking clock |
| 1 | **Wordle** | Birthday Wordle. The answer is **DUMBO**. Six tries, a real keyboard and a "Copy my result" button. | Light plucky loop |
| 2 | **The cave** | "The cave of things you made me do." Tap 5 lanterns to light them, each showing a real quote from the chat. Then "Rest at the bench". | Dark cave ambience with bells (the Hollow Knight-feeling one) |
| 3 | **Anime corner** | **Saiki K.:** tap Ψ to read her mind (her real chat lines). **Black Butler:** lift the cover to find cheesecake ("Yes, my lady"). **Take My Brother Away:** eat a chocolate bar before the brother steals it. | Upbeat anime-opening feel |
| 4 | **Cake** | 22 candles. "Blow out the candles" uses the mic, so she blows into the phone. "My mic is shy" lets her tap each candle instead. | Happy Birthday on a music box |
| 5 | **Timeline** | 2024 (almost a day late), 2025 (on time, "Ur big 16"), 2026 (on time plus a website). | Soft piano |
| 6 | **Letter** | Ali's letter with the translation guide, then the "Get lost" button, then the finale with her easter-egg score and hints for the ones she missed. | Soft piano |

---

## All 15 easter eggs (one for each day of October up to her birthday)

Each one shows a yellow toast ("Easter egg n/15"), plays a jingle, buzzes the phone and adds to the counter in the top right. At the end, she sees which ones she found and gets a hint for each one she missed.

| # | Egg (id) | How to get it | What happens | Hint shown at the end |
|---|---|---|---|---|
| 1 | GST clock (`gst`) | Tap the **GST** clock on the gate | Kuku: "I DONT HAVE GST CLOCK" (her own line), crying Kuku | A clock that does not exist. |
| 2 | Ali's 12 (`ali12`) | On the gate, tap **"Ali's 12"** | Screen shakes, angry chibi Samiya pops up: "you, every time he is late". Kuku: "that's 4 hours late. as usual 😭" | The wrong answer at the start. |
| 3 | Batman (`batman`) | Tap **Ali's (Ireland) clock 3 times quickly**, or tap the **"– Ali" signature** at the end of the letter | Batman cat with a bass riff: "I'm Batman. – Ali Hamza, a.k.a. pp" | Poke Ali's clock. Or his name. |
| 4 | HAMZA (`hamza`) | Guess **HAMZA** in the Wordle | Kuku: "why is HE in your head. on your birthday." | Guess a name in the Wordle. |
| 5 | Pick up Kuku (`hold`) | **Long-press Kuku** (hold about 1 second) | Buff Kuku: "put me DOWN. i go to the gym." | Don't just tap Kuku. Hold. |
| 6 | Sign cat (`sign`) | A stick cat holding **"ur short"** or **"UR GAY."** slides in from the left for about 5 seconds, a few seconds after the Wordle, Anime and Timeline levels open. **Tap it** before it leaves. | Kuku: "rude. accurate though." | Someone keeps peeking from the left with a sign. |
| 7 | Shake (`shake`) | **Shake the phone** | It rains cat stickers. Kuku: "it is raining kukus. happy now?" | Shake things up. |
| 8 | Title (`title`) | Tap **"samiya's 22nd"** (top left) **5 times quickly** | Kuku: "stop poking things. you're 22." | Poke the top-left corner. |
| 9 | Birth time (`born`) | Have the site open **between 1:30 and 1:59pm Pakistan time** (she was born at 1:30pm) | Kuku: "1:30pm. you were born now-ish. I remember things. sometimes." | Come back at the time you were born. |
| 10 | Sideways (`turn`) | **Turn the phone to landscape** | Full-screen nag: "Phone seedha karo. This is a portrait birthday." | Hold your phone the wrong way. |
| 11 | Bench (`bench`) | Light all 5 lanterns in the cave, then tap **"Rest at the bench"** (everyone gets this one) | Sleepy Kuku: "progress saved. unlike your sleep schedule." | Sit down somewhere. |
| 12 | Mind reader (`psi`) | Tap the **Ψ** in the Saiki panel **5 times** | Kuku: "psychic diagnosis: mostly food." | Keep reading your mind. |
| 13 | Gojo (`gojo`) | In the Anime corner, a tiny blindfolded **Gojo peeks out at the bottom right of the "Take My Brother Away" panel**. Tap it. | Big chibi Gojo: "Throughout heaven and earth, you alone are the birthday one." Kuku: "he's cute. i'm cuter." | Something blindfolded is hiding in the anime corner. |
| 14 | Sleepy Kuku (`idle`) | **Don't touch anything for 45 seconds** | Kuku falls asleep: "zzz... khana khalo... zzz". Tap to wake her ("i was SLEEPING.") | Do nothing for a while. |
| 15 | Brother (`bro`) | In the chocolate bar, keep eating until the **brother has stolen 3 pieces** (each bite has a 45% chance he steals one) | Kuku: "you let him win. very big sister of you." | Let the brother win. |

### Other secrets (not counted as eggs)
- **Pet Kuku 15 times** (15 for the 15th). She counts "(n/15)" with grumpy lines, then gives in: heart Kuku, "...ok fine. happy birthday 😾". From then on she stays calm and blushes. Extra pets after that get purrs.
- **Wordle words with replies:** IDIOT ("translation: text me when you get home"), PAGAL, SHORT ("the sign cat agrees"), KUKUS, HAPPY, CAKES.
- **Wordle:** solving it in 1 or 2 gets "Wordle in 2, as promised", a callback to the letter.
- **Letter:** tap the red words **noob / idiot / pagal** for their translation. Tap **gym** for buff Kuku.
- **"Get lost":** Kuku zooms off-screen, comes back holding a heart and says "...i came back. you didn't go either. good."
- **Countdown:** if she has the site open at exactly midnight, it opens on its own with confetti and "it's 12. YOUR 12."

---

## Kuku's moods

Kuku (bottom right) switches stickers depending on what's happening, then goes back to her base mood.

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
| buff | `buff` | Long-press, "gym" in the letter |
| zoom | `zoom` | "Get lost" |

Pop-up stickers: `batman`, `gojo`, `samiya-angry`. Peeking sticker: `sign-short` / `sign-gay`. The shake cat-rain uses the 11 mood stickers.

---

## Sound

- **Music:** original tracks played live with Web Audio (`src/audio.js`), so there are no audio files to download. The Hollow Knight soundtrack is copyrighted, so these are new pieces in that mood. "Happy Birthday" is public domain.
- **Effects:** button taps, Wordle keys and tile chimes, lantern bells, geo tinkles, meows and hisses, chocolate crunch, candle puffs, confetti pops, the Batman riff, a Gojo "domain" chord and the egg jingle.
- **Mute:** the headphones cat in the top bar. The choice is remembered.
- Phones block sound until the first tap, so the music starts after her first touch.

---

## Project structure

```
index.html              all level markup and the letter text
src/main.js             levels, Wordle, Kuku moods, easter eggs, confetti
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
- Music: `THEMES` in `src/audio.js`

## Develop and deploy

    npm install
    npm run dev       # local dev server
    npm run build     # production build into dist/

Every push to `main` builds and deploys to GitHub Pages automatically through `.github/workflows/deploy.yml` (Settings → Pages → Source must be **GitHub Actions**). Only keep that one workflow, because GitHub's "static content" template publishes unbuilt files and breaks the site.

Built with Vite, GSAP and canvas-confetti. No photos are used.
