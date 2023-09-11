-- Makes due to drop the employee_tracker database if it exists and then creates it and selects to use it --
DROP DATABASE IF EXISTS employee_tracker_db;
CREATE DATABASE employee_tracker_db;
USE employee_tracker_db;

-- Creates a department table in the employee_tracker database --
CREATE TABLE department (
    id INT PRIMARY KEY,
    name VARCHAR(30)
);

-- Creates a role table in the employee_tracker database -- 
CREATE TABLE role (
    id INT PRIMARY KEY,
    title  VARCHAR(30),
    salary DECIMAL,
    department INT
);

-- Creates an employee table in the employee_tracker database --
CREATE TABLE employee (
    id INT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    title INT,
    department INT,
    salary DECIMAL,
    manager INT
);