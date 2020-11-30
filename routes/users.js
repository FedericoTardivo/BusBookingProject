const express = require('express');

const {createUser, loginUser, getTickets} = require('../controllers/users.js');

const router = express.Router();

// POST: Register a new user
router.post('/', createUser);

// POST: Logs a user in
router.post('/login', loginUser);

// GET: Gets all the tickets the user bought
router.get('/:id/tickets', getTickets);

module.exports = router;