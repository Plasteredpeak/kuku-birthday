# kuku-birthday

A small, grumpy birthday website for Samiya's 22nd. Phone-first, built with Vite, GSAP and canvas-confetti.

- Live: https://plasteredpeak.github.io/kuku-birthday/
- Opens at 00:00 on 15 Oct, Pakistan time. Add `?ali` to the URL to skip the countdown for testing, and `?reset` to wipe saved progress.

## Develop
    npm install
    npm run dev

## What's inside
- `src/audio.js`: original music for each section (clock waltz, Wordle loop, cave ambience, anime opener, Happy Birthday music box, soft piano), played live with Web Audio, plus every sound effect.
- `src/assets/cats/`: Kuku's moods and the easter-egg stickers. The original images are in `art-originals/`.
- 15 easter eggs, one for each day of October up to her birthday.
