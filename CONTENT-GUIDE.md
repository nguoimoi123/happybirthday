# Adding a new birthday

Each age owns its screens and assets inside the folder named after that age.

1. Build the story in the matching folder, for example `20/`.
2. Give that season a unique `concept`, `cover` GIF, `coverAlt`, and `accent` in
   the `releases` object in `album.js`. Never reuse another age's cover GIF.
3. When the story is ready, set `published: true` and add its `href`.
4. Keep the birthday fixed at 30 July. Age 20 maps to 2027, age 21 to 2028,
   continuing through age 100 in 2107.

The album only records the first open when the real Bangkok date is exactly the
matching birthday. A replay opens the completed summary scene directly. Early
password previews and development previews must not call `recordOpenedOnBirthday`.
