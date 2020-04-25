import * as fretboard from "@/index";

describe("instrument helper factories", () => {
  it("6-string guitar is the default", () => {
    let g = fretboard.Fretboard();
    expect(g.strings).toEqual(6);
    expect(g.frets).toEqual(12);
    expect(g.tuning).toEqual(fretboard.Tunings.guitar6.standard);
  });

  it("7-string guitar", () => {
    let g = fretboard.Guitar(7);
    expect(g.strings).toEqual(7);
    expect(g.frets).toEqual(12);
    expect(g.tuning).toEqual(fretboard.Tunings.guitar7.standard);
  });

  it("bass", () => {
    let b = fretboard.Bass();
    expect(b.strings).toEqual(4);
    expect(b.frets).toEqual(12);
    expect(b.tuning).toEqual(fretboard.Tunings.bass4.standard);
  });
});

describe("dynamic behavior", () => {
  it("added notes are accumulated", () => {
    let fb = fretboard.Fretboard();

    fb.addNoteOnString("g2", 6, "black");
    fb.addNoteOnString("b2", 5);
    fb.add("3:a3");

    expect(fb.getNotes()).toEqual([
      { string: 6, note: "g2", color: "black" },
      { string: 5, note: "b2", color: undefined },
      { string: 3, note: "a3", color: undefined },
    ]);
  });

  it("notes can be cleared", () => {
    let fb = fretboard.Fretboard();
    fb.add("4:f3 3:a3");

    fb.clearNotes();

    expect(fb.getNotes()).toEqual([]);
  });
});
