import * as d3 from "d3-selection";
import "../assets/fretboard.css";

// Music
const allNotes = [
  "c",
  "c#",
  "d",
  "d#",
  "e",
  "f",
  "f#",
  "g",
  "g#",
  "a",
  "a#",
  "b",
];
const allNotesEnh = [
  "c",
  "db",
  "d",
  "eb",
  "fb",
  "f",
  "gb",
  "g",
  "ab",
  "a",
  "bb",
  "cb",
];
const colors = [
  "red",
  "green",
  "blue",
  "black",
  "purple",
  "gray",
  "orange",
  "lightgray",
];

export const Scales = {
  // scales
  lydian: "c d e f# g a b",
  major: "c d e f g a b",
  mixolydian: "c d e f g a bb",
  dorian: "c d eb f g a bb",
  aeolian: "c d eb f g ab bb",
  phrygian: "c db eb f g ab bb",
  locrian: "c db eb f gb ab bb",
  "harmonic-minor": "c d eb f g ab b",
  "melodic-minor": "c d eb f g a b",
  "minor-pentatonic": "c eb f g bb",
  "minor-blues": "c eb f f# g bb",
  "major-pentatonic": "c d e g a",
  "major-blues": "c d d# e g a",
  "composite-blues": "c d d# e f f# g a bb",
  "dom-pentatonic": "c e f g bb",
  japanese: "c db f g ab",
  // chords
  maj: "c e g",
  aug: "c e g#",
  min: "c eb g",
  dim: "c eb gb",
  maj7: "c e g b",
  7: "c e g bb",
  min7: "c eb g bb",
  m7b5: "c eb gb bb",
  dim7: "c eb gb a",
  _: function (scale) {
    return Scales[scale].split(" ");
  },
};

function whatIs(sequence) {
  let sections = sequence.split(" ");
  if (sections.length === 2 && typeof Scales[sections[1]] === "string") {
    return "scale";
  }
  if (sections[0].indexOf(":") > 0) {
    return "placeNotes";
  } else {
    return "addNotes";
  }
}

function asOffset(note) {
  note = note.toLowerCase();
  let offset = allNotes.indexOf(note);
  if (offset === -1) {
    offset = allNotesEnh.indexOf(note);
  }
  return offset;
}

function absNote(note) {
  let octave = note[note.length - 1];
  let pitch = asOffset(note.slice(0, -1));
  if (pitch > -1) {
    return pitch + octave * 12;
  }
}

function noteName(absPitch) {
  let octave = Math.floor(absPitch / 12);
  let note = allNotes[absPitch % 12];
  return note + octave.toString();
}

function asNotes(scale) {
  let [root, type] = scale.split(" ");
  let scaleInC = Scales._(type);
  let offset = asOffset(root);
  let scaleTransposed = scaleInC.map(function (note) {
    return allNotes[(asOffset(note) + offset) % 12];
  });
  return scaleTransposed.join(" ");
}

// Fretboard
export const Tunings = {
  bass4: {
    standard: ["e1", "a1", "d2", "g2", "b2", "e3"],
  },
  guitar6: {
    standard: ["e2", "a2", "d3", "g3", "b3", "e4"],
    E_4ths: ["e2", "a2", "d3", "g3", "c4", "f4"],
    Drop_D: ["d2", "a2", "d3", "g3", "b3", "e4"],
    G_open: ["d2", "g2", "d3", "g3", "b3", "d4"],
    DADGAD: ["d2", "a2", "d3", "g3", "a3", "d4"],
  },
  guitar7: {
    standard: ["b2", "e2", "a2", "d3", "g3", "b3", "e4"],
    E_4ths: ["b2", "e2", "a2", "d3", "g3", "c3", "f4"],
  },
};

export const Fretboard = function (config) {
  config = config || {};
  let where = config.where || "body";

  let id = "fretboard-" + Math.floor(Math.random() * 1000000);

  let instance = {
    frets: 12,
    startFret: 0,
    strings: 6,
    tuning: Tunings.guitar6.standard,
    fretWidth: 50,
    fretHeight: 20,
    leftHanded: false,
    showTitle: false,
    ...config,
  };

  let fretFitsIn = function (fret) {
    return fret > instance.startFret && fret <= instance.frets;
  };

  let fretsWithDots = function () {
    let allDots = [3, 5, 7, 9, 15, 17, 19, 21];
    return allDots.filter(fretFitsIn);
  };

  let fretsWithDoubleDots = function () {
    let allDots = [12, 24];
    return allDots.filter(fretFitsIn);
  };

  let fretboardHeight = function () {
    return (instance.strings - 1) * instance.fretHeight + 2;
  };

  let fretboardWidth = function () {
    return (instance.frets - instance.startFret) * instance.fretWidth + 2;
  };

  let XMARGIN = function () {
    return instance.fretWidth;
  };
  let YMARGIN = function () {
    return instance.fretHeight;
  };

  let makeContainer = function (elem) {
    instance.width = fretboardWidth() + XMARGIN() * 2;
    instance.height = fretboardHeight() + YMARGIN() * 2;

    let container = d3
      .select(elem)
      .append("div")
      .attr("class", "fretboard")
      .attr("id", id)
      .append("svg")
      .attr("width", instance.width)
      .attr("height", instance.height);

    if (instance.leftHanded) {
      container = container
        .append("g")
        .attr("transform", "scale(-1,1) translate(-" + instance.width + ",0)");
    }

    return container;
  };

  let drawFrets = function () {
    for (let i = instance.startFret; i <= instance.frets; i++) {
      // BEWARE: the coordinate system for SVG elements uses a transformation
      // for lefties, however the HTML elements we use for fret numbers and
      // tuning we transform by hand.
      let x = (i - instance.startFret) * instance.fretWidth + 1 + XMARGIN();
      let fretNumX = x;
      if (instance.leftHanded) {
        fretNumX = instance.width - x;
      }
      // fret
      instance.svgContainer
        .append("line")
        .attr("x1", x)
        .attr("y1", YMARGIN())
        .attr("x2", x)
        .attr("y2", YMARGIN() + fretboardHeight())
        .attr("stroke", "lightgray")
        .attr("stroke-width", i === 0 ? 8 : 2);
      // number
      d3.select("#" + id)
        .append("p")
        .attr("class", "fretnum")
        .style("top", fretboardHeight() + YMARGIN() + 5 + "px")
        .style("left", fretNumX - 4 + "px")
        .text(i);
    }
  };

  let drawStrings = function () {
    for (let i = 0; i < instance.strings; i++) {
      instance.svgContainer
        .append("line")
        .attr("x1", XMARGIN())
        .attr("y1", i * instance.fretHeight + 1 + YMARGIN())
        .attr("x2", XMARGIN() + fretboardWidth())
        .attr("y2", i * instance.fretHeight + 1 + YMARGIN())
        .attr("stroke", "black")
        .attr("stroke-width", 1);
    }
    let placeTuning = function (d, i) {
      return (instance.strings - i) * instance.fretHeight - 5 + "px";
    };

    let toBaseFretNote = function (note) {
      return noteName(absNote(note) + instance.startFret);
    };

    let hPosition = instance.leftHanded ? instance.width - 16 + "px" : "4px";

    d3.select("#" + id)
      .selectAll(".tuning")
      .data(instance.tuning.slice(0, instance.strings))
      .style("top", placeTuning)
      .text(toBaseFretNote)
      .enter()
      .append("p")
      .attr("class", "tuning")
      .style("top", placeTuning)
      .style("left", hPosition)
      .text(toBaseFretNote);
  };

  let drawDots = function () {
    let p = instance.svgContainer.selectAll("circle").data(fretsWithDots());

    function dotX(d) {
      return (
        (d - instance.startFret - 1) * instance.fretWidth +
        instance.fretWidth / 2 +
        XMARGIN()
      );
    }

    function dotY(ylocation) {
      let margin = YMARGIN();

      if (instance.strings % 2 === 0) {
        return (
          ((instance.strings + 3) / 2 - ylocation) * instance.fretHeight +
          margin
        );
      } else {
        return (fretboardHeight() * ylocation) / 4 + margin;
      }
    }

    p.enter()
      .append("circle")
      .attr("cx", dotX)
      .attr("cy", dotY(2))
      .attr("r", 4)
      .style("fill", "#ddd");

    p = instance.svgContainer.selectAll(".octave").data(fretsWithDoubleDots());

    p.enter()
      .append("circle")
      .attr("class", "octave")
      .attr("cx", dotX)
      .attr("cy", dotY(3))
      .attr("r", 4)
      .style("fill", "#ddd");
    p.enter()
      .append("circle")
      .attr("class", "octave")
      .attr("cx", dotX)
      .attr("cy", dotY(1))
      .attr("r", 4)
      .style("fill", "#ddd");
  };

  instance.svgContainer = makeContainer(where);

  instance.drawBoard = function () {
    drawFrets();
    drawDots();
    drawStrings();
    return instance;
  };

  // Notes on fretboard

  instance.addNoteOnString = function (note, string, color) {
    let absPitch = absNote(note);
    color = color || "black";
    let absString = instance.strings - string;
    let basePitch = absNote(instance.tuning[absString]) + instance.startFret;
    if (
      absPitch >= basePitch &&
      absPitch <= basePitch + instance.frets - instance.startFret
    ) {
      const circle = instance.svgContainer
        .append("circle")
        .attr("class", "note")
        .attr("stroke-width", 1)
        // 0.75 is the offset into the fret (higher is closest to fret)
        .attr("cx", (absPitch - basePitch + 0.75) * instance.fretWidth)
        .attr("cy", (string - 1) * instance.fretHeight + 1 + YMARGIN())
        .attr("r", 6)
        .style("stroke", color)
        .style("fill", "white")
        .on("click", function (d) {
          let fill = this.style.fill;
          this.setAttribute(
            "stroke-width",
            5 - parseInt(this.getAttribute("stroke-width"))
          );
          this.style.fill = fill === "white" ? "lightgray" : "white";
        });

      if (instance.showTitle) {
        circle.append("title").text(note.toUpperCase());
      }
    }
    return instance;
  };

  instance.addNote = function (note, color) {
    for (let string = 1; string <= instance.strings; string++) {
      instance.addNoteOnString(note, string, color);
    }

    return instance;
  };

  instance.addNotes = function (notes, color) {
    let allNotes = notes.split(" ");
    for (let i = 0; i < allNotes.length; i++) {
      let showColor = color || colors[i];
      let note = allNotes[i];
      for (let octave = 1; octave < 7; octave++) {
        instance.addNote(note + octave, showColor);
      }
    }

    return instance;
  };

  instance.scale = function (scaleName) {
    instance.clear();
    instance.addNotes(asNotes(scaleName));

    return instance;
  };

  instance.placeNotes = function (sequence) {
    // Sequence of string:note
    // e.g. "6:g2 5:b2 4:d3 3:g3 2:d4 1:g4"
    let pairs = sequence.split(" ");
    pairs.forEach(function (pair, i) {
      const [string, note] = pair.split(":");
      instance.addNoteOnString(note, parseInt(string)); // , i==0? "red" : "black");
    });

    return instance;
  };

  instance.draw = function (something) {
    let sections = something.trim().replace(/\s\s+/g, " ").split(";");
    sections.forEach(function (section) {
      section = section.trim();
      let what = whatIs(section);
      instance[what](section);
    });
  };

  instance.clearNotes = function () {
    instance.svgContainer.selectAll(".note").remove();

    return instance;
  };

  instance.clear = function () {
    d3.select("#" + id)
      .selectAll(".fretnum,.tuning")
      .remove();
    instance.svgContainer.selectAll("line").remove();
    instance.svgContainer.selectAll("circle").remove();
    instance.drawBoard();

    return instance;
  };

  instance.delete = function () {
    d3.select("#" + id).remove();
  };

  return instance.drawBoard();
};

Fretboard.drawAll = function (selector, config) {
  config = config || {};
  let fretboards = document.querySelectorAll(selector);

  fretboards.forEach(function (e) {
    let fretdef = e.dataset["frets"];
    if (fretdef && fretdef.indexOf("-") !== -1) {
      [config.startFret, config.frets] = fretdef.split("-").map(function (x) {
        return parseInt(x);
      });
    } else {
      [config.startFret, config.frets] = [0, parseInt(fretdef) || 8];
    }
    let notes = e.dataset["notes"];
    config.where = e;

    let fretboard = Fretboard(config);
    if (notes) {
      fretboard.draw(notes);
    }
  });
};

export function Guitar(strings, frets) {
  strings = strings || 6;
  frets = frets || 12;
  return Fretboard({
    strings: strings,
    frets: frets,
    tuning: Tunings["guitar" + strings].standard,
  });
}

export function Bass(strings, frets) {
  strings = strings || 4;
  frets = frets || 12;
  return Fretboard({
    strings: strings,
    frets: frets,
    tuning: Tunings["bass" + strings].standard,
  });
}
