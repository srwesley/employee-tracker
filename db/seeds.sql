USE employee_tracker_db;
-- Inserts data into the department table --
INSERT INTO department (name) VALUES
    ("Engineering"),
    ("Sales"),
    ("Finance"),
    ("Legal");

-- Inserts data into the role table --
INSERT INTO role (title, department_id, salary) VALUES
    ("Software Engineer", 1, 90000),
    ("Salesperson", 2, 65000),
    ("Accountant", 3, 110000),
    ("Lawyer", 4, 200000);

-- Inserts data into the employee table --
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES
    (1, "Natasha", "Romanoff", 1, NULL),
    (2, "Tony", "Stark", 1, NULL),
    (3, "T'Challa", "Wakanda", 2, NULL),
    (4, "Luke", "Skywalker", 2, NULL),
    (5, "Seokjin", "Kim", 3, NULL),
    (6, "Bruce", "Wayne", 3, NULL),
    (7, "Leia", "Organa", 4, NULL),
    (8, "Hermoine", "Granger", 4, NULL);