const express = require('express');
const app = express();

app.get('/', (req, res, next) => {
    res.status(200).send('Hello world!');
})

app.listen(4001, () => {
    console.log('Server listening on 4001');
})