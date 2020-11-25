const express = require('express');
const bodyParser = require('body-parser');

const ticketsRoutes = require('./routes/tickets.js');

const app = express();

app.use(bodyParser.json());
//app.use(urlencoded());

/**
 * Middleware to manage authentication
 * https://expressjs.com/it/guide/writing-middleware.html
 * https://expressjs.com/it/guide/using-middleware.html
 */
app.use((req, res, next) => {
    req.loggedUser = req.query.user;
    next();
});

/* set root route for ticketsRoutes */
app.use('/api/v1/tickets', ticketsRoutes);

/* Default 404 handler */
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});

module.exports = app;