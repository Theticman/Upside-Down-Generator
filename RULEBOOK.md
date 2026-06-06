# ʞooqǝꞁnᴚ uʍoᗡ ǝpᴉsd∩ ɥsᴉꞁᵷuƎ ʇɟɐɹɔǝuᴉW

> *For your convenience, the rest of this **Minecraft English Upside Down Rulebook** has been written downside up — the right way round — so you can actually read it. You're welcome!*

---

## Contents

1. [Philosophy](#philosophy)
2. [Rules](#rules)
   1. [Source language](#1-source-language)
   2. [Standard strings](#2-standard-strings)
   3. [Parameters](#3-parameters)
   4. [Multi-line strings](#4-multi-line-strings)
   5. [Upside-down jokes](#5-upside-down-jokes)
3. [Exceptions](#exceptions)
   1. [Narrator strings](#1-narrator-strings)
   2. [Keyboard key labels](#2-keyboard-key-labels)
   3. [Banner pattern strings](#3-banner-pattern-strings)
4. [Workflow](#workflow)
5. [Annex — Characters & Punctuation](#annex--characters--punctuation)

---

## Philosophy

This is a **joke language**. The goal is not linguistic accuracy — it's fun and joy. Every string is just flipped upside down so it reads when you turn your screen over (or when you're upside down).

The thing that matters is consistency: the same character always flips to the same glyph, and the same kind of string is always handled the same way. The rules below cover the normal flip; the exceptions cover the cases where a plain flip doesn't work.

This is a living document and will keep growing as new edge cases turn up. Some of the existing translation also predates these rules — if you come across a string that doesn't follow them, it's fair game to fix.

---

## Rules

### 1. Source language

All strings are sourced from [English (Australia)](https://crowdin.com/editor/minecraft/10038/enus-enau?view=comfortable&filter=basic&value=0).

### 2. Standard strings

All strings are flipped and reversed by default: every character is substituted with its upside-down equivalent (see Annex), and the **entire string is reversed character-by-character** — not just the word order. Each word's letters run backwards too, so the first character of the source becomes the last character of the output.

Capitalisation travels with its letter: an uppercase letter maps to its uppercase upside-down form and stays on that same letter through the flip. Because the whole string is reversed, the capital does **not** stay at the start of its word — a word-initial capital ends up at the *end* of its word, and the capital of the first word lands at the very end of the output. (In the example below, the capital `T` of "This" surfaces as the final `⟘`.)

`This is an example.` → `˙ǝꞁdɯɐxǝ uɐ sᴉ sᴉɥ⟘`

### 3. Parameters

Strings often contain parameters such as `%s`, `%1$s`, `%2$s`. A parameter is an **atomic token**: never flip its glyphs and never reverse its characters — it has to reach the game byte-for-byte identical, or the format string breaks. Parameters only change *position*; they travel with their word as the string is reversed.

Because reversing changes their order, bare `%s` parameters (which the game fills in source order) must be made explicit so each still receives its original value. Number them by their **original** position — the first source `%s` becomes `%1$s`, the second `%2$s`, and so on. Parameters that are already indexed keep their numbers unchanged.

`%1$s was killed by %2$s!` → `¡%2$s ʎq pǝꞁꞁᴉʞ sɐʍ %1$s`

### 4. Multi-line strings

The flip is **vertical as well as horizontal**. When a string contains line breaks (`\n`), the order of the lines is reversed too: turning the block upside down brings the bottom line to the top. Each line is then flipped individually per Rule 2.

Source (one string with a line break):

```
look down
fall up
```

Output — the lines swap, then each is flipped:

```
dn ꞁꞁɐɟ
uʍop ʞooꞁ
```

**Paragraphs that span multiple strings.** Watch for text the game stacks on screen from *separate* keys — book pages, multi-line tooltips, descriptions split across `line1`/`line2`, etc. The upside-down flip applies to the whole visual block, not to each string in isolation, so the content that belongs at the **bottom** of the screen has to end up in the **first** string. In practice:

1. Concatenate the lines across all the strings in their on-screen order.
2. Reverse the full line sequence and flip each line.
3. Re-slot the flipped lines back into the keys, respecting each string's line count.

This usually means the strings get **swapped or reordered**. For example, two stacked single-line keys exchange contents:

| Key | Source | uʍop |
|---|---|---|
| `page.1` | `look down` | `dn ꞁꞁɐɟ` |
| `page.2` | `fall up` | `uʍop ʞooꞁ` |

If you flip each string independently and leave the keys in source order, the paragraph reads scrambled. Always check the line count of each string when redistributing.

### 5. Upside-down jokes

Where a string naturally invites it, a subtle falling- or upside-down-themed joke is welcome — floors, ceilings, gravity, The End. Keep it rare and don't force it.

---

## Exceptions

### 1. Narrator strings

Narrator (screen-reader) strings are identifiable by their source key — not just keys containing `narrator`, but the whole family: `narrator.*`, `narration.*`, `gui.narrate.*`, and any key ending in `.narration` or `.narrate`. These strings are spoken aloud by the game's narrator — flipping the letters would produce gibberish when read out. For this reason, **only word order is reversed; letters are not flipped**.

`This is an example.` → `Example an is this.`

Word order is reversed, but each word stays readable — letters are not flipped and keep their normal order. Capitalisation and punctuation are then tidied up so it still reads like a sentence: the new first word is capitalised and the full stop sits at the end. If a string has more than one sentence, the sentences are reversed in order too — e.g. `This is a custom screen. Learn more.` → `More learn. Screen custom a is this.`

### 2. Keyboard key labels

Single-symbol key names under `key.keyboard.*` are left untranslated so the label still matches the physical key — most notably `[` and `]`, which stay put instead of swapping to `]`↔`[` as they normally would. (Multi-letter key names like `Backspace` and `Enter` are flipped as normal.)

### 3. Banner pattern strings

Banner patterns use Minecraft's heraldic names (*Chevron*, *Pale Dexter*, …), not plain directions. Turning a banner upside down doesn't reposition a label — it turns each pattern into the pattern that is its **visual opposite**, which the game already has a name for. So a pattern's value becomes the name of its flipped counterpart. Because each pattern is a separate key, the orientation word effectively moves to the opposite string: it is **removed from one and added to the other**. Once the name is corrected, flip it to upside-down text per Rule 2.

- Orientation word **removed / added**: `Orange Inverted Chevron` → correct to `Orange Chevron` → flip → `uoɹʌǝɥƆ ǝᵷuɐɹO` (and the plain `Chevron` key gains "Inverted").
- Paired heraldic direction **swapped**: `White Pale Sinister` → correct to `White Pale Dexter` → flip → `ɹǝʇxǝᗡ ǝꞁɐԀ ǝʇᴉɥM` (and vice versa).

The colour and the rest of the name are kept as-is, then flipped. Patterns with no orientation word (Globe, Bordure, …) have no opposite — just flip them normally per Rule 2.

---

## Workflow

1. **Identify the string type** — standard, or one of the exceptions (narrator, banner, keyboard)?
2. **Translate** — the [Upside Down Generator](https://theticman.github.io/Upside-Down-Generator/) is recommended as it handles substitution, reversal, and parameter reindexing automatically.
3. **Review** — check capitalisation and that parameters are correctly reindexed.

---

## Annex — Characters & Punctuation

### Punctuation & symbols

Punctuation is flipped in place and travels with its word during reversal.

| Original | uʍop |
|---|---|
| `'` | `,` |
| `.` | `˙` |
| `,` | `'` |
| `!` | `¡` |
| `?` | `¿` |
| `<` | `>` |
| `>` | `<` |
| `[` | `]` |
| `]` | `[` |
| `(` | `)` |
| `)` | `(` |
| `{` | `}` |
| `}` | `{` |
| `:` | `:` |
| `/` | `/` |
| `%` | `%` |
| `&` | `⅋` |
| `;` | `⸵` |
| `\` | `\` |
| `` ` `` | `` ` `` |
| `=` | `=` |
| `-` | `-` |
| `"` | `,,` |

> A double quote maps to `,,` (two commas) rather than the single character `„` — it reads better in-game.

### Uppercase letters

| Original | uʍop | | Original | uʍop |
|---|---|-|---|---|
| A | Ɐ | | N | N |
| B | ᗺ | | O | O |
| C | Ɔ | | P | Ԁ |
| D | ᗡ | | Q | Ꝺ |
| E | Ǝ | | R | ᴚ |
| F | Ⅎ | | S | S |
| G | ⅁ | | T | ⟘ |
| H | H | | U | ∩ |
| I | I | | V | Ʌ |
| J | Ր | | W | M |
| K | Ʞ | | X | X |
| L | Ꞁ | | Y | ⅄ |
| M | W | | Z | Z |

### Lowercase letters

| Original | uʍop | | Original | uʍop |
|---|---|-|---|---|
| a | ɐ | | n | u |
| b | q | | o | o |
| c | ɔ | | p | d |
| d | p | | q | b |
| e | ǝ | | r | ɹ |
| f | ɟ | | s | s |
| g | ᵷ | | t | ʇ |
| h | ɥ | | u | n |
| i | ᴉ | | v | ʌ |
| j | ɾ | | w | ʍ |
| k | ʞ | | x | x |
| l | ꞁ | | y | ʎ |
| m | ɯ | | z | z |

### Numbers

| Original | uʍop |
|---|---|
| 0 | 0 |
| 1 | ⥝ |
| 2 | ᘔ |
| 3 | Ɛ |
| 4 | ߈ |
| 5 | ϛ |
| 6 | 9 |
| 7 | ㄥ |
| 8 | 8 |
| 9 | 6 |

### Spelling — Australian conventions

Australian English follows British spelling. Apply the patterns rather than memorising a word list:

| Pattern | Australian | US (avoid) |
|---|---|---|
| `-our`, not `-or` | colour, armour, flavour | color, armor |
| `-re`, not `-er` | centre, fibre | center, fiber |
| `-ise`, not `-ize` | realise, organise | realize, organize |
| `-ce` noun / `-se` verb | a licence / to license | a license (noun) |
| doubled `-ll-` | travelling, levelled | traveling, leveled |

A few common irregulars worth memorising: **grey** (not gray), **maths** (not math), **defence** / **offence** (not -se).

---

*We recommend turning your monitor upside down (or right side up?) to fully enjoy the Upside Down experience!*