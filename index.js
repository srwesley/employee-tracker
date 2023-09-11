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
            choices: ["View all employees", "View all departments", "View all roles", "Add an employee", "Add a department", "Add a role", "Update an employee (Role, Department, Salary, Manager)", "Delete an employee", "Delete a department", "Delete a role", "Log Out"]
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
                database.query(`SELECT * FROM employee`, (err, result) => {
                    if (err) throw err;
                    console.log("Viewing all employees:\n");
                    console.table(result);
                    employee_tracker();
                });
            } else if (answers.prompt === "Add a department") {
                inquirer.prompt([{
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
                database.query(`SELECT * FROM department`, (err, result) => {
                    if (err) throw err;
                    
                    inquirer.prompt([
                        {
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
                            type: "list",
                            name: "department",
                            message: "Which department does the role belong to?",
                            choices: () => {
                                var array = [];
                                for (var i = 0; i < result.length; i++) {
                                    array.push(result[i].name);
                                }
                                return array;
                            }
                        }
                    ]).then((answers) => {
                        for (var i = 0; i < result.length; i++) {
                            if (result[i].name === answers.department) {
                                var department = result[i];
                            }
                        }

                        database.query(`INSERT INTO role (title, salary, department) VALUES (?, ?, ?)`, [answers.role, answers.salary, answers.department], (err, result) => {
                            if (err) throw err;
                            console.log(`Added ${answers.role} to the database.`);
                            employee_tracker();
                        });
                    })
                });
            } else if (answers.prompt === "Add an employee") {
                database.query(`SELECT * FROM employee, role`, (err, result) => {
                    if (err) throw err;

                    inquirer.prompt([
                        {
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
                            type: "list",
                            name: "title",
                            message: "What is the employee's role?",
                            choices: () => {
                                var array = [];
                                for (var i = 0; i < result.length; i++) {
                                    array.push(result[i].title);
                                }
                                var newArray = [...new Set(array)];
                                return newArray;
                            }
                        },
                        {
                            type: "list",
                            name: "department",
                            message: "What is the employee's department?",
                            choices: () => {
                                var array = [];
                                for (var i = 0; i < result.length; i++) {
                                    array.push(result[i].department);
                                }
                                var newArray = [...new Set(array)];
                                return newArray;
                            }
                        },
                        {
                            type: "number",
                            name: "salary",
                            message: "What is the employee's salary?",
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
                            type: "list",
                            name: "manager",
                            message: "Who is the employee's manager?",
                            choices: () => {
                                var array = [];
                                for (var i = 0; i < result.length; i++) {
                                    array.push(result[i].first_name + " " + result[i].last_name);
                                }
                                var newArray = [...new Set(array)];
                                return newArray;
                            }
                        }
                    ]).then((answers) => {
                        for (var i = 0; i < result.length; i++) {
                            if (result[i].title === answers.role) {
                                var role = result[i];
                            }
                        }

                        database.query(`INSERT INTO employee (first_name, last_name, title, department, salary, manager) VALUES (?, ?, ?, ?, ?, ?)`, [answers.firstName, answers.lastName, answers.title, answers.department, answers.salary, answers.manager], (err, result) => {
                            if (err) throw err;
                            console.log(`Added ${answers.firstName} ${answers.lastName} to the database.`);
                            employee_tracker();
                        });
                    })
                });
            } else if (answers.prompt === "Update an employee (Role, Department, Salary, and Manager") {
                database.query("SELECT * FROM employee", (err, result) => {
                    if (err) throw err;

                    inquirer.prompt([
                        {
                            type: "list",
                            name: "employee",
                            message: "Which employee's role do you want to update?",
                            choices: () => {
                                const uniqueEmployees = [...new Set(result.map(row => `${row.first_name} ${row.last_name}`))];
                                return uniqueEmployees;
                            }
                        },
                        {
                            type: "list",
                            name: "title",
                            message: "What is their new role?",
                            choices: () => {
                                const uniqueTitles = [...new Set(result.map(row => row.title))];
                                return uniqueTitles;
                            }
                        },
                        {
                            type: "list",
                            name: "department",
                            message: "What is their new department?",
                            choices: () => {
                                const uniqueDepartments = [...new Set(result.map(row => row.department))];
                                return uniqueDepartments;
                            }
                        },
                        {
                            type: "input",
                            name: "salary",
                            message: "What is the employee's new salary?",
                            validate: salaryInput => {
                                const isValid = !isNaN(parseFloat(salaryInput));
                                return isValid || "Please enter a number.";
                            }
                        },
                        {
                            type: "list",
                            name: "manager",
                            message: "Who is the employee's manager?",
                            choices: () => {
                                const uniqueManagers = [...new Set(result.map(row => `${row.first_name} ${row.last_name}`))];
                                return uniqueManagers;
                            }
                        },
                    ]).then((answers) => {
                        const employee = result.find(row => `${row.first_name} ${row.last_name}` === answers.employee);
                        const { title, department, salary, manager } = answers;
                        const values = [title, department, salary, manager, employee.first_name, employee.last_name];

                        database.query("UPDATE employee SET title = ?, department = ?,  salary = ?, manager = ? WHERE first_name = ? AND last_name = ?", values, (err, result) => {
                            if (err) throw err;
                            console.log(`Updated ${employee.first_name} ${employee.last_name}'s role to ${title} in the ${department} department witht their new manager ${manager} and a new salary of $${salary}.`);
                            employee_tracker();
                        });
                    });
                });
            } else if (answers.prompt === "Delete an employee") {
                database.query("SELECT * FROM employee", (err, result) => {
                    if (err) throw err;

                    inquirer.prompt([
                        {
                            type: "list",
                            name: "employee",
                            message: "Which employee do you want to delete?",
                            choices: () => {
                                const uniqueEmployees = [...new Set(result.map(row => `${row.first_name} ${row.last_name}`))];
                                return uniqueEmployees;
                            }
                        }
                    ]).then((answers) => {
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
                            type: "list",
                            name: "department",
                            message: "Which department would you like to delete?",
                            choices: () => {
                                const departmentNames = result.map(row => row.name);
                                return departmentNames;
                            }
                        }
                    ]).then((answer) => {
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
                            type: "list",
                            name: "role",
                            message: "Which role would you like to delete?",
                            choices: () => {
                                const roleTitles = result.map(row => row.title);
                                return roleTitles;
                            }
                        }
                    ]).then((answer) => {
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
                database.end();
                console.log(chalk.redBright("Have a great day!"));
            }
        })
};