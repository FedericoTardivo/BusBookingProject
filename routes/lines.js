const express = require('express');

const {insertLine,changeLine,getLines} = require('../controllers/lines.js');

const router = express.Router();

// GET: get all the lines
router.get('/', getLines)

// POST: create a new line in the DB
router.post('/', insertLine);

// PUT: apply changes to a line
router.put('/:id', changeLine);

module.exports = router;