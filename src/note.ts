/* eslint-disable no-unused-vars */
import * as fs from 'fs';
import * as chalk from 'chalk';

/**
 * @enum colors Possible colors
 */
export enum colors {Red = "red", Green = "green", Blue = "blue", Yellow = "yellow"};

/**
 * Notes class to implement add, modify, delete, list and read functions at notes
 */
export class Notes {
    /**
     * @param notes Private attribute using the singleton pattern
     */
    private static notes: Notes;

    /**
     * Initialize attributes
     */
    private constructor() {}

    /**
     * During the first invocation of this method, the only instance of the Notes class is created
     * @returns Object Notes
     */
    public static getNotes(): Notes {
      if (!fs.existsSync(`./database`)) fs.mkdirSync(`./database`, {recursive: true});

      if (!Notes.notes) Notes.notes = new Notes();

      return Notes.notes;
    };

    /**
     * Add a user note in .json format, to our database
     * @param name Username
     * @param title Notes' title
     * @param body Body's title
     * @param color Color's note
     * @returns Informational message
     */
    addNote(name :string, title :string, body :string, color :colors): string {
      const note = `{ "title": "${title}", "body": "${body}" , "color": "${color}" }`;

      const titleJson = title.split(' ').join('');
      // If the path user exist
      if (fs.existsSync(`./database/${name}`)) {
        // If don't exist a title path yet
        if (!fs.existsSync(`./database/${name}/${titleJson}.json`)) {
          fs.writeFileSync(`./database/${name}/${titleJson}.json`, note);
          console.log(chalk.green(`New note added! (Title ${titleJson})`));
          return `New note added!`;
        }

        // If already exist this title path
        console.log(chalk.red('Note title taken!'));
        return 'Note title taken!';
      }

      // If the path user doesn't exist
      fs.mkdirSync(`./database/${name}`, {recursive: true});
      fs.writeFileSync(`./database/${name}/${titleJson}.json`, note);
      console.log(`New note added! (Title ${titleJson})`);
      return `New note added!`;
    }

    /**
     * Modify a user note in .json format, in our database
     * @param name Username
     * @param title Notes' title
     * @param body Body's title
     * @param color Color's note
     * @returns Informational message
     */
    modifyNote(name :string, title :string, body :string, color :colors): string {
      const note = `{ "title": "${title}", "body": "${body}" , "color": "${color}" }`;
      const titleJson = title.split(' ').join('');

      // If the path user exist
      if (fs.existsSync(`./database/${name}`)) {
        // If exist this title path
        if (fs.existsSync(`./database/${name}/${titleJson}.json`)) {
          fs.writeFileSync(`./database/${name}/${titleJson}.json`, note);
          console.log(chalk.green(`Note overwrited! (Title ${titleJson})`));
          return `Note overwrited!`;
        }

        // If doesn't exist this title path
        console.log(chalk.red('Note title doesn\'t exist!'));
        return 'Note title doesn\'t exist!';
      }

      // If the user doesn't exist
      console.log(chalk.red('Username doesn\'t exist!'));
      return 'Username doesn\'t exist!';
    };

    /**
     * Remove a user note in .json format, in our database
     * @param username Username
     * @param title Notes' title
     * @returns Informational message
     */
    removeNote(username :string, title :string) {
      const titleName = title.split(' ').join('');

      // If the path exist
      if (fs.existsSync(`./database/${username}/${titleName}.json`)) {
        fs.rmSync(`./database/${username}/${titleName}.json`);
        console.log(chalk.green('Note removed!'));
        return 'Note removed!';
      }

      // If the path doesn't exist
      console.log(chalk.red(`Path note not found. Make sure that the user and the file name are correct, do not indicate the file extension .json`));
      return `Path note not found. Make sure that the user and the file name are correct, do not indicate the file extension .json`;
    }

    /**
     * List all notes from a user
     * @param username Username
     * @returns Informational message
     */
    listNotes(username :string): string {
      let result: string = '';

      // If the path user exist
      if (fs.existsSync(`./database/${username}`)) {
        console.log('Your notes:');
        fs.readdirSync(`./database/${username}/`).forEach((note) => {
          const data = fs.readFileSync(`./database/${username}/${note}`);
          const JsonNote = JSON.parse(data.toString());
          console.log(chalk.keyword(JsonNote.color)(JsonNote.title));
          result += JsonNote.title + '\n';
        });
        return result;
      }

      // If the path user doesn't exist
      console.log(chalk.red(`That user doesn´t exist`));
      return `That user doesn´t exist`;
    }

    /**
     * Read a note from a specific path
     * @param username Username
     * @param title Notes' title
     * @returns Informational message
     */
    readNote(username :string, title :string) {
      const titleJson = title.split(' ').join('');

      // If the path exist
      if (fs.existsSync(`./database/${username}/${titleJson}.json`)) {
        const data = fs.readFileSync(`./database/${username}/${titleJson}.json`);
        const JsonNote = JSON.parse(data.toString());
        console.log(chalk.keyword(JsonNote.color)(JsonNote.title + '\n'));
        console.log(chalk.keyword(JsonNote.color)(JsonNote.body));
        return JsonNote.title + '\n' + JsonNote.body;
      }

      // If the path doesn't exist
      console.log(chalk.red('Note not found'));
      return 'Note not found';
    }
}