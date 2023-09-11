-- Makes due to drop the employee_tracker database if it exists and then creates it and selects to use it --
DROP DATABASE IF EXISTS employee_tracker_db;
CREATE DATABASE employee_tracker_db;
USE employee_tracker_db;

-- Creates a department table in the employee_tracker database --
CREATE TABLE department (
    name VARCHAR(30) PRIMARY KEY
);

-- Creates a role table in the employee_tracker database -- 
CREATE TABLE role (
    title  VARCHAR(30) PRIMARY KEY,
    department VARCHAR(30),
    salary DECIMAL
);

-- Creates an employee table in the employee_tracker database --
CREATE TABLE employee (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    title VARCHAR(30),
    department VARCHAR(30),
    salary DECIMAL,
    manager VARCHAR(30)
);