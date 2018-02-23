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
})

//created the header for the table of products and adds color for them to make them stand out.
var productArray = [[
	"Item ID:".yellow, 
	"Product:".cyan, 
	"Department:".cyan, 
	"Price:".cyan, 
	"Quantity:".cyan
]];

//Gets a predefined boarder pattern for table.  Thanks to Elliot for help on getting this working correctly.  The table is built below and passed to this function which then formats it and displays it on the screen.
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

//asks if they would like to purchase another item: Yes takes them to the next question.  No takes them to the outro image and text and ends the app.  If an error occurs, the default displays an error message and ends the app.
function reprompt(){
	inquirer.prompt([{
		type: "list",
		name: "reply",
		message: "Would you like to purchase another item?",
		choices: ["Yes", "No"]
  }]).then(function(answers){
		switch(answers.reply){
			case "Yes": 
				clearScreen();
				start();
				break;
			case "No":
				clearScreen();
				console.log("\n               Have a swell day!  Thank You for Shopping At              \n".cyan);
				console.log(bamazonia);
				connection.end();
				process.exit();
				break;
			default:
				clearScreen();
				console.log("Something went horribly wrong. SAVE YOURSELF!! Goodbye!");
				connection.end();
				process.exit();
		};

  });
};

function start(){
//Builds a temp array from the data in the database builds the items for sale and their details as a single table.
	productArray = [["Item ID:".yellow, "Product:".cyan, "Department:".cyan, "Price:".cyan, "Quantity:".cyan]];
	connection.query("SELECT * FROM products", function(err, results){
		if(err) throw err;
		clearScreen();
		for(var i = 0; i < results.length; i++){
			var tempArray = [];
			tempArray.push(results[i].itemId).yellow;
			tempArray.push(results[i].productName);
			tempArray.push(results[i].departmentName);
			tempArray.push(results[i].price);
			tempArray.push(results[i].stockQuantity);
			productArray.push(tempArray);  
		}
//CALL Function that formats the table and then displays it on the screen
		displayTable();

	inquirer.prompt([{
      type: "input",
      name: "id",
      message: "Please enter Item ID of the product you wish to purchase (or 'q' to quit):",
      validate: function(value){
        if (value === "q") {
			clearScreen();
			console.log("\n               Have a swell day!  Thank You for Shopping At              \n".cyan);
			console.log(bamazonia);
			connection.end();
			process.exit();
		}
		else if(isNaN(value) == false && parseInt(value) <= results.length && parseInt(value) > 0){
          return true;
        } 
		else {
          return false;
        }
      }
    },
    {
		type: "input",
		name: "qty",
		message: "How many would you like to purchase?",
		validate: function(value){
			if(isNaN(value)){
				return false;
        } 
		else {
			return true;
        }
      }
    }
    ]).then(function(answers){
      var whatToBuy = (answers.id)-1;
      var howMuchToBuy = parseInt(answers.qty);
      var grandTotal = parseFloat(((results[whatToBuy].price)*howMuchToBuy).toFixed(2));

      //check if quantity is sufficient
      if(results[whatToBuy].stockQuantity >= howMuchToBuy){
        //after purchase, updates quantity in products
        connection.query("UPDATE products SET ? WHERE ?", [
        {stockQuantity: (results[whatToBuy].stockQuantity - howMuchToBuy)},
        {itemId: answers.id}
        ], function(err, result){
            if(err) throw err;
            console.log("Thank You! Your total is $" + grandTotal.toFixed(2) + ". Please take your items, or...");
			reprompt();
        });
      } else{
        console.log("Sorry, we don't have enough stock to complete your order!");
		reprompt();
      }

    })
})
}
// intro screen banner for bamazon...
var bamazonia = (
	" /$$$$$$$   /$$$$$$  /$$      /$$  /$$$$$$  /$$$$$$$$  /$$$$$$  /$$   /$$\n".red +
	"| $$__  $$ /$$__  $$| $$$    /$$$ /$$__  $$|_____ $$  /$$__  $$| $$$ | $$\n".red +
	"| $$  \\ $$| $$  \\ $$| $$$$  /$$$$| $$  \\ $$     /$$/ | $$  \\ $$| $$$$| $$\n".white +
	"| $$$$$$$ | $$$$$$$$| $$ $$/$$ $$| $$$$$$$$    /$$/  | $$  | $$| $$ $$ $$\n".white +
	"| $$__  $$| $$__  $$| $$  $$$| $$| $$__  $$   /$$/   | $$  | $$| $$  $$$$\n".white +
	"| $$  \\ $$| $$  | $$| $$\\  $ | $$| $$  | $$  /$$/    | $$  | $$| $$\\  $$$\n".blue +
	"| $$$$$$$/| $$  | $$| $$ \\/  | $$| $$  | $$ /$$$$$$$$|  $$$$$$/| $$ \\  $$\n".blue +
	"|_______/ |__/  |__/|__/     |__/|__/  |__/|________/ \\______/ |__/  \\__/\n".blue);

	
//TO START, I clear the screen, console log the intro text and bamazonia banner	for 3.5 seconds and then start the app.
clearScreen();
//intro text welcoming customer
console.log("\n          Welcome Valued Customer!  Enjoy Your Time Shopping At          \n".italic.cyan);
console.log(bamazonia);
setTimeout(function(){	
	start();
}, 3500);
