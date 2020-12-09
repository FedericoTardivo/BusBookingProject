const BusStop = require('../models/BusStop.js')

const db = require('../lib/db.js');
const BadRequestResponse = require('../models/BadRequestResponse.js');
const FieldError = require('../models/FieldError.js');

// Gets an array containing all the bus stops
module.exports.getBusStops = async (req, res) => {
    // If filtering by company ID is requested...
    let stops;
    if (req.query.companyId) {
        // ...get all the bus stops of that company
        stops = await db.busStops.findBy({companyId: req.query.companyId});
    }else{
        // Get all the bus stops from the DB
        stops = await db.busStops.get();
    }
    
    // Return the response mapping the objects
    // so they have the right properties
    res.status(200).json(stops.map(bs => {
        return {
            self: `/api/v1/busStops/${bs._id}`,
            id: bs._id,
            name: bs.name
        };
    }));
};

// Gets the bus stop with the specified ID
module.exports.getBusStop = async (req, res) => {
    // Get the bus stop by ID
    const stops = await db.busStops.findBy({_id: req.params.id});
    
    // If the ID is not existing...
    if (stops.length == 0) {
        // ...return a 404 error
        return res.status(404).send(`La fermata con ID "${req.params.id}" non esiste.`);
    }

    // Map the object for the response
    res.status(200).json({
            self: `/api/v1/busStops/${stops[0]._id}`,
            id: stops[0]._id,
            name: stops[0].name
    });
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
    // Set the owner of the line as the company of the logged user
    busStop.companyId = (await db.admins.findBy({_id: req.loggedUserId}))[0].companyId;
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

    // If the name of the bus stop already exists for the same company...
    if((await db.busStops.findBy({name: busStop.name, companyId: busStop.companyId})).length > 0) {
        // ...send a 409Conflit error response
        return res.status(409).send("Fermata già registrata");
    }
    
    // All is OK, add the bus stop
    busStop._id = await db.busStops.insert(busStop);
    
    // Send the response with the correct "Location" header
    res.location(`/api/v1/busStops/${busStop._id}`).status(201).json({
        self = `/api/v1/busStops/${busStop._id}`,
        id: busStop._id,
        name: busStop.name
    });
}

// Updates an existsing bus stop in the DB
module.exports.updateBusStop = async (req, res) => {
    // Check if the user is authenticated
    if(!req.loggedUserId) {
        return res.status(401).send("Utente non autenticato.");
    }

    // Get the bus stop from the DB
    let busStop = (await db.busStops.findBy({_id: req.params.id}))[0];

    // If the ID of the bus is not existing...
    if(!busStop) {
        // ...return a 404 Not found error
        return res.status(404).send(`La fermata con ID '${req.params.id}' non esiste.`);
    }

    // Check if the user is in the company that owns the bus stop (a user cannot change a bus stop of another user)
    const userCompanyId = (await db.admins.findBy({_id: req.loggedUserId}))[0].companyId;
    if(busStop.companyId != userCompanyId) {
        return res.status(403).send("Accesso non autorizzato.");
    }

    // Assume that the request is correct. We will invalidate it later if necessary
    let valid = true;
    const badReq = new BadRequestResponse();

    // Validate the fields
   
    // If the name is not specified or is not a string...
    if(!req.body.name || typeof req.body.name != 'string') {
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

    // Set the new name
    busStop.name = req.body.name;

    // If the new name of the bus stop already exists in the same company...
    if((await db.busStops.findBy({name: busStop.name, companyId: busStop.companyId})).length > 0) {
        // ...send a 409Conflict error response
        return res.status(409).send("Nome della fermata già registrato");
    }
    
    // All is OK, update the bus stop
    busStop = await db.busStops.update(busStop);
    
    // Send the response with the updated object
    res.status(200).json({
        self: `/api/v1/busStops/${busStop._id}`,
        id: busStop._id,
        name: busStop.name
    });
}

// Deletes an existsing bus stop from the DB
module.exports.deleteBusStop = async (req, res) => {
    // Check if the user is authenticated
    if(!req.loggedUserId) {
        return res.status(401).send("Utente non autenticato.");
    }

    // Get the bus stop from the DB
    const busStop = (await db.busStops.findBy({_id: req.params.id}))[0];

    // If the ID of the bus is not existing...
    if(!busStop) {
        // ...return a 404 Not found error
        return res.status(404).send(`La fermata con ID '${req.params.id}' non esiste.`);
    }

    // Check if the user is in the company that owns the bus stop (a user cannot delete a bus stop of another user)
    const userCompanyId = (await db.admins.findBy({_id: req.loggedUserId}))[0].companyId;
    if(busStop.companyId != userCompanyId) {
        return res.status(403).send("Accesso non autorizzato.");
    }
    
    // All is OK, delete the bus stop
    if (await db.busStops.delete(busStop._id)) {
        // Deleted successfully
        return res.status(204).send();
    } else {
        // An error occurred
        return res.status(500).send();
    }
}