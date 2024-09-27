# Fretboards on a browser

Instantiate a fretboard, and display some notes, scales, chord voicings, etc.

This is an example of how it looks like:

![](GMajor.png)

A live demo is available at http://fretboard.txels.com/demos/dynamic.html

## Installation

As a script tag, from CDN:

```html
<script src="https://unpkg.com/fretboards/dist/fretboard.js"></script>
```

In a modern Javascript environment, with ES2015 or higher, install with:

    npm install fretboards

And then import the whole package:

```js
import * as fretboards from "fretboards";
```

...or just the bits you need:

```js
import { Fretboard, Tunings } from "fretboards";
```

## Usage examples

### The javascript API:

```js
// Layout a specific scale
var fb = fretboard.Fretboard();
fb.add("a phrygian").paint();

// Use alternative tunings
var fbDropD = fretboard.Fretboard({ tuning: fretboard.Tunings.guitar6.Drop_D });
fbDropD.add("a phrygian").paint();

// Place specific notes on specific strings, e.g. for chord voicings
var c7add9 = fretboard.Fretboard({ frets: 5 });
c7add9.add("5:c3 4:e3 3:bb3 2:d4 1:g4").paint();
```

### Property updates

Once the fretboard is rendered, you can dynamically update configuration
properties and the fretboard will redraw, keeping the notes. Examples include:

```js
fb.set("fretWidth", 30);
fb.set("leftHanded", true);
fb.set("frets", 12);
```

Check the full example at `demos/dynamic.html`.

### The 'document' API

You can also use HTML attributes for declaratively including fretboard
instances in your page, and using `Fretboard.drawAll(selector)` as in the
example below:

```html
<div
  class="fb-container"
  data-notes="6:g2 6:f#2 6:a2 5:b2 5:c3 5:d3 4:e3 4:f#3; 4:g3 3:a3 3:b3 3:c4 2:d4 2:e4 2:f#4; 1:g4 1:a4 1:b4"
></div>
<div class="fb-container" data-frets="12" data-notes="c major"></div>

<!-- bootstrapping javascript at the end -->
<script>
  fretboard.Fretboard.drawAll(".fb-container");
</script>
```

You can pass initialization configuration options to `drawAll`, e.g.:

```html
<script>
  fretboard.Fretboard.drawAll(".fb-container", {
    tuning: Tunings.guitar6.E_4ths,
    leftHanded: true,
  });
</script>
```

## Configuration options

These are the configuration options and their default values:

```js
config = {
  frets: 12, // Number of frets to display
  startFret: 0, // Initial fret
  strings: 6, // Strings
  tuning: Tunings.guitar6.standard, // Tuning: default = Standard Guitar
  fretWidth: 50, // Display width of frets in pixels
  fretHeight: 20, // Display heigh of frets in pixels
  leftHanded: false, // Show mirror image for left handed players
  showTitle: false, // Set the note name as the title, so it will display on hover
  nameColors: [],
};
```

## Development and Contributing

I use node 18 and `yarn`. Your mileage may vary with other versions and `npm`.

The commands I typically use are in the `Justfile` or directly in `package.json`.

Get started with:

    yarn install
    yarn build
    yarn test

If you contribute some new feature, make sure to extend the docs and add some example under `demos` to showcase it.

I welcome test, examples, documentation. We could do with a thorough single-page showcase in demos that we could also use for visual testing.
