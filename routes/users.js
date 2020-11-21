const express = require('express');

//import {createUser} from '../controllers/users.js';
const {createUser} = require('../controllers/users.js');

const router = express.Router();

// POST: Register a new user
router.post('/', createUser);

module.exports = router;