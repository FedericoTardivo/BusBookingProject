const express = require('express');

//IMPORTANT: all routes in this file already start with /Lines

const {insertLine, getLines} = require('../controllers/lines.js');



const router = express.Router();

// this post allows insertion of new Lines in the db
router.post('/', insertLine);
router.get('/', getLines)

module.exports = router;