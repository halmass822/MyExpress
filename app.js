const express = require('express');
const app = express();

const dataArray = 'Hello World!'.split('');

app.get('/dataArray', (req, res, next) => {
    res.status(200).send(dataArray);
});

app.get('/dataArray/:index', (req, res, next) => {
    const indexRequested = req.params.index;
    //console.log(`Requested index is ${indexRequested}`);
    const result = dataArray[indexRequested];
    if(result) {
        res.status(200).send(dataArray[indexRequested]);
    } else {
        res.status(404).send();
    }
});

app.delete('/dataArray/:index', (req, res, next) => {
    const indexRequested = req.params.index;
    const result = dataArray[indexRequested]
    if(result) {
        dataArray.splice(indexRequested, 1);
        res.status(204).send();
    } else {
        res.status(404).send();
    }
})

app.listen(4001, () => {
    console.log('Server listening on 4001\n version 1.1');
});