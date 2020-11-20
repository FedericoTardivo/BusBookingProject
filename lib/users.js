import express from 'express';
import User from './models/User.js'
import BadRequestResponse from './models/BadRequestResponse.js'
import FieldError from './models/FieldError.js'

const router = express.Router();

// Register a new user
router.post('/', (req, res) => {
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
    
    // The request is valid
    
    // Create an ID for the new user
    // TODO: Create a valid ID!
    user.id = 'createOneID';
        
    // TODO: Add the user to the DB

    let resObj = {
        self: `/api/v1/users/${user.id}`,
        name: user.name,
        surname: user.surname,
        email: user.email
    };
    // Send back the newly created user
    res.location("/api/v1/users/" + user.id).status(201).json(resObj);
});

// https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
function checkIfEmailInString(text) {
    // eslint-disable-next-line
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(text);
}

export default router;