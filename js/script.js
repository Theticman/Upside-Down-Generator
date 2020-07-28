// Creating Constants & Variables
const sheet_url = 'https://spreadsheets.google.com/feeds/cells/1KVlsHKtK03-C8Q6jdcGuNVAYt0lSrLdORgjLs6dkvBc/od6/public/basic?alt=json';
var input_text = '';
var table = [];
var text_parts = [];
var variables = [];

// Functions
async function getdata() {
    console.log("Calling API...");
    const response = await fetch(sheet_url);
    var raw_data = await response.json();
    raw_data = raw_data.feed.entry;
    console.log("Raw data pulled:",raw_data);
    table = [[],[]];
    console.log("Reformating to usable JSON...");
    raw_data.forEach(element => {
        if (element.title.$t[0] === 'A') {
            table[0].push(element.content.$t);
        } 
        if (element.title.$t[0] === 'B') {
            table[1].push(element.content.$t);
        }
    });
    console.log("Final table",table);
}

function get_input_text() {
    return document.getElementById('input_text').value
}

function display_ud_text(text) {
    document.getElementById('upside_down_text').value = text;
}

function search_variables(text,text_parts,variables) {
    let var_1 = text.search('%s');
    let var_2 = text.search(/%\$.s/);
    let left = text;
    let right = '';

    if (var_1 != -1) {
        if (variables.length >= 1) {
            variables.push('%$'+(variables.length+1)+'s');
            variables[0] = '%$1s';
        }
        else {
            variables.push('%s');
        }
        left = text.slice(0,var_1);
        right = text.slice(var_1+2,text.length);
        search_variables(left,text_parts,variables);
        search_variables(right,text_parts,variables); 
    }
    else if (var_2 =! -1) {
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
    var lettre = table[0];
    var indice = lettre.indexOf(letter);
    if (indice == -1) {
        return letter
    }
    return table[1][indice];
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
