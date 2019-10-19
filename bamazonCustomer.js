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

readProducts();
function readProducts() {
    console.log("Displaying all products.....");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        res.forEach(function (item) {
            console.log("\n ID: " + item.id + "     Product: " + item.product_name + "      Price: " + item.price);
        })
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

function productCheck(quantity, id) {
    connection.query("SELECT * FROM products WHERE id=" + id, function (err, res) {
        if (res[0].stock_quantity >= quantity) {
            console.log("\nThanks for purchasing " + res[0].product_name + ". Quantity " + quantity + ". Total price is $" + res[0].price * quantity);
            var updatedQuantity = res[0].stock_quantity - quantity;
            updateProduct(updatedQuantity, id);
        }
        else {
            console.log("\n\n\n\n\nInsufficient Quantity");
            readProducts();
        }
        connection.end();
    })
}

function updateProduct(quantity, id) {
    connection.query("UPDATE products SET stock_quantity = " + quantity + " WHERE id = " + id);
}