// Creating Constants & Variables
const normal_characters = [
    "A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X,","Y","Z",
    "a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z",
    "0","1","2","3","4","5","6","7","8","9",
    "'",".",",","!","?","<",">","[","]","(",")","{","}",":","/","%"
];
const updside_down_characters = [
    "Ɐ","ᗺ","Ɔ","ᗡ","Ǝ","Ⅎ","⅁","H","I","Ր","Ʞ","Ꞁ","W","N","O","Ԁ","Ꝺ","ᴚ","S","⟘","∩","Λ","M","X","⅄","Z",
    "ɐ","q","ɔ","p","ǝ","ɟ","ᵷ","ɥ","ᴉ","ɾ","ʞ","ꞁ","ɯ","u","o","d","b","ɹ","s","ʇ","n","ʌ","ʍ","x","ʎ","z",
    "0","⥝","ᘔ","Ɛ","߈","ϛ","9","ㄥ","8","6",
    ",","˙","'","¡","¿",">","<","]","[",")","(","}","{",":","/","%"
];

var input_text = '';
var text_parts = [];
var variables = [];

// Functions
function copy_to_clipboard(text_id) {
    var text = document.getElementById(text_id).value
    console.log("Copy to clipboard:",text);
    window.navigator.clipboard.writeText(text);
}

function get_input_text() {
    return document.getElementById('input_text').value
}

function display_ud_text(text) {
    document.getElementById('upside_down_text').value = text;
}

function search_variables(text,text_parts,variables) {
    let var_1 = text.search('%s');
    let var_2 = text.search(/%.\$s/);
    let left = text;
    let right = '';

    if (var_1 != -1) {
        if (variables.length >= 1) {
            variables.push('%'+(variables.length+1)+'$s');
            variables[0] = '%1$s';
        }
        else {
            variables.push('%s');
        }
        left = text.slice(0,var_1);
        right = text.slice(var_1+2,text.length);
        search_variables(left,text_parts,variables);
        search_variables(right,text_parts,variables); 
    }
    else if (var_2 != -1) {
        variables.push(text.substring(var_2,var_2+4));
        left = text.slice(0,var_2);
        right = text.slice(var_2+4,text.length);
        search_variables(left,text_parts,variables);
        search_variables(right,text_parts,variables); 
    }
    else {
        text_parts.push(text);
    }
}

function place_variables(text_parts,variables) {
    let new_text = text_parts[0];
    for (let i = 0; i < variables.length; i++) {
        new_text = text_parts[i+1] + variables[i] + new_text;
    }
    return new_text
}

function convert_letter(letter) {
    var lettre = normal_characters;
    var indice = lettre.indexOf(letter);
    if (indice == -1) {
        return letter
    }
    return updside_down_characters[indice];
}

function convert_text(text) {
    var new_text = '';
    for (let i = 1; i <= text.length; i++) {
        const element = text[text.length-i];
        new_text = new_text+convert_letter(String(element));
    }
    return new_text
}

function convert_text_parts(text_parts) {
    for (let i = 0; i < text_parts.length; i++) {
        text_parts[i] = convert_text(text_parts[i]);
    }
    return text_parts
}

function generate() {
    console.log("Start generate...");
    fetch('https://api.countapi.xyz/update/theticman/testing/?amount=1');
    var upside_down = '';
    text_parts = [];
    variables = [];
    search_variables(input_text,text_parts,variables);
    console.log("End recursive",text_parts,variables)
    text_parts = convert_text_parts(text_parts);
    upside_down = place_variables(text_parts,variables);
    display_ud_text(upside_down);
}

function generate_init() {
    new_inputed_text = get_input_text();
    if (input_text != new_inputed_text) {
        input_text = new_inputed_text;
        generate();
    }
}

// Ticking (loop to check for update every 100ms)
setInterval(generate_init, 100)
