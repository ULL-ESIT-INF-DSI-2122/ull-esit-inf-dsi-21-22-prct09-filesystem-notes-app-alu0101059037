"use strict";
exports.__esModule = true;
exports.Notes = exports.colors = void 0;
/* eslint-disable no-unused-vars */
var fs = require("fs");
var chalk = require("chalk");
/**
 * @enum colors Possible colors
 */
var colors;
(function (colors) {
    colors["Red"] = "red";
    colors["Green"] = "green";
    colors["Blue"] = "blue";
    colors["Yellow"] = "yellow";
})(colors = exports.colors || (exports.colors = {}));
;
/**
 * Notes class to implement add, modify, delete, list and read functions at notes
 */
var Notes = /** @class */ (function () {
    /**
     * Initialize attributes
     */
    function Notes() {
    }
    /**
     * During the first invocation of this method, the only instance of the Notes class is created
     * @returns Object Notes
     */
    Notes.getNotes = function () {
        if (!fs.existsSync("./database"))
            fs.mkdirSync("./database", { recursive: true });
        if (!Notes.notes)
            Notes.notes = new Notes();
        return Notes.notes;
    };
    ;
    /**
     * Add a user note in .json format, to our database
     * @param name Username
     * @param title Notes' title
     * @param body Body's title
     * @param color Color's note
     * @returns Informational message
     */
    Notes.prototype.addNote = function (name, title, body, color) {
        var note = "{ \"title\": \"".concat(title, "\", \"body\": \"").concat(body, "\" , \"color\": \"").concat(color, "\" }");
        var titleJson = title.split(' ').join('');
        // If the path user exist
        if (fs.existsSync("./database/".concat(name))) {
            // If don't exist a title path yet
            if (!fs.existsSync("./database/".concat(name, "/").concat(titleJson, ".json"))) {
                fs.writeFileSync("./database/".concat(name, "/").concat(titleJson, ".json"), note);
                console.log(chalk.green("New note added! (Title ".concat(titleJson, ")")));
                return "New note added!";
            }
            // If already exist this title path
            console.log(chalk.red('Note title taken!'));
            return 'Note title taken!';
        }
        // If the path user doesn't exist
        fs.mkdirSync("./database/".concat(name), { recursive: true });
        fs.writeFileSync("./database/".concat(name, "/").concat(titleJson, ".json"), note);
        console.log("New note added! (Title ".concat(titleJson, ")"));
        return "New note added!";
    };
    /**
     * Modify a user note in .json format, in our database
     * @param name Username
     * @param title Notes' title
     * @param body Body's title
     * @param color Color's note
     * @returns Informational message
     */
    Notes.prototype.modifyNote = function (name, title, body, color) {
        var note = "{ \"title\": \"".concat(title, "\", \"body\": \"").concat(body, "\" , \"color\": \"").concat(color, "\" }");
        var titleJson = title.split(' ').join('');
        // If the path user exist
        if (fs.existsSync("./database/".concat(name))) {
            // If exist this title path
            if (fs.existsSync("./database/".concat(name, "/").concat(titleJson, ".json"))) {
                fs.writeFileSync("./database/".concat(name, "/").concat(titleJson, ".json"), note);
                console.log(chalk.green("Note overwrited! (Title ".concat(titleJson, ")")));
                return "Note overwrited!";
            }
            // If doesn't exist this title path
            console.log(chalk.red('Note title doesn\'t exist!'));
            return 'Note title doesn\'t exist!';
        }
        // If the user doesn't exist
        console.log(chalk.red('Username doesn\'t exist!'));
        return 'Username doesn\'t exist!';
    };
    ;
    /**
     * Remove a user note in .json format, in our database
     * @param username Username
     * @param title Notes' title
     * @returns Informational message
     */
    Notes.prototype.removeNote = function (username, title) {
        var titleName = title.split(' ').join('');
        // If the path exist
        if (fs.existsSync("./database/".concat(username, "/").concat(titleName, ".json"))) {
            fs.rmSync("./database/".concat(username, "/").concat(titleName, ".json"));
            console.log(chalk.green('Note removed!'));
            return 'Note removed!';
        }
        // If the path doesn't exist
        console.log(chalk.red("Path note not found. Make sure that the user and the file name are correct, do not indicate the file extension .json"));
        return "Path note not found. Make sure that the user and the file name are correct, do not indicate the file extension .json";
    };
    /**
     * List all notes from a user
     * @param username Username
     * @returns Informational message
     */
    Notes.prototype.listNotes = function (username) {
        var result = '';
        // If the path user exist
        if (fs.existsSync("./database/".concat(username))) {
            console.log('Your notes:');
            fs.readdirSync("./database/".concat(username, "/")).forEach(function (note) {
                var data = fs.readFileSync("./database/".concat(username, "/").concat(note));
                var JsonNote = JSON.parse(data.toString());
                console.log(chalk.keyword(JsonNote.color)(JsonNote.title));
                result += JsonNote.title + '\n';
            });
            return result;
        }
        // If the path user doesn't exist
        console.log(chalk.red("That user doesn\u00B4t exist"));
        return "That user doesn\u00B4t exist";
    };
    /**
     * Read a note from a specific path
     * @param username Username
     * @param title Notes' title
     * @returns Informational message
     */
    Notes.prototype.readNote = function (username, title) {
        var titleJson = title.split(' ').join('');
        // If the path exist
        if (fs.existsSync("./database/".concat(username, "/").concat(titleJson, ".json"))) {
            var data = fs.readFileSync("./database/".concat(username, "/").concat(titleJson, ".json"));
            var JsonNote = JSON.parse(data.toString());
            console.log(chalk.keyword(JsonNote.color)(JsonNote.title + '\n'));
            console.log(chalk.keyword(JsonNote.color)(JsonNote.body));
            return JsonNote.title + '\n' + JsonNote.body;
        }
        // If the path doesn't exist
        console.log(chalk.red('Note not found'));
        return 'Note not found';
    };
    return Notes;
}());
exports.Notes = Notes;
