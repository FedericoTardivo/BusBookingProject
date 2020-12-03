const express = require('express');
const bodyParser = require('body-parser');

const usersRoutes = require('./routes/users.js');
const ticketsRoutes = require('./routes/tickets.js');
const linesRoutes = require('./routes/lines.js');
const authenticationRoutes = require('./routes/authentication.js');

const app = express();

app.use(bodyParser.json());
//app.use(urlencoded());

// Middleware for serving UI
app.use('/', express.static('UI'));

/**
 * Middleware to manage authentication
 * https://expressjs.com/it/guide/writing-middleware.html
 * https://expressjs.com/it/guide/using-middleware.html
 */
app.use((req, res, next) => {
    req.loggedUserId = req.query.userId;
    next();
});

app.use('/api/v1/users', usersRoutes);
/* set root route for ticketsRoutes */
app.use('/api/v1/tickets', ticketsRoutes);
app.use('/api/v1/lines', linesRoutes);
app.use('/api/v1/authentication', authenticationRoutes);

/* Default 404 handler */
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});

module.exports = app;