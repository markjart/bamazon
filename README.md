# Bamazon 
### A Command Line Storefront Powered by Node.js and MySQL

## Getting Started

- Clone this repository.
- Run command in Gitbash "npm install".
- Run either:
    * node bamazonCustomer.js
    * node bamazonManager.js

## Running node bamazonCustomer.js

- First an intro screen appears welcoming the customer to Bamazon.
- Then the table of products loads with the products and their relevant information.
- Below the table is a prompt for the customer to enter the **Item Id** of the product they would like to purchase.
     * Additionally, they can enter "q" to quit out of the customer experieince and return to the command line.
- Once they enter the **Item Id**, they are asked to enter the quantity they wish to buy.
     * If there is enough stock for the product, it will return the total for that purchase and thank the customer.
     * If there is not enough stock, it will tell the user that there isn't enough of the product and ask them if they would like to purchase another item.
     * If the purchase goes through, it updates the stock quantity to reflect the purchase.

## Running node bamazonManager.js

- Starts the **Managers Dashboard** with the following options displayed in a list:
     * View Products for Sale
          * Lists all of the products in a formatted table with header.
     * View Low Inventory
          * Lists all products with a quantity of 5 or lower.
     * Add to Inventory
          * prompts the manager through selecting the product to update and the quantity for the update.
     * Add New Product
          * Prompts the manager through adding a new product to Bamazon.
     * End Session
          * Exits dashboard and returns manager to command prompt.
     
### Technologies used
- [Node.js](https://nodejs.org/en/)
- [inquirer NPM Package](https://www.npmjs.com/package/inquirer)
- [mysql NPM Package](https://www.npmjs.com/package/mysql)
- [table NPM Package](https://www.npmjs.com/package/table)
- [colors NPM Package](https://www.npmjs.com/package/colors)




