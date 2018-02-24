-- SCHEMA
DROP DATABASE IF EXISTS bamazonDB;
CREATE DATABASE bamazonDB;
USE bamazonDB;

CREATE TABLE products(
  itemId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  productName VARCHAR(100) NOT NULL,
  departmentName VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NULL,
  stockQuantity INT default 0
);

-- SEEDS
INSERT INTO products (productName, departmentName, price, stockQuantity)
VALUES ("Nuka Cola", "Beverages", 1.75, 52),
("Nuka Cola Quantum", "Beverages", 2.25, 3),
("InstaMash", "Packaged Mix", 4.45, 24),
("Sugar Bombs", "Cereals", 2.87, 2),
("Yum Yum Deviled Eggs", "Snacks", 6.00, 5),
("Fancy Lads Snack Cakes", "Snacks", 4.75, 34),
("Dandy Boy Apples", "Snacks", 1.65, 10),
("Cram 2-Pack", "Canned Meat", 10.99, 2),
("Blamco Brand Mac and Cheese", "Packaged Mix", 1.25, 27);