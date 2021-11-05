const e = require('express');
const express = require('express');
const app = express();

const Employees = [
    {'employeeId': '1', 'name': 'John Doe', 'full time': 'false', 'join date': '2011/JAN/04'},
    {'employeeId': '2', 'name': 'Jane Doe', 'full time': 'false', 'join date': '2015/MAR/18'},
    {'employeeId': '3', 'name': 'Robert Bobbington', 'full time': 'true', 'join date': '2010/FEB/6'},
    {'employeeId': '4', 'name': 'Harry Horton', 'full time': 'false', 'join date': '2017/DEC/19'},
    {'employeeId': '5', 'name': 'Jim Jordan', 'full time': 'true', 'join date': '2010/SEP/21'}
];

app.get('/Employees', (req, res, next) => {
    res.status(200).send(Employees);
});

app.get('/Employees/:employeeId', (req, res, next) => {
    const employeeIdRequested = String(req.params.employeeId);
    const result = Employees.find(({employeeId}) => {
        return employeeId === employeeIdRequested;
    })
    if(result) {
        res.status(200).send(result);
    } else {
        res.status(404).send();
        console.log('Employee ID not found!');
    }
});

app.listen(4001, () => {
    console.log('Server listening on 4001\n version 1.2');
});