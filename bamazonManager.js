//require mysql and inquirer
var mysql = require("mysql");
var inquirer = require("inquirer");
//required for table display with borders
const {table} = require("table");
const {getBorderCharacters} = require("table");
let data, output; //I think this is E6, which we haven't covered yet, but it was needed for table to work correctly.
//required to add color to display (Table header and intro)
var colors = require("colors");

//create connection to db
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "",
	database: "bamazondb"
});

//created the header for the table of products and adds color for them to make them stand out.
var productArray = [[
	"Item ID:".yellow, 
	"Product:".cyan, 
	"Department:".cyan, 
	"Price:".cyan, 
	"Quantity:".cyan
]];

//Gets a predefined border pattern for table.  Thanks to Elliot for help on getting this working correctly.  The table is built below and passed to this function which then formats it and displays it on the screen.
var displayTable = function() {
	let config,
		output;
	config = {
		border: getBorderCharacters("honeywell")
	};
	output = table(productArray, config);
	console.log(output);
};

//sets display to the top of the screen
function clearScreen() {
process.stdout.write("\x1B[2J\x1B[0f");
};

function start(){
	inquirer.prompt([{
		type: "list",
		name: "doThing",
		message: "What would you like to do?",
		choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", new inquirer.Separator(), "End Session"]
	}]).then(function(answers){
		switch(answers.doThing){
			case "View Products for Sale": 
				viewProducts();
				break;
			case "View Low Inventory": 
				viewLowInventory();
				break;
			case "Add to Inventory": 
				addToInventory();
				break;
			case "Add New Product": 
				addNewProduct();
				break;
			case "End Session": 
				clearScreen();
				console.log("     Thank you for using the".bgBlue.cyan + " Bamazon Managers Dashboard.".bgBlue.yellow + "  Goodbye!     ".bgBlue.cyan);
				connection.end();
				process.exit();
			default:
				clearScreen();
				console.log("     Something went horribly wrong. SAVE YOURSELF!! Goodbye!      ".bgRed.white);
				connection.end();
				process.exit();
    }
  });
};
//views all inventory
function viewProducts(){
//Builds a temp array from the data in the database builds the items for sale and their details as a single table.
	productArray = [["Item ID:".yellow, "Product:".cyan, "Department:".cyan, "Price:".cyan, "Quantity:".cyan]];
	connection.query("SELECT * FROM products", function(err, results){
		if(err) throw err;

		for(var i = 0; i < results.length; i++){
			var tempArray = [];
			tempArray.push(results[i].itemId);
			tempArray.push(results[i].productName);
			tempArray.push(results[i].departmentName);
			tempArray.push(results[i].price);
			tempArray.push(results[i].stockQuantity);
			productArray.push(tempArray);  
		}
//CALL Function that formats the table and then displays it on the screen
		console.log("Viewing".cyan + " All".yellow + " Inventory Items".cyan);
		displayTable();
		start();
	});
};
//viewLowInventory views inventory lower than quantity 5
function viewLowInventory(){
	productArray = [[
		"Item ID:".yellow, 
		"Product:".cyan, 
		"Department:".cyan, 
		"Price:".cyan, 
		"Quantity:".cyan
	]];
	connection.query("SELECT * FROM products", function(err, results){
		if(err) throw err;
		clearScreen();
		for(var i = 0; i < results.length; i++){
			if(results[i].stockQuantity <= 5){
				var tempArray = [];
				tempArray.push(results[i].itemId);
				tempArray.push(results[i].productName);
				tempArray.push(results[i].departmentName);
				tempArray.push(results[i].price);
				tempArray.push(results[i].stockQuantity);
				productArray.push(tempArray);  
			}
		}
//CALL Function that formats the table and then displays it on the screen
		clearScreen();
		console.log("Viewing".cyan + " Low".yellow + " Inventory Items \(qty <= 5\)".cyan);
		displayTable();
		start();
	});
};

//displays prompt to add more of an item to the store and asks how much
function addToInventory(){
	clearScreen();
	console.log("          Update Bamazon Inventory          ".bgWhite.red);

	connection.query("SELECT * FROM products", function(err, results){
		if(err) throw err;
		var itemArray = [];
		//pushes each item into an itemArray
		for(var i=0; i<results.length; i++){
		itemArray.push(results[i].productName);
	}
	inquirer.prompt([{
		type: "list",
		name: "product",
		choices: itemArray,
		message: "For which item would you like to increase inventory?"
	},
	{
		type: "input",
		name: "qty",
		message: "Increase by how much?",
		validate: function(value){
			if(isNaN(value) === false){return true;}
			else{return false;}
		}
    }]).then(function(answers){
			var currentQty;
			for(var i=0; i<results.length; i++){
				if(results[i].productName === answers.product){
				  currentQty = results[i].stockQuantity;
				}
			}
			connection.query("UPDATE products SET ? WHERE ?", [
				{stockQuantity: currentQty + parseInt(answers.qty)},
				{productName: answers.product}
			], function(err, results){
				if(err) throw err;
				console.log(colors.bgYellow.blue("The quantity for "+ answers.product + " was updated by " + parseInt(answers.qty) + " \(New Total: " + (currentQty + parseInt(answers.qty)) + "\)"));
				start();
			});
		})
	});
};

//allows manager to add a completely new product to store
function addNewProduct(){
	clearScreen();
	console.log("          Adding New Product          ".bgRed.white);
	var deptNames = [];

  //grab name of departments
	connection.query("SELECT * FROM products", function(err, results){
		if(err) throw err;
		for(var i = 0; i<results.length; i++){
		  deptNames.push(results[i].departmentName);
		}
	})
	inquirer.prompt([{
		type: "input",
		name: "product",
		message: "Product: ",
		validate: function(value){
			if(value){
				return true;
			}
			else {
				return false;
			}
		}
	}, 
	{
		type: "list",
		name: "department",
		message: "Department: ",
		choices: deptNames
	}, 
	{
		type: "input",
		name: "price",
		message: "Price: ",
		validate: function(value){
			if(isNaN(value) === false){return true;}
			else{return false;}
    }
	},
	{
		type: "input",
		name: "quantity",
		message: "Quantity: ",
		validate: function(value){
			if(isNaN(value) == false){return true;}
			else{return false;}
    }
	}])
	.then(function(answers){
		connection.query("INSERT INTO products SET ?",{
			productName: answers.product,
			departmentName: answers.department,
			price: answers.price,
			stockQuantity: answers.quantity
		}, function(err, results){
			if(err) throw err;
		})
		clearScreen();
		console.log(colors.bgBlue.white(answers.product + " was successfully added as a new item.\n"));
		start();
	});	
	
};

//TO START, I clear the screen, console log the intro text and then start the app.
clearScreen();
//Managers Dashboard welcoming message
console.log("Welcome to the".bgBlue.cyan + " Bamazon Managers Dashboard!".bgBlue.yellow);
start();