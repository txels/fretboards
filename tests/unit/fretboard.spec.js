import * as fretboard from "@/index";

describe("Music scales", () => {
  let sut;

  describe("asOffset", () => {
    it("c is 0", () => {
      expect(fretboard.asOffset("c")).toEqual(0);
    });

    it("ignores case", () => {
      expect(fretboard.asOffset("C")).toEqual(0);
    });

    it("Eb is 3", () => {
      expect(fretboard.asOffset("Eb")).toEqual(3);
    });
  });

  describe("absNote", () => {
    it("c2 is 24", () => {
      expect(fretboard.absNote("c2")).toEqual(24);
    });

    it("e3 is 40", () => {
      expect(fretboard.absNote("e3")).toEqual(40);
    });
  });

  describe("asNotes generates a scale", () => {
    it("reference C scale are predefined", () => {
      expect(fretboard.asNotes("c major")).toEqual("c d e f g a b");
      expect(fretboard.asNotes("c lydian")).toEqual("c d e f# g a b");
    });

    it("on other roots, it transposes", () => {
      expect(fretboard.asNotes("g major")).toEqual("g a b c d e f#");
      expect(fretboard.asNotes("a major")).toEqual("a b c# d e f# g#");
    });

    it("also works for altered roots", () => {
      // we do not expect enharmonization to be correct ATM,
      // all alterations are computed as sharps
      expect(fretboard.asNotes("ab major")).toEqual("g# a# c c# d# f g");
      expect(fretboard.asNotes("g# major")).toEqual("g# a# c c# d# f g");
    });
  });

  describe("auto-detect what to draw", () => {
    it("a scale/chord", () => {
      expect(fretboard.whatIs("a major")).toEqual("scale");
      expect(fretboard.whatIs("eb 7")).toEqual("scale");
    });

    it("notes by name", () => {
      expect(fretboard.whatIs("a b")).toEqual("addNotes");
      expect(fretboard.whatIs("c# d# f g a#")).toEqual("addNotes");
    });

    it("specifically placed notes", () => {
      expect(fretboard.whatIs("5:c3 4:e3 3:bb3 2:d4 1:g4")).toEqual(
        "placeNotes"
      );
    });
  });
});

describe("instrument helper factories", () => {
  it("6-string guitar is the default", () => {
    let g = fretboard.Guitar();
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
