// Music
var allNotes = [
    "c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b"
];
var allNotesEnh = [
    "c", "db", "d", "eb", "e", "f", "gb", "g", "ab", "a", "bb", "b"
];
var colors = ["red", "green", "blue", "black", "purple", "gray", "orange", "lightgray"];

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
    _: function(scale) { return Scales[scale].split(" "); },
};


function whatIs(sequence) {
    let sections = sequence.split(" ");
    if (sections.length === 2 && typeof Scales[sections[1]] == "string") {
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
    var offset = asOffset(root);
    var scaleTransposed = scaleInC.map(function(note) {
        return allNotes[(asOffset(note) + offset) % 12];
    });
    return scaleTransposed.join(" ");
}

var verbatim = function(d) { return d; };


// Fretboard
var Tunings = {
    bass4: {
        standard: ["e1", "a1", "d2", "g2", "b2", "e3"]
    },
    guitar6: {
        standard: ["e2", "a2", "d3", "g3", "b3", "e4"],
        E_4ths: ["e2", "a2", "d3", "g3", "c4", "f4"],
        Drop_D: ["d2", "a2", "d3", "g3", "b3", "e4"],
        G_open: ["d2", "g2", "d3", "g3", "b4", "d4"]
    },
    guitar7: {
        standard: ["b2", "e2", "a2", "d3", "g3", "b3", "e4"],
        E_4ths: ["b2", "e2", "a2", "d3", "g3", "c3", "f4"]
    }
};


var Fretboard = function(config) {
    config = config || {};
    var where = config.where || "body";

    var id = "fretboard-" + Math.floor(Math.random() * 1000000);

    var instance = {
        frets: config.frets || 12,
        strings: config.strings || 6,
        tuning: config.tuning || Tunings.guitar6.E_4ths,
        fretWidth: 50,
        fretHeight: 20
    };

    var fretsWithDots = function () {
        var allDots = [3, 5, 7, 9, 15, 17, 19, 21];
        return allDots.filter(function(v) { return v <= instance.frets; });
    };

    var fretsWithDoubleDots = function () {
        var allDots = [12, 24];
        return allDots.filter(function(v) { return v <= instance.frets; });
    };

    var fretboardHeight = function () {
        return (instance.strings - 1) * instance.fretHeight + 2;
    };

    var fretboardWidth = function() {
        return instance.frets * instance.fretWidth + 2;
    };

    var XMARGIN = function() { return instance.fretWidth; };
    var YMARGIN = function() { return instance.fretHeight; };

    var makeContainer = function(elem) {
        return d3
            .select(elem)
            .append("div")
            .attr("class", "fretboard")
            .attr("id", id)
            .append("svg")
            .attr("width", fretboardWidth() + XMARGIN() * 2)
            .attr("height", fretboardHeight() + YMARGIN() * 2);
    };

    var drawFrets = function() {
        for(var i=0; i<=instance.frets; i++) {
            let x = i * instance.fretWidth + 1 + XMARGIN();
            instance.svgContainer
                .append("line")
                .attr("x1", x)
                .attr("y1", YMARGIN())
                .attr("x2", x)
                .attr("y2", YMARGIN() + fretboardHeight())
                .attr("stroke", "lightgray")
                .attr("stroke-width", i==0? 8:2);
            d3.select("#" + id)
                .append("p")
                .attr("class", "fretnum")
                .style("top", (fretboardHeight() + YMARGIN() + 5) + "px")
                .style("left", x - 4 + "px")
                .text(i)
                ;
        }
    }


    var drawStrings = function() {
        for(var i=0; i<instance.strings; i++) {
            instance.svgContainer
                .append("line")
                .attr("x1", XMARGIN())
                .attr("y1", i * instance.fretHeight + 1 + YMARGIN())
                .attr("x2", XMARGIN() + fretboardWidth())
                .attr("y2", i * instance.fretHeight + 1 + YMARGIN())
                .attr("stroke", "black")
                .attr("stroke-width", 1)
                ;
        }
        var placeTuning = function(d, i) {
            return (instance.strings - i) * instance.fretHeight - 5 + "px";
        };
        d3.select("#" + id)
            .selectAll(".tuning")
            .data(instance.tuning.slice(0, instance.strings))
            .style("top", placeTuning)
            .text(verbatim)
            .enter()
            .append("p")
            .attr("class", "tuning")
            .style("top", placeTuning)
            .text(verbatim)
            ;
    };


    var drawDots = function() {

        var p = instance.svgContainer
            .selectAll("circle")
            .data(fretsWithDots());

        function dotX(d) {
            return (d - 1) * instance.fretWidth + instance.fretWidth/2 + XMARGIN();
        }

        function dotY(ylocation) { 
            let margin = YMARGIN();

            if(instance.strings % 2 == 0) {

                return ((instance.strings + 3)/2 - ylocation) * instance.fretHeight + margin;
            } else {
                return fretboardHeight() * ylocation/4 + margin;
            }
        }

        p.enter()
            .append("circle")
            .attr("cx", dotX)
            .attr("cy", dotY(2))
            .attr("r", 4).style("fill", "#ddd");

        var p = instance.svgContainer
            .selectAll(".octave")
            .data(fretsWithDoubleDots);

        p.enter()
            .append("circle")
            .attr("class", "octave")
            .attr("cx", dotX)
            .attr("cy", dotY(3))
            .attr("r", 4).style("fill", "#ddd");
        p.enter()
            .append("circle")
            .attr("class", "octave")
            .attr("cx", dotX)
            .attr("cy", dotY(1))
            .attr("r", 4).style("fill", "#ddd");
    };


    instance.svgContainer = makeContainer(where);

    instance.drawBoard = function() {
        drawFrets();
        drawDots();
        drawStrings();
        return instance;
    };


    // Notes on fretboard

    instance.addNoteOnString = function(note, string, color) {
        var absPitch = absNote(note);
        color = color || "black";
        var absString = (instance.strings - string);
        var basePitch = absNote(instance.tuning[absString]);
        if((absPitch >= basePitch) && (absPitch <= basePitch + instance.frets)) {
            instance.svgContainer
                .append("circle")
                .attr("class", "note")
                .attr("stroke-width", 1)
                // 0.75 is the offset into the fret (higher is closest to fret)
                .attr("cx", (absPitch - basePitch + 0.75) * instance.fretWidth)
                .attr("cy", (string - 1) * instance.fretHeight + 1 + YMARGIN())
                .attr("r", 6).style("stroke", color).style("fill", "white")
                .on("click", function(d) {
                    let fill = this.style.fill;
                    this.setAttribute("stroke-width", 5 - parseInt(this.getAttribute("stroke-width")));
                    this.style.fill = fill == "white"? "lightgray" : "white";
                })
                    .append("title").text(note.toUpperCase())
                ;
        }
        return instance;
    };


    instance.addNote = function(note, color) {
        for(var string=1; string<=instance.strings; string++) {
            instance.addNoteOnString(note, string, color);
        }

        return instance;
    };


    instance.addNotes = function(notes, color) {
        var allNotes = notes.split(" ");
        for (var i=0; i<allNotes.length; i++) {
            var showColor = color || colors[i];
            var note = allNotes[i];
            for (var octave=1; octave<7; octave++) {
                instance.addNote(note + octave, showColor);
            }
        }

        return instance;
    };


    instance.scale = function(scaleName) {
        instance.clear();
        instance.addNotes(asNotes(scaleName));

        return instance;
    };


    instance.placeNotes = function(sequence) {
        // Sequence of string:note
        // e.g. "6:g2 5:b2 4:d3 3:g3 2:d4 1:g4"
        let pairs = sequence.split(" ");
        pairs.forEach(function(pair, i) {
            let [string, note] = pair.split(":");
            string = parseInt(string);
            instance.addNoteOnString(note, string, i==0? "red" : "black");
        });

        return instance;
    };


    instance.drawNotes = function(something) {
        let sections = something.split(";");
        sections.forEach(function(section) {
            section = section.trim();
            let what = whatIs(section);
            instance[what](section);
        });
    };


    instance.clearNotes = function() {
        instance.svgContainer
            .selectAll(".note")
            .remove();

        return instance;
    };


    instance.clear = function() {
        d3.select("#" + id).selectAll(".fretnum,.tuning").remove();
        instance.svgContainer
            .selectAll("line")
            .remove();
        instance.svgContainer
            .selectAll("circle")
            .remove();
        instance.drawBoard();

        return instance;
    };

    instance.delete = function() {
        d3.select("#" + id).remove();
    };

    return instance.drawBoard();
};


Fretboard.drawAll = function(selector) {
    let fretboards = document.querySelectorAll(selector);

    fretboards.forEach(function(e) {
        let frets = parseInt(e.dataset["frets"]) || 8;
        let notes = e.dataset["notes"];
        let fretboard = Fretboard({frets: frets, where: e});
        if (notes) {
            fretboard.drawNotes(notes);
        }
    });
};


function Guitar(strings, frets) {
    strings = strings || 6;
    frets = frets || 12;
    return Fretboard({
        strings: strings,
        frets: frets,
        tuning: Tunings["guitar" + strings].standard
    });
}

function Bass(strings, frets) {
    strings = strings || 4;
    frets = frets || 12;
    return Fretboard({
        strings: strings,
        frets: frets,
        tuning: Tunings["bass" + strings].standard
    });
}
