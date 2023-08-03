# MeetDown
https://meetup-clone-26qy.onrender.com/

* Meetdown is a clone website of Meetup.

## Introduction

In this project, our team cloned and implemented some of the more basic and core features of UberEats and DoorDash. Epic Eats is a food ordering web-app that allows users to browse restaurants and order food from them, leave reviews, and upload/manage restaurants. Its current functionality includes the following features:

* Signing up a new user and logging in as an existing user
* Creating, Reading, Updating and Deleting a single Restaurant
* Creating, Reading, Updating and Deleting menu items associated with a restaurant.
* Adding, Updating and Removing menu items from the logged in user's cart(current order)
* Finalizing an order at checkout and retrieving finalized orders on the "Past Orders" page
* Creating and Deleting restaurant reviews of the logged in user

-----------------------------------------------------------------------------------------------------------------------------

## Authorization/Access

Similar to UberEats and DoorDash, it's extremely important to limit access of logged in and non-logged in users. This adds security to our web-app by ensuring only certain people can make certain interactions with our website. We currently have the following user limitations on our website:

### Non-logged-in users

For our site, we decided that only logged in users can create and finalize orders. If a user does not want to create an account, they can log in as a demo user can order that way. They are still able to browse restaurants but logging in is preffered

A non-logged in user CAN:

* Sign up
* Log in
* Browse restaurants and their menu items

A non-logged in user CANNOT:

* Create or finalize orders
* Create, Update, Delete restaurant details
* Create, Update, Delete menu items
* Create, Delete reviews

### Logged in users

When a user is logged in, there will always be a cart/current order available for the user to make changes to. This is automatically created when the user signs up or finalizes an order at checkout.

   A logged in user CAN:
      * Browse all restaurants and their menu items
      * Create, Update, Delete restaurant details of restaurants they own
      * Create, Update, Delete, menu-items of restaurants they own
      * Add, Update quantity, remove menu items from their current order
      * Finalize current order at checkout
      * Retrieve past order details on the "Past Orders" page

   A logged in user CANNOT:
      * Make changes to restaurant details and menus they do NOT own
      * Make changes to the cart/current order of other users

--------------------------------------------------------------------------------------------------------------------------------------

## Technologies used:
This site uses a Flask-React stack

   ### Backend:
   * Python
   * SQLAlchemy 
   ### Frontend:
   * Javascript
   * React
   * Redux

---------------------------------------------------------------------------------------------------------------------------

## Launching locally instructions:
Running the backend server:
* From the root directory, run "pipenv install -r requirements.txt" to install dependencies
* Run "pipenv shell" to run the virtual environment
* Run "flask db upgrade" to create a local database
* Run "flask seed all" to populate the database with seed data
* Run "flask run" to boot up the backend server

Running the frontend server:
* From the root directory, cd into the react-app directory/folder
* Run "npm install" to install dependencies
* Run "npm start" to boot up the frontend server and open a browser tab to the landing page
