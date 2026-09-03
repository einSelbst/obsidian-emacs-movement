# Obsidian Emacs Movement

Obsidian Emacs Movement adds Emacs-style cursor movement commands to Obsidian's Markdown editor. Each movement is registered as a normal Obsidian command, so you can assign and change its hotkey in Obsidian without editing the plugin.

The plugin does not assign default hotkeys. Open **Settings → Hotkeys**, search for **Emacs Movement**, and choose the bindings that fit your setup.

## Supported movements

| Command | Movement |
| --- | --- |
| Emacs Movement: Forward word | Move forward across the next word |
| Emacs Movement: Backward word | Move backward to the start of the previous word |
| Emacs Movement: Beginning of line | Move to the beginning of the current line |
| Emacs Movement: End of line | Move to the end of the current line |
| Emacs Movement: Forward character | Move one character forward, including across line boundaries |
| Emacs Movement: Backward character | Move one character backward, including across line boundaries |
| Emacs Movement: Previous line | Move to the previous line while preserving the column when possible |
| Emacs Movement: Next line | Move to the next line while preserving the column when possible |

Word movement treats Unicode letters, numbers, and underscores as word characters.

## Manual installation

The plugin is installed manually:

1. Install dependencies and build the plugin:

   ```bash
   pnpm install --frozen-lockfile
   pnpm build
   ```

2. Create this directory inside the Obsidian vault where you want to use the plugin:

   ```text
   .obsidian/plugins/obsidian-emacs-movement/
   ```

3. Copy `main.js` and `manifest.json` into that directory.
4. Reload Obsidian, enable **Emacs Movement** under **Settings → Community plugins**, and assign the desired commands under **Settings → Hotkeys**.

## Development

The project uses pnpm, TypeScript, and esbuild.

```bash
pnpm install --frozen-lockfile
pnpm typecheck
pnpm build
```

For a development build with an inline source map:

```bash
pnpm dev
```

The production bundle is written to `main.js`.

## Limitations

- The plugin implements cursor movement only. It does not provide mark/region, kill-ring, yank, yank-pop, or editing commands.
- Desktop Markdown editing is the primary target. Mobile behavior has not been validated.
- Hotkeys are intentionally left unassigned to avoid overriding existing Obsidian or operating-system bindings.

## License

MIT
