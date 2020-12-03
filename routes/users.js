const express = require('express');

const {createUser, getTickets} = require('../controllers/users.js');

const router = express.Router();

// POST: Register a new user
router.post('/', createUser);

router.get('/:_id/tickets', getTickets); 

module.exports = router;