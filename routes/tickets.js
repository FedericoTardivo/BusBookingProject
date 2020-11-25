const express = require('express');
const {getTickets, getTicket, insertTicket} = require('../controllers/tickets.js');
const router = express.Router();

/* get method listener for tickets*/
router.get('/', getTickets);

/* get method listener for ticket with id param*/
router.get('/:id', getTicket);

/* post method listener to insert tickets */
router.post('/', insertTicket);

module.exports = router;