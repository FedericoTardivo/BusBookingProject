const express = require('express');

const {getBusStops, getBusStop, insertBusStop} = require('../controllers/busStops.js');

const router = express.Router();

router.get('/', getBusStops);
router.get('/:id', getBusStop);
router.post('/', insertBusStop);

module.exports = router;