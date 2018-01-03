// Music
var allNotes = ["c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b"];
var allNotesEnh = ["b#", "db", "d", "eb", "e", "e#", "gb", "g", "ab", "a", "bb", "b"];
var colors = ["red", "black", "blue", "green", "purple", "gray", "orange", "lightgray"];

var Scales = {
    // scales
    lydian: "c d e f# g a b",
    major: "c d e f g a b",
    mixolydian: "c d e f g a bb",
    dorian: "c d eb f g a bb",
    aeolian: "c d eb f g ab bb",
    phrygian: "c db eb f g ab bb",
    locrian: "c db eb f gb ab bb",
    "minor-pentatonic": "c eb f g bb",
    "minor-blues": "c eb f f# g bb",
    "major-pentatonic": "c d e g a",
    "major-blues": "c d d# e g a",
    "dom-pentatonic": "c e f g bb",
    // chords
    maj: "c e g",
    min: "c eb g",
    dim: "c eb gb",
    maj7: "c e g b",
    7: "c e g bb",
    min7: "c eb g bb",
    m7b5: "c eb gb bb",
    dim7: "c eb gb a",
    _: function(scale) { return Scales[scale].split(" "); },
};


function asOffset(note) {
    note = note.toLowerCase();
    var offset = allNotes.indexOf(note);
    if(offset === -1) {
        offset = allNotesEnh.indexOf(note);
    }
    return offset;
}


function absNote(note) {
    var octave = note[note.length - 1];
    var pitch = asOffset(note.slice(0, -1));
    if (pitch > -1) {
        return pitch + octave * 12;
    }
}


function asNotes(scale) {
    let [root, type] = scale.split(" ");
    var scaleInC = Scales._(type);
    var shift = allNotes.indexOf(root); 
    var scaleTransposed = scaleInC.map(function(note) {
        return allNotes[(asOffset(note) + shift) % 12];
    });
    return scaleTransposed.join(" ");
}


// Fretboard
var TUNING_E_4ths = ["e2", "a2", "d3", "g3", "c4", "f4"];
var TUNING_E_std = ["e2", "a2", "d3", "g3", "b3", "e4"];
var TUNING_G_open = ["d2", "g2", "d3", "g3", "b4", "d4"];

var Fretboard = {
    frets: 17,
    strings: 6,
    tuning: TUNING_E_4ths,
    fretWidth: 50,
    fretHeight: 20,
    fretsWithDots: function () {
        var allDots = [3, 5, 7, 9, 15, 17, 19, 21];
        return allDots.filter(function(v) { return v <= Fretboard.frets; });
    },
    fretsWithDoubleDots: function () {
        var allDots = [12, 24];
        return allDots.filter(function(v) { return v <= Fretboard.frets; });
    },
    fretboardHeight: function () { return (this.strings - 1) * this.fretHeight + 2; },
    fretboardWidth: function() { return this.frets * this.fretWidth + 2; },
    XMARGIN: function() { return this.fretWidth; },
    YMARGIN: function() { return this.fretHeight / 2; },
};


var svgContainer = d3
    .select("body")
    .append("svg")
    .attr("width", Fretboard.fretboardWidth() + Fretboard.XMARGIN())
    .attr("height", Fretboard.fretboardHeight() + Fretboard.YMARGIN() * 2);

d3.select("body").append("p").text("Tuning:");


function drawFrets() {
    for(i=0; i<=Fretboard.frets; i++) {
        svgContainer
            .append("line")
            .attr("x1", i * Fretboard.fretWidth + 1 + Fretboard.XMARGIN())
            .attr("y1", Fretboard.YMARGIN())
            .attr("x2", i * Fretboard.fretWidth + 1 + Fretboard.XMARGIN())
            .attr("y2", Fretboard.YMARGIN() + Fretboard.fretboardHeight())
            .attr("stroke", "lightgray")
            .attr("stroke-width", i==0? 8:2)
            ;
    }
}


function drawStrings() {
    for(i=0; i<Fretboard.strings; i++) {
        svgContainer
            .append("line")
            .attr("x1", Fretboard.XMARGIN())
            .attr("y1", i * Fretboard.fretHeight + 1 + Fretboard.YMARGIN())
            .attr("x2", Fretboard.XMARGIN() + Fretboard.fretboardWidth())
            .attr("y2", i * Fretboard.fretHeight + 1 + Fretboard.YMARGIN())
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            ;
    }
}


function drawDots() {
    var p = svgContainer
        .selectAll("circle")
        .data(Fretboard.fretsWithDots());

    p.enter()
        .append("circle")
        .attr("cx", function(d) { return (d - 1) * Fretboard.fretWidth + Fretboard.fretWidth/2 + Fretboard.XMARGIN(); })
        .attr("cy", Fretboard.fretboardHeight()/2 + Fretboard.YMARGIN())
        .attr("r", 4).style("fill", "#ddd");

    var p = svgContainer
        .selectAll(".octave")
        .data(Fretboard.fretsWithDoubleDots);

    p.enter()
        .append("circle")
        .attr("class", "octave")
        .attr("cx", function(d) { return (d - 1) * Fretboard.fretWidth + Fretboard.fretWidth/2 + Fretboard.XMARGIN(); })
        .attr("cy", Fretboard.fretHeight * 3/2 + Fretboard.YMARGIN())
        .attr("r", 4).style("fill", "#ddd");
    p.enter()
        .append("circle")
        .attr("class", "octave")
        .attr("cx", function(d) { return (d - 1) * Fretboard.fretWidth + Fretboard.fretWidth/2 + Fretboard.XMARGIN(); })
        .attr("cy", Fretboard.fretHeight * 7/2 + Fretboard.YMARGIN())
        .attr("r", 4).style("fill", "#ddd");
}


function drawFretboard() {
    d3.selectAll("p")
      .text("Tuning: " + Fretboard.tuning.join(" ").toUpperCase());
    drawFrets();
    drawStrings();
    drawDots();
}


drawFretboard();


function drawNoteOnString(absPitch, string, color) {
    color = color || "black";
    var absString = (Fretboard.strings - string);
    var basePitch = absNote(Fretboard.tuning[absString]);
    if((absPitch >= basePitch) && (absPitch <= basePitch + Fretboard.frets)) {
        svgContainer
            .append("circle")
            .attr("class", "note")
            .attr("stroke-width", 2)
            .attr("cx", (absPitch - basePitch) * Fretboard.fretWidth + Fretboard.fretWidth/1.5)
            .attr("cy", (string - 1) * Fretboard.fretHeight + 1 + Fretboard.YMARGIN())
            .attr("r", 6).style("stroke", color).style("fill", "white");
    }
}


function drawNote(note, color) {
    var absPitch = absNote(note);
    for(string=1; string<=Fretboard.strings; string++) {
        drawNoteOnString(absPitch, string, color);
    }
}


function notes(notes) {
    var allNotes = notes.split(" ");
    for (i=0; i<allNotes.length; i++) {
        var color = colors[i];
        var note = allNotes[i];
        for (octave=2; octave<7; octave++) {
            drawNote(note + octave, color);
        }
    }
}


function scale(scaleName) {
    reset();
    notes(asNotes(scaleName));
}


function resetNotes() {
    svgContainer
        .selectAll(".note")
        .remove();
}


function reset() {
    svgContainer
        .selectAll("line")
        .remove();
    svgContainer
        .selectAll("circle")
        .remove();
    drawFretboard();
}

