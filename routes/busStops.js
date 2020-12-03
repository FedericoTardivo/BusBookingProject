const express = require('express');

const {getBusStops, insertBusStop} = require('../controllers/busStops.js');

const router = express.Router();

router.get('/', getBusStops);
router.post('/', insertBusStop);

module.exports = router;