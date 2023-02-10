INSERT INTO department (name)
VALUES ("Administrative"),
        ("Housekeeping"),
        ("IT");

INSERT INTO role (title, salary, department_id)
VALUES ("Manager", 100000, 1),
        ("Assistant Manager", 65000, 1),
        ("Painter", 30000, 2),
        ("Maintenance", 45000, 2),
        ("Database Administrator", 90000, 3),
        ("Program Lead", 80000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Tom", "Sawyer", 1, 1),
        ("Becky", "Thatcher", 2, 1);
