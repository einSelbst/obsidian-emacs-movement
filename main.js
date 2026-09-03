"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => EmacsMovementPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");

// src/movement.ts
var wordCharacter = /[\p{L}\p{N}_]/u;
function forwardWord(editor) {
  setCursor(editor, findForwardWord(editor, editor.getCursor()));
}
function backwardWord(editor) {
  setCursor(editor, findBackwardWord(editor, editor.getCursor()));
}
function beginningOfLine(editor) {
  const cursor = editor.getCursor();
  setCursor(editor, { line: cursor.line, ch: 0 });
}
function endOfLine(editor) {
  const cursor = editor.getCursor();
  setCursor(editor, { line: cursor.line, ch: editor.getLine(cursor.line).length });
}
function forwardCharacter(editor) {
  const cursor = editor.getCursor();
  const line = editor.getLine(cursor.line);
  if (cursor.ch < line.length) {
    setCursor(editor, { line: cursor.line, ch: cursor.ch + 1 });
    return;
  }
  if (cursor.line < editor.lineCount() - 1) {
    setCursor(editor, { line: cursor.line + 1, ch: 0 });
  }
}
function backwardCharacter(editor) {
  const cursor = editor.getCursor();
  if (cursor.ch > 0) {
    setCursor(editor, { line: cursor.line, ch: cursor.ch - 1 });
    return;
  }
  if (cursor.line > 0) {
    const previousLine2 = cursor.line - 1;
    setCursor(editor, { line: previousLine2, ch: editor.getLine(previousLine2).length });
  }
}
function previousLine(editor) {
  moveLine(editor, -1);
}
function nextLine(editor) {
  moveLine(editor, 1);
}
function moveLine(editor, delta) {
  const cursor = editor.getCursor();
  const line = clamp(cursor.line + delta, 0, editor.lineCount() - 1);
  setCursor(editor, { line, ch: clamp(cursor.ch, 0, editor.getLine(line).length) });
}
function findForwardWord(editor, start) {
  const cursor = copyPosition(start);
  while (!atDocumentEnd(editor, cursor) && isWordAt(editor, cursor)) {
    advance(editor, cursor);
  }
  while (!atDocumentEnd(editor, cursor) && !isWordAt(editor, cursor)) {
    advance(editor, cursor);
  }
  while (!atDocumentEnd(editor, cursor) && isWordAt(editor, cursor)) {
    advance(editor, cursor);
  }
  return cursor;
}
function findBackwardWord(editor, start) {
  const cursor = copyPosition(start);
  while (!atDocumentStart(cursor) && !isWordBefore(editor, cursor)) {
    retreat(editor, cursor);
  }
  while (!atDocumentStart(cursor) && isWordBefore(editor, cursor)) {
    retreat(editor, cursor);
  }
  return cursor;
}
function advance(editor, cursor) {
  const line = editor.getLine(cursor.line);
  if (cursor.ch < line.length) {
    cursor.ch += 1;
    return;
  }
  if (cursor.line < editor.lineCount() - 1) {
    cursor.line += 1;
    cursor.ch = 0;
  }
}
function retreat(editor, cursor) {
  if (cursor.ch > 0) {
    cursor.ch -= 1;
    return;
  }
  if (cursor.line > 0) {
    cursor.line -= 1;
    cursor.ch = editor.getLine(cursor.line).length;
  }
}
function isWordAt(editor, cursor) {
  const line = editor.getLine(cursor.line);
  return cursor.ch < line.length && wordCharacter.test(line[cursor.ch]);
}
function isWordBefore(editor, cursor) {
  if (cursor.ch === 0) {
    return false;
  }
  return wordCharacter.test(editor.getLine(cursor.line)[cursor.ch - 1]);
}
function atDocumentStart(cursor) {
  return cursor.line === 0 && cursor.ch === 0;
}
function atDocumentEnd(editor, cursor) {
  const lastLine = editor.lineCount() - 1;
  return cursor.line === lastLine && cursor.ch >= editor.getLine(lastLine).length;
}
function copyPosition(position) {
  return { line: position.line, ch: position.ch };
}
function setCursor(editor, position) {
  editor.setCursor(position);
}
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// src/main.ts
var commands = [
  { id: "forward-word", name: "Forward word", run: forwardWord },
  { id: "backward-word", name: "Backward word", run: backwardWord },
  { id: "beginning-of-line", name: "Beginning of line", run: beginningOfLine },
  { id: "end-of-line", name: "End of line", run: endOfLine },
  { id: "forward-character", name: "Forward character", run: forwardCharacter },
  { id: "backward-character", name: "Backward character", run: backwardCharacter },
  { id: "previous-line", name: "Previous line", run: previousLine },
  { id: "next-line", name: "Next line", run: nextLine }
];
var EmacsMovementPlugin = class extends import_obsidian.Plugin {
  async onload() {
    for (const command of commands) {
      this.addCommand({
        id: command.id,
        name: command.name,
        editorCallback: command.run
      });
    }
  }
};
