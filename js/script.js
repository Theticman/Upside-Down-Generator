// Creating Constants & Variables
const sheet_url = 'https://spreadsheets.google.com/feeds/cells/1KVlsHKtK03-C8Q6jdcGuNVAYt0lSrLdORgjLs6dkvBc/od6/public/basic?alt=json';
var input_text = '';
var table = [];
var upside_down = '';
console.log("TEST");

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

function search_variables(text) {
    var variables = [];
    var var_1 = text.search('%s');
    var var_2 = text.search(/%\$.s/);
    
    while (var_1 != -1) {
        if (variables.length >= 1) {
            variables.push([var_1,'%$'+(variables.length+1)+'s']);
            variables[0][1] = '%$1s';
        }
        else {
            variables.push([var_1,'%s']);
        }
        text = text.replace("%s", "");
        var_1 = text.search('%s')
    }

    while (var_2 != -1) {
        variables.push([text.search(/%\$.s/),text.substring(var_2,var_2+4)]);
        text = text.replace(text.substring(var_2,var_2+4), "");
        var_2 = text.search(/%\$.s/);
    }
    return [text,variables.reverse()]
}

function place_variables(text,variables) {
    console.log("Place variables");
    for (let i = 0; i < text.length; i++) {
        console.log(variables[0][0],i);
        if (variables[0][0] == i) {
            text = text.slice(0,text.length-i) + variables[0][1] + text.slice(text.lenght-i,text.lenght);
        }
    }
    return text
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

function generate() {
    console.log("Start generate...");
    upside_down = '';
    var [no_variables,variables] = search_variables(input_text);
    upside_down = convert_text(no_variables);
    console.log(variables.length);
    if (variables.length >= 1) {
        upside_down = place_variables(upside_down,variables);
    }
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
