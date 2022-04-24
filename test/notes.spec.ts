import * as fs from 'fs';
import 'mocha';
import {expect} from 'chai';
import {Notes, colors} from '../src/note';

const notes = Notes.getNotes();

describe('Notes function test', () => {
  it('Exist an Notes object', () => {
    expect(notes).not.to.be.equal(null);
  });

  it('Notes.getNotes() returns the objects notes', () => {
    expect(Notes.getNotes()).to.be.equal(notes);
  });

  it('notes.addNote() on three cases: user exist, user doesn\'t exist, note title taken', () => {
    expect(notes.addNote('test', 'My test', 'This is a green test', colors.Green)).to.be.equal(`New note added!`);
    expect(notes.addNote('test', 'My test 2', 'This is a red test', colors.Red)).to.be.equal(`New note added!`);
    expect(notes.addNote('daniel', 'My test', 'This is a yellow test', colors.Yellow)).to.be.equal(`New note added!`);
    expect(notes.addNote('test', 'My test', 'This is a blue test', colors.Blue)).to.be.equal('Note title taken!');
  });

  it('notes.modifyNote() on three cases: user exist, user doesn\'t exist, note doesn\'t exist', () => {
    expect(notes.modifyNote('test', 'My test', 'This is a red test overwrited', colors.Red)).to.be.equal(`Note overwrited!`);
    expect(notes.modifyNote('test', 'Fail', 'This is a green test', colors.Green)).to.be.equal('Note title doesn\'t exist!');
    expect(notes.modifyNote('Fail', 'My test', 'This is a green test', colors.Green)).to.be.equal('Username doesn\'t exist!');
  });

  it('notes.removeNote() on two cases: user exist, user doesn\'t exist, note doesn\'t exist', () => {
    expect(notes.removeNote('daniel', 'My test')).to.be.equal('Note removed!');
    expect(notes.removeNote('Fail', 'Fail test')).to.be.equal(`Path note not found. Make sure that the user and the file name are correct, do not indicate the file extension .json`);
  });

  it('notes.listNotes() returns: test\nMy test\ntest\nMy test 2\n', () => {
    expect(notes.listNotes('test')).to.be.equal('My test\nMy test 2\n');
    expect(notes.listNotes('Fail')).to.be.equal(`That user doesn´t exist`);
  });

  it('notes.listNotes() on two cases: note found, note not found ', () => {
    expect(notes.readNote('test', 'My test')).to.be.equal('My test\nThis is a red test overwrited');
    expect(notes.readNote('Fail', 'Fail test')).to.be.equal('Note not found');
  });
});

fs.rmdirSync('./database', {recursive: true});