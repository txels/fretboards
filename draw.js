var FRETS = 17;
var STRINGS = 6;
var fretWidth = 50;
var fretHeight = 20;
var fretboardHeight = (STRINGS - 1) * fretHeight + 2;
var fretboardWidth = FRETS * fretWidth + 2;
var fretsWithDots = [3, 5, 7, 9, 15, 17];
var fretsWithDoubleDots = [12];
var XMARGIN = fretWidth;
var YMARGIN = fretHeight / 2;

var tuning = ["e2", "a2", "d3", "g3", "c4", "f4"];
var allNotes = ["c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b"];
var allNotesFlats = ["c", "db", "d", "eb", "e", "f", "gb", "g", "ab", "a", "bb", "b"];


var svgContainer = d3
    .select("body")
    .append("svg")
    .attr("width", fretboardWidth + XMARGIN)
    .attr("height", fretboardHeight + YMARGIN * 2);


function drawFrets() {
    for(i=0; i<=FRETS; i++) {
        svgContainer
            .append("line")
            .attr("x1", i * fretWidth + 1 + XMARGIN)
            .attr("y1", YMARGIN)
            .attr("x2", i * fretWidth + 1 + XMARGIN)
            .attr("y2", YMARGIN + fretboardHeight)
            .attr("stroke", "lightgray")
            .attr("stroke-width", i==0? 8:2)
            ;
    }
}


function drawStrings() {
    for(i=0; i<STRINGS; i++) {
        svgContainer
            .append("line")
            .attr("x1", XMARGIN)
            .attr("y1", i * fretHeight + 1 + YMARGIN)
            .attr("x2", XMARGIN + fretboardWidth)
            .attr("y2", i * fretHeight + 1 + YMARGIN)
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            ;
    }
}


function drawDots() {
    var p = svgContainer
        .selectAll("circle")
        .data(fretsWithDots);

    p.enter()
        .append("circle")
        .attr("cx", function(d) { return (d - 1) * fretWidth + fretWidth/2 + XMARGIN; })
        .attr("cy", fretboardHeight/2 + YMARGIN)
        .attr("r", 4).style("fill", "#ddd");

    var p = svgContainer
        .selectAll(".octave")
        .data(fretsWithDoubleDots);

    p.enter()
        .append("circle")
        .attr("class", "octave")
        .attr("cx", function(d) { return (d - 1) * fretWidth + fretWidth/2 + XMARGIN; })
        .attr("cy", fretHeight * 3/2 + YMARGIN)
        .attr("r", 4).style("fill", "#ddd");
    p.enter()
        .append("circle")
        .attr("class", "octave")
        .attr("cx", function(d) { return (d - 1) * fretWidth + fretWidth/2 + XMARGIN; })
        .attr("cy", fretHeight * 7/2 + YMARGIN)
        .attr("r", 4).style("fill", "#ddd");
}


function drawFretboard() {
    drawFrets();
    drawStrings();
    drawDots();
}


drawFretboard();


function absNote(note) {
    note = note.toLowerCase();
    var octave = note[note.length - 1];
    var pitch = note.slice(0, -1);
    var absPitch = allNotes.indexOf(pitch);
    if(absPitch === -1) {
        absPitch = allNotesFlats.indexOf(pitch);
    }
    if (absPitch > -1) {
        return absPitch + octave * 12;
    }
}


function drawNoteOnString(absPitch, string, color) {
    color = color || "black";
    var absString = (STRINGS - string);
    var basePitch = absNote(tuning[absString]);
    if((absPitch >= basePitch) && (absPitch <= basePitch + FRETS)) {
        svgContainer
            .append("circle")
            .attr("class", "note")
            .attr("cx", (absPitch - basePitch) * fretWidth + fretWidth/1.5)
            .attr("cy", (string - 1) * fretHeight + YMARGIN)
            .attr("r", 6).style("stroke", color).style("fill", "white");
    }
}


function drawNote(note, color) {
    var absPitch = absNote(note);
    for(string=1; string<=STRINGS; string++) {
        drawNoteOnString(absPitch, string, color);
    }
}


function draw(notes) {
    var allNotes = notes.split(" ");
    for (i=0; i<allNotes.length; i++) {
        var color = i==0? "red" : "black";
        var note = allNotes[i];
        for (octave=2; octave<7; octave++) {
            drawNote(note + octave, color);
        }
    }
}


function scale(root, type) {

}


function reset() {
    svgContainer
        .selectAll(".note")
        .remove();
}

