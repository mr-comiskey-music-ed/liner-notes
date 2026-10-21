# Liner Notes

Great moments in recorded music, for Mr. Comiskey's classes. Three wings: The Music, The Sound, The Players.

No build step and no backend. Vercel serves the files as they are.

## Where things live

| To change… | Edit this file |
|---|---|
| An entry's text, clip, badges, or credits | `content.js`, in that topic's block |
| A topic's reflection prompts | the `prompts` list at the end of that topic's block in `content.js` |
| The list of topics, wing names, wing blurbs | the top of `content.js` |
| Colors and fonts | `css/style.css` (top of the file) |
| How the site works (codes, grading, assignments) | `js/app.js` |

## Setting a clip

In the entry's `clips` list, paste a YouTube link or the 11-character video ID into `yt:""`. To play just the moment, add start and end times in seconds:

```js
{song:"In the Air Tonight", artist:"Phil Collins", year:1981, yt:"https://www.youtube.com/watch?v=XXXXXXXXXXX", start:220, end:250, q:"Phil Collins In the Air Tonight official"}
```

`q` is the search used for the "Find on YouTube" link when no clip is set.

## Adding a topic

1. In `content.js`, copy the whole Reverb block and paste it below, changing `CONTENT.reverb` to `CONTENT["<topic-id>"]`.
2. Replace the entries and prompts.
3. In the topic list at the top of `content.js`, add `ready:true` to that topic.

## Student codes

- Student codes start with `LN1`; assignment codes start with `LNA`.
- Both are compressed JSON. No names or other student data are stored anywhere.
- Students keep responses in their own browser (localStorage) and can restore from an earlier code on the My responses page.
- Assignment links use `?a=<assignment code>`.

## Still to come

- Firebase for "Suggest your own" (anonymous submissions, teacher approval, public tally).
- Timeline view for the Sound wing.
- Content for the remaining topics.
