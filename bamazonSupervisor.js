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

supervisorSelection();

function supervisorSelection() {
    inquirer
      .prompt({
        name: "selection",
        type: "list",
        message: "Choose from the following options",
        choices: ["View Product Sales by Department", "Create New Department"]
      })
      .then(function(answer) {
        if (answer.selection === "View Product Sales by Department") {
            viewProductSales();
          }
          else {
            newDepartment();
          }
    });
}

function viewProductSales() {
    connection.query("SELECT departments.id, departments.department_name," +
     "departments.over_head_costs, sum(products.product_sales) product_sum FROM departments INNER JOIN products ON departments.department_name = products.department_name GROUP BY departments.id", 
     function (err, res) {
        if (err) throw err;
        var values = [];
        var value;
        res.forEach(function (item) {
            value = [item.id, item.department_name, item.over_head_costs, item.product_sum, (item.product_sum-item.over_head_costs) ];
            values.push(value);
        });
        console.log("\n\n");
        console.table(['id', 'department', 'overhead costs', 'product_sales', 'total profit'], values);
    });
    connection.end();
}

function newDepartment() {
    inquirer
    .prompt([
        {
            name: "departmentName",
            type: "input",
            message: "Input the new department",
        }
    ])
    .then(function (answer) {
        connection.query(
            "INSERT INTO departments SET ?",
            {
              department_name: answer.departmentName,
            },
            function(err, res) {
              if (err) throw err;
            }
        );
        console.log("\n New department Added")
        connection.end();
    });
}