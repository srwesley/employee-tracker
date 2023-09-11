-- Inserts data into the department table --
INSERT INTO department (name) VALUES
    ("Engineering"),
    ("Sales"),
    ("Finance"),
    ("Legal");

-- Inserts data into the role table --
INSERT INTO role (title, department, salary) VALUES
    ("Software Engineer", "Engineering", "90000"),
    ("Salesperson", "Sales", "65000"),
    ("Accountant", "Finance", "110000"),
    ("Lawyer", "Legal", "200000");

-- Inserts data into the employee table --
INSERT INTO employee (id, first_name, last_name, title, department, salary, manager) VALUES
    (1, "Natasha", "Romanoff", "Software Engineer", "Engineering", "90000", NULL),
    (2, "Tony", "Stark", "Software Engineer", "Engineering", "65000", "Natasha Romanoff"),
    (3, "T'Challa", "Wakanda", "Salesperson", "Sales", "75000", NULL),
    (4, "Luke", "Skywalker", "Salesperson", "Sales", "55000", "T'Challa Wakanda"),
    (5, "Seokjin", "Kim", "Accountant", "Finance", "110000", NULL),
    (6, "Bruce", "Wayne", "Accountant", "Finance", "90000", "Seokjin Kim"),
    (7, "Leia", "Organa", "Lawyer", "Legal", "200000", NULL),
    (8, "Hermoine", "Granger", "Lawyer", "Legal", "100000", "Leia Organa");