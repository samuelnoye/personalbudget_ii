# The Personal Budget
A web application to manage your budget.

## Table of contents
* [Description](#description)
* [Project objectives](#objectives)
* [Technology](#technology)
* [Launch](#launch)
* [How to use](*how-to-use)
* [Source](#source)

## Description
**Context:** In this project, I have built a web application to store and manage your budget. 
The main goal was to developp a functionning back-end server, I've added some front-end for the user to be able to manipulate the data.

## Project Objectives

 - Build an API using Node.js and Express
 - Be able to create, read, update, and delete envelopes
 - Create endpoint(s) to update envelope balances
 - Use Git version control to keep track of your work
 - Use Postman to test API endpoints
 - Writing tests with Supertest 

## Technology
Project is created with:
 - ES6 Javascript
 - Node.js
 - Express.js
 - HTML
 - CSS
 - Postgresql
 - Heroku
 
## Launch
Download the files and extract them in a folder.
To run the server, be sure to have node installed.
Run 'npm install', then 'npm start' 

Once the app is running locally, you can access the API at `http://localhost:3000/`

## Testing with Swagger
Swagger documentation and testing available at `http://localhost:3000/api/docs`

### Envelopes:
----
 - Retrieve enveloppes using `GET /api/enveloppes`
 - Retrieve a single enveloppe using `GET /api/enveloppes/{id}`
 - Create an enveloppe using `POST /api/enveloppes`
 - Update an enveloppe using `PUT /api/enveloppes/{id}`
 - Delete an enveloppe using `DELETE /api/enveloppes/{id}`
 - Transfer an amount from a specific enveloppe to another one using `POST /api//enveloppes/transfer/{from}/{to}`

### Transactions:
___
 - Retrieve transactions using `GET /api/transactions`
 - Retrieve a single transaction using `GET /api/transactions/{id}`
 - Update a transaction using `PUT /api/transactions/{id}`
 - Delete an transaction using `DELETE /api/transactions/{id}`

## How to use
You can get all the enveloppes from the home page.
You are also able to create a new enveloppe with a specific amount.
I am working on pages where it will be possible to update enveloppe, transfer some amount between existing enveloppes and delete enveloppe.

## Source
This project was part of the challenge from the Back-End path by Codecademy. 
