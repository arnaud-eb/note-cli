import { jest } from "@jest/globals";

jest.unstable_mockModule("../src/db.js", () => ({
  getDB: jest.fn(),
  saveDB: jest.fn(),
  insertDB: jest.fn(),
}));

const { insertDB, getDB, saveDB } = await import("../src/db.js");
const { newNote, getAllNotes, removeNote } = await import("../src/notes.js");

beforeEach(() => {
  insertDB.mockClear();
  getDB.mockClear();
  saveDB.mockClear();
});

describe("note cli", () => {
  test("newNote inserts data and returns it", async () => {
    const content = "Test note";
    const tags = ["tag1", "tag2"];
    const note = {
      tags,
      id: Date.now(),
      content,
    };

    insertDB.mockResolvedValue(note);

    const result = await newNote(content, tags);
    // expect(result).toEqual(note); //not a strict equality check (same object in memory)
    expect(result).toBe(note); //strict equality check (same object in memory)
  });

  test("getAllNotes returns all notes", async () => {
    const db = {
      notes: [{ content: "note1" }, { content: "note2" }],
    };
    getDB.mockResolvedValue(db);

    const result = await getAllNotes();
    expect(result).toEqual(db.notes);
  });

  test("removeNote removes a note by id", async () => {
    const db = {
      notes: [
        { id: 1, content: "note1" },
        { id: 2, content: "note2" },
      ],
    };
    getDB.mockResolvedValue(db);

    const idToRemove = 1;
    const result = await removeNote(idToRemove);
    expect(result).toBe(idToRemove);
    expect(saveDB).toHaveBeenCalledWith({ notes: [db.notes[1]] });
  });

  test("removeNote does nothing if id is not found", async () => {
    const db = {
      notes: [
        { id: 1, content: "note1" },
        { id: 2, content: "note2" },
      ],
    };
    getDB.mockResolvedValue(db);

    const idToRemove = 4;
    const result = await removeNote(idToRemove);
    expect(result).toBeUndefined();
  });
});
