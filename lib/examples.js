const express = require('express');
const router = express.Router();
const db = require('./db.js');



router.get('', (req, res) => {
    res.json(db.examples.all());
});

router.post('', (req, res) => {
    let example = {
        title: req.body.title,
        description: req.body.description
    };
    
    // Validation
    if (!example.title || typeof example.title != 'string') {
        res.status(400).json({ error: 'The field "titòe" must be a non-empty string' });
        return;
    }

    if (!example.description || typeof example.description != 'string') {
        res.status(400).json({ error: 'The field "description" must be a non-empty string' });
        return;
    }

    let exampleId = db.examples.insert(example);

    /**
     * Link to the newly created resource is returned in the Location header
     * https://www.restapitutorial.com/lessons/httpmethods.html
     */
    res.location("/api/v1/examples/" + exampleId).status(201).send();
});



module.exports = router;