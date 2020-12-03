const express = require('express');
const {insertTicket} = require('../controllers/tickets.js');
const router = express.Router();

/* post method listener to insert tickets */
router.post('/', insertTicket);

module.exports = router;