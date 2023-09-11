DROP DATABASE IF EXISTS employee_tracker_db;
CREATE DATABASE employee_tracker_db;
USE employee_tracker_db;

CREATE TABLE department (
    name VARCHAR(30) PRIMARY KEY
);

CREATE TABLE role (
    title  VARCHAR(30) PRIMARY KEY,
    department VARCHAR(30),
    salary DECIMAL
);

CREATE TABLE employee (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    title VARCHAR(30),
    department VARCHAR(30),
    salary DECIMAL,
    manager VARCHAR(30)
);