const express = require('express');
const {getTickets, getTicket, insertTicket} = require('../controllers/tickets.js');
const router = express.Router();


router.get('/', getTickets);

router.get('/:id', getTicket);

router.post('/', insertTicket);

module.exports = router;