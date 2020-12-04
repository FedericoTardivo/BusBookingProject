const BusStop = require('../models/BusStop.js')

const db = require('../lib/db.js');
const BadRequestResponse = require('../models/BadRequestResponse.js');
const FieldError = require('../models/FieldError.js');

// Gets an array containing all the bus stops of the logged admin
module.exports.getBusStops = async (req, res) => {
    // Check if the user is authenticated
    if(!req.loggedUserId) {
        return res.status(401).send("Utente non autenticato.");
    }

    // Get all the bus stops from the DB
    const stops = await db.busStops.findBy({adminId: req.loggedUserId});

    // Return the response mapping the objects
    // so they have the right properties
    res.status(200).json(stops.map(bs => {
        return {
            self: `/api/v1/busStops/${bs._id}`,
            _id: bs._id,
            name: bs.name
        };
    }));
};

// Registers a new bus stop in the DB
module.exports.insertBusStop = async (req, res) => {
    // Check if the user is authenticated
    if(!req.loggedUserId) {
        return res.status(401).send("Utente non autenticato.");
    }

    // Assume that the request is correct. We will invalidate it later if necessary
    let valid = true;
    const badReq = new BadRequestResponse();

    // Create a new object
    const busStop = new BusStop();
    // Set the owner of the line as the logged user
    busStop.adminId = req.loggedUserId;
    // Set the name of the stop
    busStop.name = req.body.name;

    // Validate the fields

    // If the name is not specified or is not a string...
    if(!busStop.name || typeof busStop.name != 'string') {
        // ...invalidate the request
        valid = false;
        badReq.fieldsErrors.push(new FieldError("name", "Il parametro deve essere una stringa non nulla"));
    }

    // If something is not valid, send a BadRequest error
	if(!valid){
		badReq.message = 'La richiesta non è valida';
		return res.status(400).json(badReq);
    }
    
    // All the params are valid

    // If the name of the bus stop already exists...
    if((await db.busStops.findBy({name: busStop.name})).length > 0) {
        // ...send a 409Conflit error response
        return res.status(409).send("Fermata già registrata");
    }
    
    // All is OK, add the bus stop
    busStop._id = await db.busStops.insert(busStop);
    
    // Add the self param
    busStop.self = `/api/v1/busStops/${busStop._id}`;

    // Send the response with the correct "Location" header
    res.location(`/api/v1/busStops/${busStop._id}`).status(201).json(busStop);
}