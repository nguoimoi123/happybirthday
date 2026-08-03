# Birthday Album

The root page is now the birthday collection covering ages 19 through 100.

- `index.html`, `album.css`, `album.js`: the collection and next-birthday countdown.
- `19/`: the completed age-19 story, opened on 30 July 2026.
- `20/` through `100/`: reserved folders for future birthday content.

An age is only written to browser storage when its published story is opened on
30 July of its matching year in the `Asia/Bangkok` timezone. Previewing or
replaying a story never changes its original opened date.

## Age 19 content

## Edit Content

Edit all text, titles, button labels, password, letter, and messages in:

```text
19/env.js
```

You usually do not need to edit `index.html`. It only contains the layout shell.

## Important Fields

- `password`: password for the first scene.
- `lock`: first secret-room scene.
- `suspense.lines`: typewriter lines after unlock.
- `memory.cards`: three memory cards and their hidden messages.
- `countdown.captions`: countdown text.
- `birthday`: main birthday reveal.
- `letter.body`: secret letter text.
- `final`: final question, buttons, and final message.
