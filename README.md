# Bamazon 
### a Command Line Storefront Powered by Node.js and MySQL

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
     * If there is a sufficient stock for the product, it will return the total for that purchase and thank the customer.
     * If there is not enough stock, it will tell the user that there isn't enough of the product and ask them if they would like to purchase another item.
     * If the purchase goes through, it updates the stock quantity to reflect the purchase.

