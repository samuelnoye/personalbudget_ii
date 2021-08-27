const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const docsRouter = require('express').Router();

module.exports = docsRouter;

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Personal-budget',
        version: '1.0.0',
        description: 'Small API to manage budget, build with Express, Node.js & Postgresql',
        license: {
            name: 'License MIT',
            url: 'https://spdx.org/licenses/MIT.html'
        },
    },
    servers: [
        {
            url: 'http://localhost:3000',
        }
    ]
};

const options = {
    swaggerDefinition,
    apis: ['./server/enveloppes.js', './server/transactions.js'],
};

const swaggerSpec = swaggerJSDoc(options);

docsRouter.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
