// Creating Constants & Variables
const sheet_url = 'https://spreadsheets.google.com/feeds/cells/1KVlsHKtK03-C8Q6jdcGuNVAYt0lSrLdORgjLs6dkvBc/od6/public/basic?alt=json';
var input_text = '';
var upside_down = '';
var variables = [];
console.log("TEST");

// Functions
async function getdata() {
    console.log("Calling API...");
    const response = await fetch(sheet_url);
    var raw_data = await response.json();
    raw_data = raw_data.feed.entry;
    console.log("Raw data pulled:",raw_data);
    var table = [[],[]];
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

function generate_init() {
    new_inputed_text = get_input_text();
    if (input_text != new_inputed_text) {
        input_text = new_inputed_text;
        generate();
    }
}

function search_variables(text) {
    var again = 0;
    var var_1 = text.search("%s");
    if (var_1 != -1) {
        variables.push([var_1,'%s']);
        text = text.replace("%s", "  ");
        again = 1;
    }
    var var_2 = text.search(/%\$.s/);
    console.log("Search",var_2)
    if (var_2 != -1) {
        variables.push([var_2,text.substring(var_2,var_2+3)]);
        text = text.replace(text.substring(var_2,var_2+3), "    ");
        again = 1;
    }
    if (again == 1) {
        search_variables(text);
    }
    return text
}

function generate() {
    console.log("Start generate...");
    upside_down = '';
    variables = [];
    var no_variables = search_variables(input_text);
    console.log("FINAL VARIABLES",variables);
    var i = 1;
    for (i = 1; i <= no_variables.length; i++) {
        const element = no_variables[no_variables.length-i];
        upside_down = upside_down+element;
    }
    display_ud_text(upside_down);
}

// Ticking (loop to check for update every 100ms)
setInterval(generate_init, 100)
