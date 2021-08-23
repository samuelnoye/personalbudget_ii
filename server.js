const express = require('express');
const app = express();

require('dotenv').config();

app.use(express.static('public'));

// Middleware CORS
const cors = require('cors');
app.use(cors());

// Add middware for parsing request bodies here:
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// Mount the existing apiRouter 
const apiRouter = require('./server/api');
app.use('/api', apiRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});

module.exports = app;