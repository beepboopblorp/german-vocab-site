const express = require('express');
const app = express();
const spreadsheet_id = '1Qrj-_WuKJjGMISF5xqIsvCLokyK5J18y-mpaVNtASog';
let selected_vocab = [];

async function select_vocab(part) {
    let response = await fetch(`https://docs.google.com/spreadsheets/d/${spreadsheet_id}/export?gid=0&format=tsv`);
    let data = await response.text();
    data = data.substring(data.indexOf('\n') + 1) + '\n';
    while (data.indexOf('\n') != -1) {
        let temp = data.substring(0, data.indexOf('\n')) + '\t';
        if(temp.substring(0, temp.indexOf('\t')).toLowerCase() == part.toLowerCase()) {
            let term = [];
            while (temp.indexOf('\t') != -1) {
                term.push(temp.substring(0, temp.indexOf('\t')));
                temp = temp.substring(temp.indexOf('\t') + 1);
            }
            selected_vocab.push(term);
        }
        data = data.substring(data.indexOf('\n') + 1);
    }
    //console.log(selected_vocab);
}

app.get('/vocab/:speechpart', (req, res) => {
    let part_of_speech = req.params.speechpart;
    select_vocab(part_of_speech).then(() => {
        console.log(selected_vocab);
        res.json(selected_vocab);
    });
});

app.listen(3000, () => {console.log('listening on port 3000')});