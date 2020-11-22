const express = require('express');
const {getTickets} = require('../controllers/tickets.js');
const router = express.Router();


router.get('/', getTickets);


module.exports = router;