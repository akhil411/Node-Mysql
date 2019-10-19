CREATE DATABASE bamazon;
CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NULL,
  department_name VARCHAR(45) NULL,
  price INT NULL,
  stock_quantity INT NULL,
  PRIMARY KEY (id)
);

insert into products(product_name, department_name, price, stock_quantity)
values ("mask", "clothing", 20, 9),
("pen drive 16GB", "electronics", 15, 15),
("pen", "stationary", 1, 35),
("wallet", "stationary", 5, 4),
("keyboard", "electronics", 11, 3),
("cap", "clothing", 2, 11),
("watch", "electronics", 54, 2),
("clock", "stationary", 8, 13),
("socks", "clothing", 5, 20),
("hard disk", "electronics", 99, 4);
