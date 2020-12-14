const express = require('express');
const {insertTicket, deleteTicket} = require('../controllers/tickets.js');
const router = express.Router();

/* post method listener to insert tickets */
router.post('/', insertTicket);
router.delete('/:id', deleteTicket);

module.exports = router;