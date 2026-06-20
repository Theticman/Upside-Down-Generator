"use strict";

/* ------------------------------------------------------------------ *
 * Character maps                                                      *
 * NORMAL_CHARS and UPSIDE_DOWN_CHARS are positionally aligned: the    *
 * glyph at index i in one maps to the glyph at index i in the other.  *
 * Any edit must be mirrored at the same index in both arrays.         *
 * ------------------------------------------------------------------ */
const NORMAL_CHARS = [
    "A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
    "a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z",
    "0","1","2","3","4","5","6","7","8","9",
    "'",".",",","!","?","<",">","[","]","(",")","{","}",":","/","%","&",";",'"',"’"
];
const UPSIDE_DOWN_CHARS = [
    "Ɐ","ᗺ","Ɔ","ᗡ","Ǝ","Ⅎ","⅁","H","I","Ր","Ʞ","Ꞁ","W","N","O","Ԁ","Ꝺ","ᴚ","S","⟘","∩","Ʌ","M","X","⅄","Z",
    "ɐ","q","ɔ","p","ǝ","ɟ","ᵷ","ɥ","ᴉ","ɾ","ʞ","ꞁ","ɯ","u","o","d","b","ɹ","s","ʇ","n","ʌ","ʍ","x","ʎ","z",
    "0","⥝","ᘔ","Ɛ","߈","ϛ","9","ㄥ","8","6",
    ",","˙","'","¡","¿",">","<","]","[",")","(","}","{",":","/","%","⅋","⸵",",,",","
];

const FLIP_MAP = new Map(NORMAL_CHARS.map((ch, i) => [ch, UPSIDE_DOWN_CHARS[i]]));

// Matches a format parameter: bare "%s" or indexed "%1$s", "%2$s", ...
const PARAM_RE = /%(?:\d+\$)?s/g;

/* ------------------------------------------------------------------ *
 * Standard conversion — flip every glyph and reverse the string,      *
 * keeping format parameters intact and re-indexed (Rulebook 2 & 3).   *
 * ------------------------------------------------------------------ */

function flipChar(ch) {
    return FLIP_MAP.has(ch) ? FLIP_MAP.get(ch) : ch;
}

// Flip each character and reverse the string in a single backward pass.
function flipAndReverse(text) {
    let out = "";
    for (let i = text.length - 1; i >= 0; i--) {
        out += flipChar(text[i]);
    }
    return out;
}

// Replace bare "%s" tokens with explicit "%1$s", "%2$s", ... numbered
// by source order, so each keeps its value once parameters are
// reordered. Only applied when more than one bare token is present;
// already-indexed tokens are left untouched.
function reindexBareParameters(text) {
    const bareCount = (text.match(/%s/g) || []).length;
    if (bareCount <= 1) return text;
    let n = 0;
    return text.replace(PARAM_RE, (token) =>
        token === "%s" ? `%${(n += 1)}$s` : token
    );
}

// Split text into literal segments and the parameter tokens between them.
function splitOnParameters(text) {
    const segments = [];
    const params = [];
    let lastIndex = 0;
    let match;

    PARAM_RE.lastIndex = 0;
    while ((match = PARAM_RE.exec(text)) !== null) {
        segments.push(text.slice(lastIndex, match.index));
        params.push(match[0]);
        lastIndex = match.index + match[0].length;
    }
    segments.push(text.slice(lastIndex));

    return { segments, params };
}

function convertStandard(text) {
    const { segments, params } = splitOnParameters(reindexBareParameters(text));
    const flipped = segments.map(flipAndReverse);

    // Reassemble in reverse so the whole string reads upside down, with
    // each parameter restored between its neighbouring (flipped) text.
    let out = flipped[0];
    for (let i = 0; i < params.length; i++) {
        out = flipped[i + 1] + params[i] + out;
    }
    return out;
}

/* ------------------------------------------------------------------ *
 * Narrator conversion — for screen-reader strings (Rulebook            *
 * Exception 1): reverse word order only, letters stay readable.        *
 * ------------------------------------------------------------------ */

function capitaliseFirst(word) {
    return word ? word[0].toUpperCase() + word.slice(1) : word;
}

function lowercaseFirst(word) {
    return word ? word[0].toLowerCase() + word.slice(1) : word;
}

// Reverse the words of one sentence and tidy capitalisation so it still
// reads like a sentence: the new first word is capitalised and the word
// that used to lead the sentence drops its capital. Trailing punctuation
// is mirrored along with the words — it moves to the opposite end —
// except the sentence-final terminator, which stays at the end. So
// `Hello my friend, Tom!` becomes `Tom, friend my hello!`. Nothing is
// added when the original had no end punctuation.
function tidySentence(sentence) {
    const trimmed = sentence.trim();
    if (!trimmed) return "";

    // Split each word into its core and any trailing punctuation. "%" and
    // "$" are kept in the core so parameter tokens (e.g. "%1$s") survive.
    const cores = [];
    const trailing = [];
    for (const word of trimmed.split(/\s+/)) {
        const punct = word.match(/[^\p{L}\p{N}%$]+$/u);
        trailing.push(punct ? punct[0] : "");
        cores.push(punct ? word.slice(0, -punct[0].length) : word);
    }

    cores.reverse();

    // Mirror the trailing punctuation, holding the final terminator in
    // place: reverse all slots except the last, which keeps its mark.
    const last = trailing.length - 1;
    const newTrailing = trailing.slice(0, last).reverse();
    newTrailing.push(trailing[last]);

    if (cores.length > 0) cores[0] = capitaliseFirst(cores[0]);
    if (cores.length > 1) cores[last] = lowercaseFirst(cores[last]);

    return cores.map((core, i) => core + newTrailing[i]).join(" ");
}

function convertNarrator(text) {
    // Reversing word order also reorders any parameters, so they are
    // reindexed up front (Rulebook Rule 3). A parameter token starts
    // with "%", which has no letter case, so the capitalisation tidy-up
    // below leaves it intact.
    const prepared = reindexBareParameters(text);
    const sentences = prepared.match(/[^.!?]+[.!?]*/g);
    if (!sentences) return prepared;

    // Reverse the order of sentences too, then tidy each one.
    return sentences
        .map(tidySentence)
        .filter(Boolean)
        .reverse()
        .join(" ");
}

/* ------------------------------------------------------------------ *
 * UI wiring                                                            *
 * ------------------------------------------------------------------ */

const elements = {};
let tooltipTimer = null;
let lastCountedValue = null;

const systemDark = window.matchMedia("(prefers-color-scheme: dark)");

// Usage counter, hosted by Abacus (https://abacus.jasoncameron.dev).
// Incremented once each time the output is copied (see copyOutput). The
// total is not shown in the page — only the README badge displays it,
// reading the same counter via "/get/.../shield". No account or token.
const COUNTER_HIT_URL =
    "https://abacus.jasoncameron.dev/hit/theticman.github.io/generator";

function countUse() {
    // Fire-and-forget; the counter is best-effort and never blocks the app.
    fetch(COUNTER_HIT_URL).catch(() => {});
}

// Output placeholders per mode. Standard shows "Hello World" flipped;
// Narrator keeps letters readable, so it shows the word-reversed form the
// narrator converter would produce instead.
const OUTPUT_PLACEHOLDER = {
    standard: "pꞁɹoM oꞁꞁǝH",
    narrator: "World hello",
};

function render() {
    const text = elements.input.value;
    const narrator = elements.modeSwitch.checked;
    elements.output.value = narrator ? convertNarrator(text) : convertStandard(text);
    elements.output.placeholder = narrator
        ? OUTPUT_PLACEHOLDER.narrator
        : OUTPUT_PLACEHOLDER.standard;
}

function copyOutput() {
    const value = elements.output.value;
    if (!value) return;
    window.navigator.clipboard.writeText(value);

    // Only count once per distinct output — spamming copy on the same
    // result does not inflate the counter.
    if (value !== lastCountedValue) {
        lastCountedValue = value;
        countUse();
    }

    elements.tooltip.classList.add("tooltip--visible");
    clearTimeout(tooltipTimer);
    tooltipTimer = setTimeout(() => {
        elements.tooltip.classList.remove("tooltip--visible");
    }, 1500);
}

// A saved choice wins; otherwise the system preference decides.
function isDarkActive() {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") return true;
    if (saved === "light") return false;
    return systemDark.matches;
}

function syncThemeButton() {
    elements.themeToggle.textContent = isDarkActive() ? "☀️" : "🌙";
}

function toggleTheme() {
    const next = isDarkActive() ? "light" : "dark";
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
    syncThemeButton();
}

function init() {
    elements.input = document.getElementById("input_text");
    elements.output = document.getElementById("upside_down_text");
    elements.modeSwitch = document.getElementById("mode_switch");
    elements.tooltip = document.getElementById("tooltip");
    elements.themeToggle = document.getElementById("theme_toggle");

    elements.input.addEventListener("input", render);
    elements.modeSwitch.addEventListener("change", render);
    elements.output.addEventListener("click", copyOutput);
    elements.themeToggle.addEventListener("click", toggleTheme);

    // Keep the button icon in sync when following the system and it changes.
    systemDark.addEventListener("change", () => {
        if (!localStorage.getItem("theme")) syncThemeButton();
    });

    syncThemeButton();
    render();
}

document.addEventListener("DOMContentLoaded", init);
