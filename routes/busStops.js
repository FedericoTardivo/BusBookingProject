const express = require('express');

const {insertBusStop} = require('../controllers/busStops.js');

const router = express.Router();

router.post('/', insertBusStop);

module.exports = router;