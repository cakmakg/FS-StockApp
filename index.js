"use strict"
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const express = require('express');
const path = require('node:path')
const app = express()

/* ------------------------------------------------------- */
// Required Modules:

// envVariables to process.env:
require('dotenv').config()
const HOST = process.env?.HOST || '127.0.0.1'
const PORT = process.env?.PORT || 8000

// asyncErrors to errorHandler:
require('express-async-errors')

/* ------------------------------------------------------- */
// Configrations:

// Connect to DB:
const { dbConnection } = require('./src/configs/dbConnection')
dbConnection()

/* ------------------------------------------------------- */
// Middlewares:

// Accept JSON:
app.use(express.json());

// Cors:
app.use(require('cors')());

// FE static files:
app.use(express.static(path.join(__dirname, '/client/dist')));

// Call static uploadFile:
app.use('/upload', express.static('./upload'));

// Check Authentication:
app.use(require('./src/middlewares/authentication'));

// Run Logger:
app.use(require('./src/middlewares/logger'));

// res.getModelList():
app.use(require('./src/middlewares/queryHandler'));

/* ------------------------------------------------------- */
// Routes:

// HomePath:
app.all('/', (req, res) => { 
    res.sendFile(path.join(__dirname, '/client/dist/index.html'));
});

// Routes:
app.use('/api/v1', require('./src/routes'));

// Node Found
app.use('*', (req, res) => {
    res.status(404).json({
        error: true,
        message: 'Route is not found',
        method: req.method,
        url: req.url,
    })
});

/* ------------------------------------------------------- */

// errorHandler:
app.use(require('./src/middlewares/errorHandler'))

// RUN SERVER:
app.listen(PORT, HOST, () => console.log(`http://${HOST}:${PORT}`))

/* ------------------------------------------------------- */
// Syncronization (must be in commentLine):
// require('./src/helpers/sync')() // !!! It clear database.