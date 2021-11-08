const e = require('express');
const express = require('express');
const app = express();

const Employees = [
    {'employeeId': 1, 'name': 'John Doe', 'full time': 'false', 'join date': '2011/JAN/04'},
    {'employeeId': 2, 'name': 'Jane Doe', 'full time': 'false', 'join date': '2015/MAR/18'},
    {'employeeId': 3, 'name': 'Robert Bobbington', 'full time': 'true', 'join date': '2010/FEB/6'},
    {'employeeId': 4, 'name': 'Harry Horton', 'full time': 'false', 'join date': '2017/DEC/19'},
    {'employeeId': 5, 'name': 'Jim Jordan', 'full time': 'true', 'join date': '2010/SEP/21'}
];

let employeeCounter = Employees.length;

//Helper functions

const getIndexByEmployeeId = (Id) => {
    return Employees.findIndex((element) => {
        return element.employeeId === Number(Id);
    })
};

const createEmployee = (inputValues, employeeList) => {
    if(inputValues.hasOwnProperty('name') && inputValues.hasOwnProperty('full time') && inputValues.hasOwnProperty('join date')) {
        employeeCounter ++;
        nextOpenId = employeeCounter;
        return {
            'employeeId': nextOpenId,
            'name': inputValues['name'],
            'full time': inputValues['full time'],
            'join date': inputValues['join date']
        }
    } else {
        console.log(`Error: Must specify the new employee's name, full time status and join date`);
    }
}

//Middleware

app.use('/Employees/:employeeId', (req, res, next) => {
    const targetEmployeeIndex = getIndexByEmployeeId(req.params.employeeId);
    const targetEmployee = Employees[targetEmployeeIndex];
    if(targetEmployee) {
        req.index = targetEmployeeIndex;
        req.employee = targetEmployee;
        next();
    } else {
        res.status(404).send();
        console.log(`Employee Id ${req.params.employeeId} not found`);
    }
})

//APIs

app.get('/Employees', (req, res, next) => {
    res.status(200).send(Employees);
});

app.get('/Employees/:employeeId', (req, res, next) => {
        res.status(200).send(req.employee);
});

app.delete('/Employees/:employeeId', (req, res, next) => {
        Employees.splice(req.index, 1);
        res.status(204).send();
})

app.post('/Employees', (req, res, next) => {
    const employeeAdded = createEmployee(req.query, Employees);
    if(employeeAdded) {
        Employees.push(employeeAdded);
        res.status(201).send(employeeAdded);
    } else {
        res.status(400).send();
    }
});

app.put('/Employees/:employeeId', (req, res, next) => {
        Object.assign(Employees[req.index], req.query);
        res.status(200).send(Employees[req.index]);
})

app.listen(4001, () => {
    console.log('Server listening on 4001\n version 1.3');
});