# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page, dependency-free static web app that converts text into Minecraft's "Upside Down English" locale — it flips each character to its upside-down glyph, reverses the string, and re-indexes format parameters. It is the tooling companion to `RULEBOOK.md`, which documents the human translation conventions. Deployed via GitHub Pages at `theticman.github.io/Upside-Down-Generator`.

There is **no build step, no package manager, and no test suite**. The three source files (`index.html`, `css/style.css`, `js/script.js`) are served as-is.

## Running locally

Open `index.html` directly in a browser, or serve the folder over HTTP (clipboard copy and `fetch` behave more reliably over `http://` than `file://`):

```sh
python -m http.server 8000   # then visit http://localhost:8000
```

There are no lint or test commands. Verify changes by typing in the input box and confirming the output box updates live.

## Architecture

The entire app lives in `js/script.js`, organised into commented sections: character maps, standard conversion, narrator conversion, and UI wiring. `init()` runs on `DOMContentLoaded` and wires event listeners (`input` on the textarea, `change` on the mode switch, `click` to copy, `click` on the theme toggle); `render()` recomputes the output on every change. There is no polling loop.

### Two conversion modes

A toggle switch selects which converter `render()` calls:

- **Standard** (`convertStandard`) — the mechanical flip: `splitOnParameters()` separates literal text from `%s`/`%n$s` tokens, `flipAndReverse()` flips and reverses each literal segment in one backward pass, then segments and parameters are reassembled in reverse order.
- **Narrator** (`convertNarrator`) — for screen-reader strings (Rulebook Exception 1): letters are **not** flipped. It splits into sentences, reverses sentence order, and `tidySentence()` reverses each sentence's words, fixes capitalisation (new first word capitalised, old leading word de-capitalised), and mirrors trailing punctuation to the opposite end while holding the sentence-final terminator in place.

Both modes call `reindexBareParameters()` first: because either mode reorders parameters, bare `%s` tokens are renumbered to `%1$s`, `%2$s`, … by source position so each keeps its value (Rulebook Rule 3). Single bare `%s` is left alone.

### The character mapping invariant

`NORMAL_CHARS` and `UPSIDE_DOWN_CHARS` are two **positionally-aligned** arrays, combined into the `FLIP_MAP`. **Any edit to one array must be mirrored at the identical index in the other**, or characters silently map wrong. Characters absent from the map pass through unchanged (this is how spaces, newlines, and unmapped glyphs survive). A few mappings are intentionally multi-char: `"` → `,,` and `’` → `,`, consistent with the Rulebook annex.

### Theming

Light/dark is driven by CSS variables in `css/style.css`. With no saved choice the page follows `prefers-color-scheme`; the toggle writes `data-theme` to `<html>` and persists it in `localStorage`. An inline script in `index.html`'s `<head>` applies the saved theme before first paint to avoid a flash.

### Usage counter

`countUse()` increments the Abacus counter (`https://abacus.jasoncameron.dev`) once each time the output is copied (called from `copyOutput`) — it's fire-and-forget and the total is never shown in the page. The counter is `theticman.github.io/generator`; the app uses the public `/hit` endpoint (no token), and only the README badge displays the total, reading it via `/get/.../shield` (read-only, so viewing the README doesn't inflate the count). Resetting/setting the value needs the admin key held by the project owner — never commit it.

### Code vs. Rulebook scope

The generator implements the base flip (Rule 2), parameter re-indexing (Rule 3), and the narrator exception (Exception 1). It does **not** handle banner patterns, keyboard labels, or multi-line line-reordering; those remain manual steps per `RULEBOOK.md`. When changing conversion behavior, check `RULEBOOK.md` first — it is the source of truth for intended output, and the two must stay consistent.
