const e = require('express');
const express = require('express');
const app = express();
const sqlite = require('sqlite3');
const db = new sqlite.Database('./contractors.sqlite');
const { createTestArray, seedDataTable } = require('./utilities.js')

//DATA

const Employees = [
    {'employeeId': 1, 'name': 'John Doe', 'full time': 'false', 'join date': '2011/JAN/04'},
    {'employeeId': 2, 'name': 'Jane Doe', 'full time': 'false', 'join date': '2015/MAR/18'},
    {'employeeId': 3, 'name': 'Robert Bobbington', 'full time': 'true', 'join date': '2010/FEB/06'},
    {'employeeId': 4, 'name': 'Harry Horton', 'full time': 'false', 'join date': '2017/DEC/19'},
    {'employeeId': 5, 'name': 'Jim Jordan', 'full time': 'true', 'join date': '2010/SEP/21'}
];

const Clients = [
    {'clientId': 1, 'name': 'James Kerry', 'balance': 0, 'delinquent': false, 'customer since': '2020/FEB/06'},
    {'clientId': 2, 'name': 'Jimmy Jorgensen', 'balance': 0, 'delinquent': false, 'customer since': '2020/MAR/03'},
    {'clientId': 3, 'name': 'Lars Andersson', 'balance': 150.47, 'delinquent': false, 'customer since': '2020/SEP/20'},
    {'clientId': 4, 'name': 'John Smith', 'balance': 0, 'delinquent': false, 'customer since': '2019/OCT/18'},
    {'clientId': 5, 'name': 'Late McBills', 'balance': 432.86, 'delinquent': true, 'customer since': '2021/AUG/25'},
];

seedDataTable(10);

let employeeCounter = Employees.length;
let clientCounter = Clients.length;

//Helper functions

    //Employees
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

    //Clients
const getIndexByClientId = (Id) => {
    return Clients.findIndex((element) => {
        return element.clientId === Number(Id);
    })
}

const createClient = (inputValues, employeeList) => {
    if (inputValues.hasOwnProperty('name') && inputValues.hasOwnProperty('customer since')) {
        clientCounter ++;
        nextOpenId = clientCounter;
        return {
            'clientId': nextOpenId,
            'name': inputValues['name'],
            'balance': (inputValues['balance'] || 0), //initial balance and delinquency defaults to 0 and false
            'delinquent': (inputValues['delinquent'] || false),
            'customer since': inputValues['customer since']
        }
    } else {
        console.log(`Error: Must specify client's name, join date`)
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

app.use('/Clients/:clientId', (req, res, next) => {
    const targetClientIndex = getIndexByClientId(req.params.clientId);
    const targetClient = Clients[targetClientIndex];
    if(targetClient) {
        req.index = targetClientIndex;
        req.client = targetClient;
        next();
    } else {
        res.status(404).send();
        console.log(`Client Id ${req.params.clientId} not found`);
    }
})

app.use('/seedTable/:id', (req, res, next) => {
    db.get('SELECT * FROM seedTable WHERE id IS $id',
        {$id: req.params.id},
        (error, row) => {
            if(row) {
                req.targetElement = row;
                next();
            } else {
                res.status(404).send();
            }
        }
    )
})

//APIs
    //Employees

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

    //Clients

app.get('/Clients', (req, res, next) => {
    res.status(200).send(Clients);
})

app.get('/Clients/:clientId', (req, res, next) => {
    res.status(200).send(req.client);
})

app.delete('/Clients/:clientId', (req, res, next) => {
    Clients.splice(req.index, 1);
    res.status(204).send();
})

app.post('/Clients', (req, res, next) => {
    const clientAdded = createClient(req.query, Clients);
    if(clientAdded) {
        Clients.push(clientAdded);
        res.status(201).send(clientAdded);
    } else {
        res.status(400).send();
    }
})

app.put('/Clients/:clientId', (req, res, next) => {
    Object.assign(Clients[req.index], req.query);
    res.status(200).send(Clients[req.index]);
})

    //Seed Table

app.get('/seedTable', (req, res, next) => {
        db.all('SELECT * FROM seedTable', (err,rows) => {
            res.status(200).send(rows);
        });
});

app.get('/seedTable/:id', (req, res, next) => {
    res.status(200).send(req.targetElement);
});

app.delete('/seedTable/:id', (req, res, next) => {
    db.run('DELETE FROM seedTable WHERE id IS $id', 
    {
        $id: req.params.id
    })
    res.status(204).send();
})

app.post('/seedTable', (req, res, next) => {
        db.run('INSERT INTO seedTable(id, firstName, lastName, dob) VALUES ($id, $firstName, $lastName, $dob)',
        {
            $firstName: req.query.firstName,
            $lastName: req.query.lastName,
            $dob: req.query.dob
        })
    res.status(201).send(req.query);
})

app.put('/seedTable/:id', (req, res, next) => {
    var updatedValues = {
        $id: req.params.id,
        $firstName: req.query.firstName,
        $lastName: req.query.lastName,
        $dob: req.query.dob
    }
    db.run('UPDATE seedTable SET firstName = $firstName, lastName = $lastName, dob = $dob WHERE id IS $id',
    updatedValues);
    res.status(200).send(req.query);
})

app.listen(4001, () => {
    console.log('Server listening on 4001\n version 1.7\n');
});