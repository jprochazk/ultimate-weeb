Chrome extension which improves your weeb power level.

Many websites for reading manga or watching anime don't have the `previous` and `next` buttons bound to keys. This extension adds the option to select the buttons individually for every website you use. Once they're selected, you can use the left/right arrow keys to navigate.

### Installation

1. Download the [source code](https://github.com/jprochazk/ultimate-weeb/releases/latest)
2. Extract it somewhere
3. Go to [chrome://extensions/](chrome://extensions/)
4. Click "Load Unpacked"
5. Select the folder in which you extracted the extension

### Usage

1. Go to your favorite manga/anime aggregator
2. Click the extension icon (to the right of your address bar)
3. Click `Select Previous`, then click the `previous chapter`/`previous episode` button
4. Do the same for `Select Next`
5. You can now navigate chapters/episodes using only your keyboard!

### Development

It's simple: If the extension is loaded via `load unpacked`, then after modifying any of the `.js`, `.html`, or `.css` files, just reload the page, and Chrome will use the updated files. Same applies to `options`. For `popup`, you don't even have to reload the page, just close and re-open the popup.

### TODOs

- Setup rollup bundle
  - Create a rollup plugin which generates `manifest.json`
  - TypeScript
  - Less/Sass
  - Svelte (?)
- Anime autoplay mode
  - Select `next` button and `video` element
  - When enabled:
    - Plays `video`
    - If `video` is finished, clicks `next`
    - Repeat
