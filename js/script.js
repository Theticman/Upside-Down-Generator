// Creating Constants & Variables
const sheet_url = 'https://spreadsheets.google.com/feeds/cells/1KVlsHKtK03-C8Q6jdcGuNVAYt0lSrLdORgjLs6dkvBc/od6/public/basic?alt=json';
var input_text = '';
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
    if (input_text != get_input_text()) {
        generate();
    }
}

function generate() {
    console.log("Generating new output...");
    input_text = get_input_text();
    var upside_down = '';
    var i = 1;
    for (i = 1; i <= input_text.length; i++) {
        const element = input_text[input_text.length-i];
        upside_down = upside_down+element;
    }
    display_ud_text(upside_down);
}

// Ticking (loop to check for update every 100ms)
setInterval(generate_init, 100)
