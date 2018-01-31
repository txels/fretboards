# Fretboards on a browser

Instantiate a fretboard, and display some notes, scales, chord voicings, etc.

Examples using javascript:

```js
// Layout a specific scale
var fb = Fretboard();
fb.draw("a phrygian");

// Use alternative tunings
var fbDropD = Fretboard({tuning: Tunings.Drop_D});
fbDropD.draw("a phrygian");

// Place specific notes on specific strings, e.g. for chord voicings
var c7add9 = Fretboard({frets: 5});
c7add9.draw("5:c3 4:e3 3:bb3 2:d4 1:g4");
```

You can also use HTML attributes for declaratively including fretboard
instances in your page, and using `Fretboard.drawAll(selector)` as in the
example below:

```html
<div
  class="fb-container"
  data-notes="6:g2 6:f#2 6:a2 5:b2 5:c3 5:d3 4:e3 4:f#3; 4:g3 3:a3 3:b3 3:c4 2:d4 2:e4 2:f#4; 1:g4 1:a4 1:b4">
</div>
<div class="fb-container" data-frets="12" data-notes="c major"></div>

<!-- bootstrapping javascript at the end -->
<script>
    Fretboard.drawAll('.fb-container');
</script>
```
