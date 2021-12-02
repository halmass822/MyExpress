const sqlite = require('sqlite3');
const db = new sqlite.Database('./contractors.sqlite')

const firstNames = ['Alex', 'Abraham', 'Ajay', 'Andrew', 'Bart', 'Barry', 'Brady', 'Bradley', 'Cory', 'Charlie', 'Camille', 'Carrie', 'Frank', 'Francesca', 'Grace', 'Hazem', 'Harry', 'Ingrid', 'Jack', 'Julie', 'Kerry', 'Lawrence', 'Marcus', 'Marie', 'Nancy', 'Oscar', 'Peter', 'Quincy', 'Raymond', 'Sally', 'Tim', 'Tali', 'Victor', 'Winfred', 'Xavier', 'Zachary'];
const lastNames = ['Armaud', 'Brown', 'Cameron', 'Darby', 'Erb', 'Faust', 'George', 'Henry', 'Irving', 'Kalman', 'Leonid', 'Marvolo', 'Nicholas', 'Oak', 'Parker', 'Rink', 'Simons', 'Smith', 'Terrence', 'Unger', 'Winston', 'Zeigler'];

const digitize = (input) => { //turns one digit inputs into 2 i.e 1 into 01, 5 into 05, 10 into 10
    if(input < 10) {
        return '0' + String(input);
    } else {
        return String(input);
    }
}

const randomDOB = (format = 'yyyymmdd') => {

    if(typeof(format) !== 'string') {
        throw console.error('Error: input for randomDOB() is not a string');
    }

    let year = String(1975 + Math.floor(Math.random() * 25)); //random birth year to get an age between 20 and 55
    let month = digitize(Math.floor(Math.random() * 11) + 1);
    let day = digitize(Math.floor(Math.random() * 27) + 1); //random day between 1st and 28th. God help me if I get someone with a date of birth on the 29th day or over in production

    switch (format) {
        case 'yyyymmdd':
            return year + month + day
            break;
        case 'mmddyyyy':
            return month + day + year
            break;
        case 'ddmmyyyy':
            return day + month + year
            break;
        default:
            console.error('invalid DOB format in randomDOB, defaulting to yyyymmdd')
            return year + month + day
            break;
    }
};

const createTestArray = (length = 20, format = 'yyyymmdd') => {
    let output =[];
    for(i = 1; i < (length + 1); i++) {
        output.push({
            id: i,
            firstName: firstNames[Math.floor(Math.random() * (firstNames.length - 1))],
            lastName: lastNames[Math.floor(Math.random() * (lastNames.length - 1))],
            dob: randomDOB(format)
        })
    }
    return output;
}

const seedDataTable = (length) => {
    db.serialize(() => {
        db.run('DROP TABLE IF EXISTS seedTable');
        db.run('CREATE TABLE seedTable(id INTEGER PRIMARY KEY, firstName TEXT, lastName TEXT, dob VARCHAR(8))');
        createTestArray(length).forEach(seedElement => {
            db.run('INSERT INTO seedTable(id, firstName, lastName, dob) VALUES($id, $firstName, $lastName, $dob)', 
            {
                $id: seedElement.id,
                $firstName: seedElement.firstName,
                $lastName: seedElement.lastName,
                $dob: seedElement.dob
            })
        })
    })
}

module.exports = { createTestArray, seedDataTable }