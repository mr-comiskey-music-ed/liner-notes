# Liner Notes: notes for Claude

Listening/history site for Mr. Comiskey's high school sound engineering, music production, and songwriting classes (Lane Tech, Chicago). Deployed on Vercel at linernotes.mrcomiskey.com. The owner vibecodes and has little coding background: explain changes plainly and keep edits small.

## Hard rules
- No student data stored anywhere, not even names. No backend for student work.
- Student work is turned in as compressed base64 codes pasted into Google Classroom (prefix `LN1`, assignment codes `LNA`). Keep codes backward compatible: old codes must still decode.
- Must run well on school Chromebooks and stay lightweight. Mobile matters too (cards swipe on phones).
- CPS filters some YouTube videos; teacher checks clips. Every card keeps an "Open on YouTube" fallback link.
- Plain HTML/CSS/JS, no build step, no frameworks.

## Structure
- `content.js`: ALL content. Wings + topic list at the top; one block per topic (`CONTENT.<id>`). Most edits happen here. Search for the song or entry name and edit in place; don't rewrite the file.
- `js/app.js`: routing (hash tokens like `#reverb`), cards, responses, codes, assignment builder, grader.
- `css/style.css`: theme tokens at the top (dark and light versions of one palette). Fonts: Fraunces (display), Work Sans (body), DM Mono (credits/labels). Wing colors: Music = coral, Sound = teal, Players = gold.

## Content conventions
- Three wings: The Music (ideas: rhythm, melody, harmony), The Sound (recording/effects), The Players (performances). Sorting rule: if the moment would survive a different performer, it's Music; if not, it's Players.
- Each topic: 4–8 entries. Each entry: name, 1+ clips, 2–3 short bullets, badges (Innovative / Iconic / Genre-defining / Popular), a credits line, optional "Influenced by / Influenced" links.
- Clips: `yt:` takes a YouTube URL or ID; `clip:"0:38-1:12"` sets the span (start only and plain seconds also work). Entries with several clips show tabs that switch one player.
- Prompts: 3–4 per topic plus "Your own angle." Mix personal, listener-effect, and historical-context prompts. No drills or quizzes; this is listening and exploration.
- Facts in bullets should be checkable. When unsure of a specific song or claim, leave a placeholder for the teacher instead of guessing.

## Planned
- Firebase for "Suggest your own": anonymous submissions (YouTube link, topic, one-line reason), teacher approval, public tally of approved picks. Currently a stub.
- Timeline view, probably Sound wing only.
- Small Web Audio "try it" panels on a few Sound pages (optional add-on).
