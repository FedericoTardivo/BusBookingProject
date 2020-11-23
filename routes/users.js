const express = require('express');

const {createUser, loginUser} = require('../controllers/users.js');

const router = express.Router();

// POST: Register a new user
router.post('/', createUser);

// POST: Logs a user in
router.post('/login', loginUser);

module.exports = router;