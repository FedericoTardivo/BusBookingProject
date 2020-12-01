const express = require('express');

const { authenticationUser } = require('../controllers/authentications.js');

const router = express.Router();

// POST: Logs a user in
router.post('/', authenticationUser);

module.exports = router;