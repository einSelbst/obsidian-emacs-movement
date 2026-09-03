import type { Editor, EditorPosition } from "obsidian";

const wordCharacter = /[\p{L}\p{N}_]/u;

export function forwardWord(editor: Editor): void {
  setCursor(editor, findForwardWord(editor, editor.getCursor()));
}

export function backwardWord(editor: Editor): void {
  setCursor(editor, findBackwardWord(editor, editor.getCursor()));
}

export function beginningOfLine(editor: Editor): void {
  const cursor = editor.getCursor();
  setCursor(editor, { line: cursor.line, ch: 0 });
}

export function endOfLine(editor: Editor): void {
  const cursor = editor.getCursor();
  setCursor(editor, { line: cursor.line, ch: editor.getLine(cursor.line).length });
}

export function forwardCharacter(editor: Editor): void {
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

export function backwardCharacter(editor: Editor): void {
  const cursor = editor.getCursor();

  if (cursor.ch > 0) {
    setCursor(editor, { line: cursor.line, ch: cursor.ch - 1 });
    return;
  }

  if (cursor.line > 0) {
    const previousLine = cursor.line - 1;
    setCursor(editor, { line: previousLine, ch: editor.getLine(previousLine).length });
  }
}

export function previousLine(editor: Editor): void {
  moveLine(editor, -1);
}

export function nextLine(editor: Editor): void {
  moveLine(editor, 1);
}

function moveLine(editor: Editor, delta: -1 | 1): void {
  const cursor = editor.getCursor();
  const line = clamp(cursor.line + delta, 0, editor.lineCount() - 1);
  setCursor(editor, { line, ch: clamp(cursor.ch, 0, editor.getLine(line).length) });
}

function findForwardWord(editor: Editor, start: EditorPosition): EditorPosition {
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

function findBackwardWord(editor: Editor, start: EditorPosition): EditorPosition {
  const cursor = copyPosition(start);

  while (!atDocumentStart(cursor) && !isWordBefore(editor, cursor)) {
    retreat(editor, cursor);
  }

  while (!atDocumentStart(cursor) && isWordBefore(editor, cursor)) {
    retreat(editor, cursor);
  }

  return cursor;
}

function advance(editor: Editor, cursor: EditorPosition): void {
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

function retreat(editor: Editor, cursor: EditorPosition): void {
  if (cursor.ch > 0) {
    cursor.ch -= 1;
    return;
  }

  if (cursor.line > 0) {
    cursor.line -= 1;
    cursor.ch = editor.getLine(cursor.line).length;
  }
}

function isWordAt(editor: Editor, cursor: EditorPosition): boolean {
  const line = editor.getLine(cursor.line);
  return cursor.ch < line.length && wordCharacter.test(line[cursor.ch]);
}

function isWordBefore(editor: Editor, cursor: EditorPosition): boolean {
  if (cursor.ch === 0) {
    return false;
  }

  return wordCharacter.test(editor.getLine(cursor.line)[cursor.ch - 1]);
}

function atDocumentStart(cursor: EditorPosition): boolean {
  return cursor.line === 0 && cursor.ch === 0;
}

function atDocumentEnd(editor: Editor, cursor: EditorPosition): boolean {
  const lastLine = editor.lineCount() - 1;
  return cursor.line === lastLine && cursor.ch >= editor.getLine(lastLine).length;
}

function copyPosition(position: EditorPosition): EditorPosition {
  return { line: position.line, ch: position.ch };
}

function setCursor(editor: Editor, position: EditorPosition): void {
  editor.setCursor(position);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
