-- Makes due to drop the employee_tracker database if it exists and then creates it and selects to use it --
DROP DATABASE IF EXISTS employee_tracker_db;
CREATE DATABASE employee_tracker_db;
USE employee_tracker_db;

-- Creates a department table in the employee_tracker database --
CREATE TABLE department (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30)
);

-- Creates a role table in the employee_tracker database -- 
CREATE TABLE role (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title  VARCHAR(30),
    salary INT,
    department_id INT,
    FOREIGN KEY (department_id) references department(id)
);

-- Creates an employee table in the employee_tracker database --
CREATE TABLE employee (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    FOREIGN KEY (role_id) references role(id),
    manager_id INT,
    FOREIGN KEY (manager_id) references employee(id)
);