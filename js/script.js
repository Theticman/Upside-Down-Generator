function generate() {
    var raw_text = document.getElementById('raw_text').value;
    var test = '';
    var i = 1;
    for (i = 1; i <= raw_text.length; i++) {
        const element = raw_text[raw_text.length-i];
        console.log(element);
        test = test+element;
    }

    document.getElementById('upside_down_text').value = test;
}

setInterval(generate, 100)
