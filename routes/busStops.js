const express = require('express');

const {getBusStops, insertBusStop, updateBusStop, deleteBusStop} = require('../controllers/busStops.js');

const router = express.Router();

// GET: get all the bus stops
router.get('/', getBusStops);

// POST: Create a new bus stop
router.post('/', insertBusStop);

// PUT: Update a bus stop
router.put('/:id', updateBusStop);

// DELETE: Delete a bus stop
router.delete('/:id', deleteBusStop);

module.exports = router;