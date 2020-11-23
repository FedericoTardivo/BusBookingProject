const express = require('express');
const bodyParser = require('body-parser');

const usersRoutes = require('./routes/users.js');

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

app.use('/api/v1/users', usersRoutes);

/* Default 404 handler */
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});

module.exports = app;