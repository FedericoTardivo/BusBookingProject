const User = require('../models/User.js');
const BadRequestResponse = require('../models/BadRequestResponse.js');
const FieldError = require('../models/FieldError.js');

const db = require("../lib/db.js");

module.exports.createUser = async (req, res) => {
    // Create a new object
    let user = new User();
    user.name = req.body.name;
    user.surname = req.body.surname;
    user.email = req.body.email;
    user.password = req.body.password;

    let valid = true;
    let errResp = new BadRequestResponse();
    
    // Validate name
    if (!user.name || typeof user.name != 'string') {
        valid = false;
        errResp.fieldsErrors.push(new FieldError('name', 'The field "name" must be a non-empty string'));
    }

    // Validate surname
    if (!user.surname || typeof user.surname != 'string') {
        valid = false;
        errResp.fieldsErrors.push(new FieldError('surname', 'The field "surname" must be a non-empty string'));
    }

    // Validate email
    if (!user.email || typeof user.email != 'string' || !checkIfEmailInString(user.email)) {
        valid = false;
        errResp.fieldsErrors.push(new FieldError('email', 'The field "email" must be a valid email address'));
    }

    // Validate password
    if (!user.password || typeof user.password != 'string' || user.password.length < 6) {
        valid = false;
        errResp.fieldsErrors.push(new FieldError('password', 'The field "password" must be at least 6 chars long'));
    } else {
        if (user.password != req.body.confirmPassword) {
        valid = false;
        errResp.fieldsErrors.push(new FieldError('password', 'Password and confirm pasword do not match'));
        }
    }
   
    // If something is not valid, send a BadRequest error
    if(!valid) {
        errResp.message = 'La richiesta non è valida.'
        return res.status(400).json(errResp);
    }

    // Check if the email is already registered
    if((await db.users.findBy({email : user.email})).length > 0)
    {
        return res.status(409).json({
            fieldName: "email",
            fieldMessage: `L'email \"${user.email}\" è già registrata`
          });
    }
    
    // The request is valid

    // Create an ID for the new user
    const id = await db.users.register(user);
    
    let resObj = {
        self: `/api/v1/users/${id}`,
        name: user.name,
        surname: user.surname,
        email: user.email
    };

    // Send back the newly created user
    res.location("/api/v1/users/" + id).status(201).json(resObj);
}

module.exports.getTickets = async (req, res) => {
    // Check if the user is authenticated
    if(!req.loggedUserId) {
        return res.status(401).send("Utente non autenticato.");
    }

    // Check if the user is authorized (a user cannot see the tickets of another user)
    if(req.params.id != req.loggedUserId) {
        return res.status(403).send("Accesso non autorizzato.");
    }

    // Assume that the request is correct. We will invalidate it later if necessary
    let valid = true;
    const badReq = new BadRequestResponse();

    // Get the params from the query
    let limit = req.query.limit;
    let offset = req.query.offset;
    let issue_start = req.query.issue_start;
    let issue_end = req.query.issue_end;
    let lineId = req.query.lineId;
    let start_stop = req.query.start_stop;
    let end_stop = req.query.end_stop;
    
    // If limit is defined...
    if(limit) {
        // ...parse it to an integer
        limit = parseInt(limit);
        // If parsing failed or the value is not valid...
        if(isNaN(limit) || limit < 1) {
            // ...invalidate the request
            valid = false;
            badReq.fieldsErrors.push(new FieldError("limit", "Il parametro deve essere un numero intero maggiore o uguale a 1"));
        }
    }

    // If offset is defined...
    if(offset) {
        // ...parse it to an integer
        offset = parseInt(offset);
        // If parsing failed or the value is not valid...
        if(isNaN(offset) || offset < 0) {
            // ...invalidate the request
            valid = false;
            badReq.fieldsErrors.push(new FieldError("offset", "Il parametro deve essere un numero intero maggiore o uguale a 0"));
        }
    }

    // If limit is defined, offset must be defined too
    // If neither is defined, or both are defined, it's OK
    if((typeof limit === 'undefined') != (typeof offset === 'undefined')) {
        // Just one of them is defined, invalidate the request
        valid = false;
        badReq.fieldsErrors.push(new FieldError("limit, offset", "limit e offset devono essere definiti insieme o rimossi entrambi"));
    }
    
    // If issue_start is defined...
    if(issue_start) {
        // ...parse it to a date
        issue_start = Date.parse(issue_start);
        // If parsing failed or the value is not valid...
        if(isNaN(issue_start) || issue_start > Date.now()) {
            // ...invalidate the request
            valid = false;
            badReq.fieldsErrors.push(new FieldError("issue_start", "Il parametro deve essere una data precedente o uguale a oggi"));
        }
    }

    // If issue_end is defined...
    if(issue_end) {
        // ...parse it to a date
        issue_end = Date.parse(issue_end);
        // If parsing failed or the value is not valid...
        if(isNaN(issue_end) || issue_end > Date.now()) {
            // ...invalidate the request
            valid = false;
            badReq.fieldsErrors.push(new FieldError("issue_end", "Il parametro deve essere una data precedente o uguale a oggi"));
        }
    }

    // If something is not valid, send a BadRequest error
	if(!valid){
		badReq.message = 'La richiesta non è valida';
		return res.status(400).json(badReq);
	}
    
    // Get all the tickets of the logged user
    let tickets = await db.tickets.findBy({_id : req.loggedUserId});

    // If the collection is empty, return an empty array
    if(tickets == []) {
        return res.status(200).json([]);
    }

    // If issue_start and issue_end are defined
    // and the start if after the end
    // swap the dates
    if (issue_start && issue_end && issue_start > issue_end) {
        const temp = issue_start;
        issue_start = issue_end;
        issue_end = temp;
    }

    // Filter by date if required
    if(issue_start) tickets = tickets.filter(t => t.issueDate >= issue_start);
    if(issue_end) tickets = tickets.filter(t => t.issueDate <= issue_end);

    // Filter by lineId if required
    if(lineId) tickets = tickets.filter(t => t.lineId == lineId);

    // Filter by stops if required
    if(start_stop) tickets = tickets.filter(t => t.start_stop == start_stop);
    if(end_stop) tickets = tickets.filter(t => t.end_stop == end_stop);

    // If pagination is required...
    if(offset) {
        // ...paginate the response skipping 'offset' elements and return just 'limit' elements
        tickets = tickets.skip(offset).limit(limit);
    }

    // Return the filtered and paginated results
    return res.status(200).json(tickets);
};

// https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
function checkIfEmailInString(text) {
    // eslint-disable-next-line
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(text);
}