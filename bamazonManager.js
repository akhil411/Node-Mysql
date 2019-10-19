var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root@00411",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
});

managerSelection();

function managerSelection() {
    inquirer
      .prompt({
        name: "selection",
        type: "list",
        message: "Choose from the following options",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
      })
      .then(function(answer) {
        if (answer.selection === "View Products for Sale") {
            viewProducts();
          }
          else if(answer.selection === "View Low Inventory") {
            lowInventory();
          } 
          else if(answer.selection === "Add to Inventory") {
            addInventory();
          }
          else {
            newProduct();
          }
    });
}

function viewProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        res.forEach(function (item) {
            console.log("\n ID: " + item.id + "     Product: " + item.product_name + "      Price: " + item.price + "       Stock Quantity: "+ item.stock_quantity);
        });
    });
    connection.end();
}

function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
        if (err) throw err;
        res.forEach(function (item) {
            console.log("\n ID: " + item.id + "     Product: " + item.product_name + "      Price: " + item.price + "       Stock Quantity: "+ item.stock_quantity);
        });
    });
    connection.end();
}

function addInventory() {
    inquirer
        .prompt([
            {
                name: "idChoice",
                type: "input",
                message: "Input the ID of the product you want to add",
            },
            {
                name: "quantityChoice",
                type: "input",
                message: "Input the number of quantity you want to add",
            }
        ])
        .then(function (answer) {
            connection.query("SELECT * FROM products WHERE id=" + answer.idChoice, function (err, res) {
                    console.log("\n" + answer.quantityChoice + " quantity of " + res[0].product_name + " added.");
                    var updatedQuantity = parseInt(res[0].stock_quantity) + parseInt(answer.quantityChoice);
                    updateProduct(updatedQuantity, answer.idChoice);
            });
        });
} 

function updateProduct(quantity, id) {
    connection.query("UPDATE products SET stock_quantity = " + quantity + " WHERE id = " + id);
    connection.end();
}

function newProduct() {
    inquirer
    .prompt([
        {
            name: "productName",
            type: "input",
            message: "Input the new product name",
        },
        {
            name: "departmentName",
            type: "input",
            message: "Input the department name of the new product",
        },
        {
            name: "price",
            type: "input",
            message: "Input the price of new product",
        },
        {
            name: "stockQuantity",
            type: "input",
            message: "Input the intial stock of new product",
        }
    ])
    .then(function (answer) {
        connection.query(
            "INSERT INTO products SET ?",
            {
              product_name: answer.productName,
              department_name: answer.departmentName,
              price: answer.price,
              stock_quantity: answer.stockQuantity
            },
            function(err, res) {
              if (err) throw err;
            }
        );
        console.log("\n New product Added")
        connection.end();
    });
}