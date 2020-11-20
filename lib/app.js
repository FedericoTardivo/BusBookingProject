import express from 'express';
import bodyParser from 'body-parser';

import users from './users.js';

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

app.use('/users', users);

/* Default 404 handler */
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});

export default app;