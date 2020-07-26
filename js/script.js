const sheet_url = 'https://spreadsheets.google.com/feeds/cells/1KVlsHKtK03-C8Q6jdcGuNVAYt0lSrLdORgjLs6dkvBc/od6/public/basic?alt=json';

async function getdata() {
    console.log("Calling API...");
    const response = await fetch(sheet_url);
    var raw_data = await response.json();
    raw_data = raw_data.feed.entry;
    console.log("Raw data pulled:",raw_data);

    var table = [[],[]];
    var i = 0;
    console.log("Reformating to usable JSON...");
    raw_data.forEach(element => {
        if (i % 2 === 0) {
            table[0].push(element.content.$t);
        } else {
            table[1].push(element.content.$t);
        }
        i++
    });
    console.log("Final table",table);
}

function get_raw_text() {
    return document.getElementById('raw_text').value
}

function generate_init() {
    if (test != get_raw_text()) {
        generate();
    }
}

function generate() {
    var raw_text = get_raw_text();
    test = '';
    var i = 1;
    for (i = 1; i <= raw_text.length; i++) {
        const element = raw_text[raw_text.length-i];
        test = test+element;
    }
    document.getElementById('upside_down_text').value = test;
}

setInterval(generate_init, 100)
