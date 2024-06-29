CREATE SCHEMA munchies;

CREATE TABLE munchies.Users (
	id INT AUTO_INCREMENT PRIMARY KEY,
    emailAddress VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO munchies.Users (emailAddress, password)
VALUES
('john.doe@gmail.com','example_unhashed_password_123'), 
('jane.doe@gmail.com','another_unhashed_password_456');

SELECT * FROM munchies.Users;

CREATE TABLE munchies.Products (
	id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL,
    deleted BOOL NOT NULL,
    upsellProductId INT NULL,
    updatedAt TIMESTAMP NULL DEFAULT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO munchies.Products (name, description, price, quantity, deleted, upsellProductId)
VALUES
('Rabbit R1', 'Pocket-sized AI assistant that seems to provide little to no assistance.', 559.99, 999, true, null),
('Samsung Galaxy AI', 'Yet another product that uses AI.', 999999.50, 1, false, null),
('Product A', 'A product to make this APIs testing a little easier (your welcome).', 79.00, 23, false, null),
('Product B', 'Unicorn-powered cheese grater that doubles as a time-traveling hat for adventurous squirrels.', 29.00, 41, false, 3);

SELECT * FROM munchies.Products;

CREATE TABLE munchies.Transactions (
	id INT AUTO_INCREMENT PRIMARY KEY,
    productId INT NOT NULL,
    quantity INT NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (productId) REFERENCES munchies.Products(id)
);

INSERT INTO munchies.Transactions (productId, quantity, total)
VALUES
(3, 14, 1106.00),
(4, 3, 87.00);

SELECT * FROM munchies.Transactions;
