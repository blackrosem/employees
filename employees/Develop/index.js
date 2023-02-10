const inquirer = require('inquirer');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const cTable = require('console.table');

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: 'password',
    database: 'company_db'
  },
  console.log(`Connected to the company_db database.`)
);


function init() {
    inquirer.prompt([{
        type: 'list',
        name: 'mySelection',
        message: 'Please select from the following:  ',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role',]
    }])
    .then((answer) => {
        makeSelection(answer);
    })
}

function makeSelection(answer) {
    var choice = answer.mySelection;
    switch(choice)
    {
        case "View all departments":
            viewDepartments();
            break;
        case "View all roles":
            viewRoles();
            break;
        case "View all employees":
            viewEmployees();
            break;
        case "Add a department":
            addDepartment();
            break;
        case "Add a role":
            addRole();
            break;
        case "Add an employee":
            addEmployee();
            break;
        case "Update an employee role":
            updateEmployeeRole();
            break;
        default:
            console.log("No choice selected");
            init();
    }
}

function viewDepartments() {
    db.query('SELECT * FROM department', function (err, results) {
        console.table(results);
      });
}

function viewRoles() {
        db.query('SELECT role.id, role.title, role.salary, department.name FROM role INNER JOIN department ON role.department_id = department.id', function (err, results){
        console.table(results);
    });
}

function viewEmployees() {
    db.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, employee.manager_id FROM employee INNER JOIN role ON employee.role_id = role.id', function (err, results){
        console.table(results);
    });
}

function addDepartment() {
    inquirer.prompt([{
        type: 'input',
        name: 'deptName',
        message: 'Name of department:  ',
    }])
    .then((reply) => {
        db.query('INSERT INTO department (name) values (?)', reply.deptName);
    })
}

function addRole() {
    var myArray = [];
    var deptNum = 0;
    db.query('SELECT * FROM department', function (err, results) {
        for(var k = 0; k < results.length; k++) {
            var item = results[k].name;
            myArray.push(item);
        }
        inquirer.prompt([{
            type: 'input',
            name: 'name',
            message: 'Name of role:  ',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Salary for role:  ',
        },
        {
            type: 'list',
            name: 'deptName',
            message: 'Department for role:  ',
            choices: myArray,
        }])
        .then((reply) => {
            for(var n = 0; n < myArray.length; n++){
                if(reply.deptName == myArray[n]) {
                    deptNum = n + 1;
                }
            }
            
            var query = `INSERT INTO role (title, salary, department_id) values (${reply.name},${reply.salary},${deptNum})`;
            db.query('INSERT INTO role (title, salary, department_id) values (?,?,?)', [reply.name, reply.salary, deptNum]);
        })
    });

}

function addEmployee() {
    var myArray = [];
    var myArray2 = [];
    var roleNum = 0;
    var managerNum = 0;
    db.query('SELECT * FROM role', function (err, results) {
        for(var k = 0; k < results.length; k++) {
            var item = results[k].title;
            myArray.push(item);
        }
        db.query('SELECT first_name, last_name FROM employee', function (err, results2) {
            for(var m = 0; m < results2.length; m++) {
                var item2 = results2[m].first_name + " " + results2[m].last_name;
                myArray2.push(item2);
            }
            inquirer.prompt([{
                type: 'input',
                name: 'fname',
                message: 'First name:  ',
            },
            {
                type: 'input',
                name: 'lname',
                message: 'Last name:  ',
            },
            {
                type: 'list',
                name: 'role',
                message: 'Employee role:  ',
                choices: myArray,
            },
            {
                type: 'list',
                name: 'manager',
                message: 'Select the manager',
                choices: myArray2,
            }])
            .then((reply) => {
                for(var n = 0; n < myArray.length; n++){
                    if(reply.role == myArray[n]) {
                        roleNum = n + 1;
                    }
                }
                for(var p = 0; p < myArray2.length; p++){
                    if(reply.manager == myArray2[p]) {
                        managerNum = p + 1;
                    }
                }
                
                db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) values (?,?,?,?)', [reply.fname, reply.lname, roleNum, managerNum]);
            })
        })
        })
        
    
}


function updateEmployeeRole() {
    var myArray = [];
    var myArray2 = [];
    var roleNum = 0;
    var empNum = 0;
    db.query('SELECT * FROM role', function (err, results) {
        for(var k = 0; k < results.length; k++) {
            var item = results[k].title;
            myArray.push(item);
        }
        db.query('SELECT first_name, last_name FROM employee', function (err, results2) {
            for(var m = 0; m < results2.length; m++) {
                var item2 = results2[m].first_name + " " + results2[m].last_name;
                myArray2.push(item2);
            }
            inquirer.prompt([
            {
                type: 'list',
                name: 'role',
                message: 'Employee role:  ',
                choices: myArray,
            },
            {
                type: 'list',
                name: 'emp',
                message: 'Select employee',
                choices: myArray2,
            }])
            .then((reply) => {
                for(var n = 0; n < myArray.length; n++){
                    if(reply.role == myArray[n]) {
                        roleNum = n + 1;
                    }
                }
                for(var p = 0; p < myArray2.length; p++){
                    if(reply.emp == myArray2[p]) {
                        empNum = p + 1;
                    }
                }
                
                db.query('UPDATE employee SET role_id = ? WHERE id = ?', [roleNum, empNum]);
            })
        })
        })
}

init();