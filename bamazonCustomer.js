var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');
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

readProducts();
function readProducts() {
    console.log("Displaying all products.....");
    var values = [];
    var value;
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        res.forEach(function (item) {
            value = [item.id, item.product_name, item.price];
            values.push(value);
        })
        console.log("\n\n");
        console.table(['id', 'Product', 'Price'], values);
        productSelection();
    });
}


function productSelection() {
    inquirer
        .prompt([
            {
                name: "idChoice",
                type: "input",
                message: "Input the product ID you want to buy",
            },
            {
                name: "quantityChoice",
                type: "input",
                message: "Input the number of products you want to buy",
            }
        ])
        .then(function (answer) {
            console.log("\nYou Selected " + answer.quantityChoice + " quantity of ID " + answer.idChoice);
            productCheck(answer.quantityChoice, answer.idChoice);
        });
}

function productCheck(quantityChoice, id) {
    connection.query("SELECT * FROM products WHERE id=" + id, function (err, res) {
        if (res[0].stock_quantity >= quantityChoice) {
            console.log("\nThanks for purchasing " + res[0].product_name + ". Quantity " + quantityChoice + ". Total price is $" + res[0].price * quantityChoice);
            var updatedQuantity = res[0].stock_quantity - quantityChoice;
            var productSales = res[0].price * quantityChoice;
            updateProduct(updatedQuantity, id, productSales);
        }
        else {
            console.log("\n\n\n\n\nInsufficient Quantity");
            readProducts();
        }
        connection.end();
    })
}

function updateProduct(updatedQuantity, id, productSales) {
    connection.query("UPDATE products SET stock_quantity = " + updatedQuantity + ", product_sales = " + productSales + " WHERE id = " + id);
}