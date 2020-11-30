const express = require('express');

const {createUser, Authentication} = require('../controllers/users.js');

const router = express.Router();

// POST: Register a new user
router.post('/', createUser);

// POST: Logs a user in
router.post('/', Authentication);

module.exports = router;