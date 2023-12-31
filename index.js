// Variable definitions and dependencies
const inquirer = require("inquirer");
const database = require("./config/connection");
const table = require("console.table");
const chalk = require("chalk");

// Start server after database connection
database.connect(err => {
    if (err) throw err;
    console.log(chalk.greenBright("            Database connected!\n"));
    employee_tracker();
});

console.log(chalk.redBright(`
 _________________________________________                              
|    _____           _                    |
|   |   __|_____ ___| |___ _ _ ___ ___    |
|   |   __|     | . | | . | | | -_| -_|   |
|   |_____|_|_|_|  _|_|___|_  |___|___|   |
|               |_|       |___|           |
|                                         |
|    _____                                |
|   |     |___ ___ ___ ___ ___ ___        |
|   | | | | .'|   | .'| . | -_|  _|       |
|   |_|_|_|__,|_|_|__,|_  |___|_|         |
|                     |___|               |
|_________________________________________|
`));

var employee_tracker = function () {
        inquirer.prompt([{
            // Begin Command Line
            type: "list",
            name: "prompt",
            message: chalk.whiteBright("What would you like to do?" + "\n"),
            choices: ["View all employees", "View all departments", "View all roles", "Add an employee", "Add a department", "Add a role", "Update an employee (Role, Department, Salary, and Manager)", "Delete an employee", "Delete a department", "Delete a role", "Log Out"]
        }]).then((answers) => {
            // Views the department table in the database
            if (answers.prompt === "View all departments") {
                database.query(`SELECT * FROM department`, (err, result) => {
                    if (err) throw err;
                    console.log("Viewing all departments:\n");
                    console.table(result);
                    employee_tracker();
                });
            } else if (answers.prompt === "View all roles") {
                database.query(`SELECT * FROM role`, (err, result) => {
                    if (err) throw err;
                    console.log("Viewing all roles:\n");
                    console.table(result);
                    employee_tracker();
                });
            } else if (answers.prompt === "View all employees") {
                database.query(`SELECT * FROM employee LEFT JOIN role ON role.id = employee.role_id LEFT JOIN department ON department.id = role.department_id`, (err, result) => {
                    if (err) throw err;
                    console.log("Viewing all employees:\n");
                    console.table(result);
                    employee_tracker();
                });
            } else if (answers.prompt === "Add a department") {
                inquirer.prompt([{
                    // Adds a department
                    type: "input",
                    name: "department",
                    message: "What is the name of the department?",
                    validate: departmentInput => {
                        if (departmentInput) {
                            return true;
                        } else {
                            console.log("Please add a department!");
                            return false;
                        }
                    }
                }]).then((answers) => {
                    database.query(`INSERT INTO department (name) VALUES (?)`, [answers.department], (err, result) => {
                        if (err) throw err;
                        console.log(`Added ${answers.department} to the database.`);
                        employee_tracker();
                    });
                })
            } else if (answers.prompt === "Add a role") {
                // Beginning with the database so that the departments can be acquired for choice
                database.query(`SELECT * FROM department`, (err, result) => {
                    if (err) throw err;
                    
                    inquirer.prompt([
                        {
                            // Adds a role
                            type: "input",
                            name: "role",
                            message: "What is the name of the role?",
                            validate: roleInput => {
                                if (roleInput) {
                                    return true;
                                } else {
                                    console.log("Please add a role!");
                                    return false;
                                }
                            }
                        },
                        {
                            // Adds a salary
                            type: "input",
                            name: "salary",
                            message: "What is the salary of the role?",
                            validate: salaryInput => {
                                if (salaryInput) {
                                    return true;
                                } else {
                                    console.log("Please add a salary!");
                                    return false;
                                }
                            }
                        },
                        {
                            //Department
                            type: "list",
                            name: "department",
                            message: "Which department does the role belong to?",
                            choices: () => {
                                var array = [];
                                for (var i = 0; i < result.length; i++) {
                                    array.push({ name: result[i].name, value: result[i].id });
                                }
                                return array;
                            }
                        }
                    ]).then((answers) => {
                        // Compares the result and stores it into the variable
                        // for (var i = 0; i < result.length; i++) {
                        //     if (result[i].name === answers.department) {
                        //         var department = result[i];
                        //     }
                        // }

                        database.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [answers.role, answers.salary, answers.department], (err, result) => {
                            if (err) throw err;
                            console.log(`Added ${answers.role} to the database.`);
                            employee_tracker();
                        });
                    })
                });
            } else if (answers.prompt === "Add an employee") {
                // Calls the database to acquire the roles and managers
                database.query(`SELECT * FROM employee, role JOIN department ON role.department_id = department.id`, (err, result) => {
                    if (err) throw err;

                    inquirer.prompt([
                        {
                            // Adds employee first name
                            type: "input",
                            name: "firstName",
                            message: "What is the employee's first name?",
                            validate: firstNameInput => {
                                if (firstNameInput) {
                                    return true;
                                } else {
                                    console.log("Please add a first name!");
                                    return false;
                                }
                            }
                        },
                        {
                            // Adds employee last name
                            type: "input",
                            name: "lastName",
                            message: "What is the employee's last name?",
                            validate: lastNameInput => {
                                if (lastNameInput) {
                                    return true;
                                } else {
                                    console.log("Please add a last name!");
                                    return false;
                                }
                            }
                        },
                        {
                            // Adds employee role
                            type: "list",
                            name: "title",
                            message: "What is the employee's role?",
                            choices: () => {
                                var array = [];
                                for (var i = 0; i < result.length; i++) {
                                    array.push({ name: result[i].title, value: result[i].role_id});
                                }
                                var newArray = [...new Set(array)];
                                return newArray;
                            }
                        },
                        {
                            // Adds employee manager
                            type: "list",
                            name: "manager",
                            message: "Who is the employee's manager?",
                            choices: () => {
                                var array = [];
                                for (var i = 0; i < result.length; i++) {
                                    array.push({ name: result[i].first_name + " " + result[i].last_name, value: result[i].id });
                                };
                                var newArray = {}
                                array.forEach(item => {
                                    newArray[item.name] = newArray[item.value];
                                });
                                var finalArray = [];
                                for (let key in newArray) {
                                    finalArray.push({name: key, value: newArray[key]})
                                };
                                // var newArray = [...new Set(array)];
                                return finalArray;
                            }
                        }
                    ]).then((answers) => {
                        // Compares the result and stores it into the variable
                        for (var i = 0; i < result.length; i++) {
                            if (result[i].title === answers.role) {
                                var role = result[i];
                            }
                        }

                        database.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [answers.firstName, answers.lastName, answers.title, answers.manager], (err, result) => {
                            if (err) throw err;
                            console.log(`Added ${answers.firstName} ${answers.lastName} to the database.`);
                            employee_tracker();
                        });
                    })
                });
            } else if (answers.prompt === "Update an employee (Role, Department, Salary, and Manager)") {
                // Calls the database to acquire the roles and managers
                database.query("SELECT * FROM employee JOIN role ON role.id = employee.role_id", (err, result) => {
                    if (err) throw err;
                    console.log(result);

                    inquirer.prompt([
                        {
                            // Chooses an employee to update
                            type: "list",
                            name: "employee",
                            message: "Which employee's role do you want to update?",
                            choices: () => {
                                const uniqueEmployees = [...new Set(result.map(row => `${row.first_name} ${row.last_name}`))];
                                console.log(uniqueEmployees);
                                return uniqueEmployees;
                            }
                        },
                        {
                            // Updates the employee's new role
                            type: "list",
                            name: "title",
                            message: "What is their new role?",
                            choices: () => {
                                const uniqueTitles = [...new Set(result.map(row => ({ name: row.title, value: row.role_id })))];
                                console.log(uniqueTitles);
                                return uniqueTitles;
                            }
                        },
                        {
                            // Updates the employee's new manager
                            type: "list",
                            name: "manager",
                            message: "Who is the employee's manager?",
                            choices: () => {
                                const uniqueManagers = [...new Set(result.map(row => ({ name: `${row.first_name} ${row.last_name}`, value: row.id })))];
                                return uniqueManagers;
                            }
                        },
                    ]).then((answers) => {
                        // Compares the result and stores it into the variable
                        const employee = result.find(row => `${row.first_name} ${row.last_name}` === answers.employee);
                        const { title, manager } = answers;
                        const values = [title, manager, employee.first_name, employee.last_name];

                        database.query("UPDATE employee SET role_id = ?, manager_id = ? WHERE first_name = ? AND last_name = ?", values, (err, result) => {
                            if (err) throw err;
                            console.log(`Updated ${employee.first_name} ${employee.last_name}'s role to ${title} under their new manager ${manager}.`);
                            employee_tracker();
                        });
                    });
                });
            } else if (answers.prompt === "Delete an employee") {
                // Calls the database to acquire the list of employees
                database.query("SELECT * FROM employee", (err, result) => {
                    if (err) throw err;

                    inquirer.prompt([
                        {
                            // Chooses an employee to delete
                            type: "list",
                            name: "employee",
                            message: "Which employee do you want to delete?",
                            choices: () => {
                                const uniqueEmployees = [...new Set(result.map(row => `${row.first_name} ${row.last_name}`))];
                                return uniqueEmployees;
                            }
                        }
                    ]).then((answers) => {
                        // Compares the result and stores it into the variable
                        const employee = result.find(row => `${row.first_name} ${row.last_name}` === answers.employee);
                        const { first_name, last_name } = employee;

                        database.query("DELETE FROM employee WHERE first_name = ? AND last_name = ?", [first_name, last_name], (err, result) => {
                            if (err) throw err;
                            console.log(chalk.redBright(`Deleted ${first_name} ${last_name} from the database!`));
                            employee_tracker();
                        });
                    });
                });
            } else if (answers.prompt === "Delete a department") {
                database.query("SELECT * FROM department", (err, result) => {
                    if (err) throw err;
                    inquirer.prompt([
                        {
                            // Chooses a department to delete
                            type: "list",
                            name: "department",
                            message: "Which department would you like to delete?",
                            choices: () => {
                                const departmentNames = result.map(row => row.name);
                                return departmentNames;
                            }
                        }
                    ]).then((answer) => {
                        // Compares the result and stores it into the variable
                        const departmentName = answer.department;
                        const department = result.find(row => row.name === departmentName);
                        const id = department.id;
                        database.query("DELETE FROM department WHERE name = ?", [department], (err, result) => {
                            if (err) throw err;
                            console.log(`Deleted department ${departmentName}.`);
                            employee_tracker();
                        });
                    });
                });
            } else if (answers.prompt === "Delete a role") {
                database.query("SELECT * FROM role", (err, result) => {
                    if (err) throw err;
                    inquirer.prompt([
                        {
                            // Chooses a role to delete
                            type: "list",
                            name: "role",
                            message: "Which role would you like to delete?",
                            choices: () => {
                                const roleTitles = result.map(row => row.title);
                                return roleTitles;
                            }
                        }
                    ]).then((answer) => {
                        // Compares the result and stores it into the variable
                        const roleTitle = answer.role;
                        const role = result.find(row => row.title === roleTitle);
                        const values = [roleTitle];
                        database.query("DELETE FROM role WHERE title = ?", values, (err, result) => {
                            if (err) throw err;
                            console.log(`Deleted role ${roleTitle}.`);
                            employee_tracker();
                        });
                    });
                });
            } else if (answers.prompt === "Log Out") {
                // Logs out of the database
                database.end();
                console.log(chalk.redBright("Have a great day!"));
            }
        })
};