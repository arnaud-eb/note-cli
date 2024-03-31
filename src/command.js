import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import {
  findNotes,
  getAllNotes,
  newNote,
  removeAllNotes,
  removeNote,
} from "./notes.js";
import { listNotes } from "./utils.js";

yargs(hideBin(process.argv)) //hidebin removes the 2 first entries in argv array
  .command(
    "new <note>", //angle brackets means it's required
    "create a new note",
    (yargs) => {
      return yargs.positional("note", {
        type: "string",
        description: "the content of the note to create",
      });
    },
    async (argv) => {
      const tags = argv.tags ? argv.tags.split(",") : [];
      const note = await newNote(argv.note, tags);
      console.log("New note! ", note);
    }
  )
  .option("tags", {
    alias: "t",
    type: "string",
    description: "tags to add to the note",
  })
  .command(
    "all",
    "get all notes",
    () => {},
    async () => {
      const notes = await getAllNotes();
      listNotes(notes);
    }
  )
  .command(
    "find <filter>", //angle brackets means it's required
    "get matching notes",
    (yargs) => {
      return yargs.positional("filter", {
        type: "string",
        description:
          "the search term to filter notes by, will be applied to note.content",
      });
    },
    async (argv) => {
      const { filter } = argv;
      const matches = await findNotes(filter);
      listNotes(matches);
    }
  )
  .command(
    "remove <id>", //angle brackets means it's required
    "remove a note by id",
    (yargs) => {
      return yargs.positional("id", {
        type: "number",
        description: "the id of the note you want to remove",
      });
    },
    async (argv) => {
      const id = await removeNote(argv.id);
      console.log(id);
    }
  )
  .command(
    "web [port]", //square brackets means it's optional - there is a default in case you do not pass it
    "launch website to see notes",
    (yargs) => {
      return yargs.positional("port", {
        type: "number",
        describe: "port to bind on",
        default: 5000,
      });
    },
    (argv) => {}
  )
  .command(
    "clean",
    "remove all notes",
    () => {},
    async () => {
      await removeAllNotes();
      console.log("DB reseted!");
    }
  )
  .demandCommand(1) //you cannot run our note cli without at least one command
  .parse();
