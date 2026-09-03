import { Plugin, type Editor } from "obsidian";
import {
  backwardCharacter,
  backwardWord,
  beginningOfLine,
  endOfLine,
  forwardCharacter,
  forwardWord,
  nextLine,
  previousLine,
} from "./movement";

type Movement = (editor: Editor) => void;

const commands: Array<{ id: string; name: string; run: Movement }> = [
  { id: "forward-word", name: "Forward word", run: forwardWord },
  { id: "backward-word", name: "Backward word", run: backwardWord },
  { id: "beginning-of-line", name: "Beginning of line", run: beginningOfLine },
  { id: "end-of-line", name: "End of line", run: endOfLine },
  { id: "forward-character", name: "Forward character", run: forwardCharacter },
  { id: "backward-character", name: "Backward character", run: backwardCharacter },
  { id: "previous-line", name: "Previous line", run: previousLine },
  { id: "next-line", name: "Next line", run: nextLine },
];

export default class EmacsMovementPlugin extends Plugin {
  async onload() {
    for (const command of commands) {
      this.addCommand({
        id: command.id,
        name: command.name,
        editorCallback: command.run,
      });
    }
  }
}
