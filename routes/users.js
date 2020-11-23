const express = require('express');


const {loginUser} = require('../controllers/users.js');

const router = express.Router();

router.post('/login', loginUser);

module.exports = router;

