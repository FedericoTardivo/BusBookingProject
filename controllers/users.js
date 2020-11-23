const User = require('../models/User.js');
const BadRequestResponse = require('../models/BadRequestResponse.js');
const FieldError = require('../models/FieldError.js');

const db = require("../lib/db");


module.exports.loginUser = (req, res) => {
	
	//Create the User before autentication
	let user = new User();
	user.email = req.body.email;
	user.password = req.body.password;

	let valid = true;
    	let errResp = new BadRequestResponse();
	
	//Validate email
	if (!user.email || typeof user.email != 'string' || !checkIfEmailInString(user.email)) {
		valid = false;
		errResp.fieldsErrors.push (new FieldError('email', 'The field "email" must be a valid email adress'));
	}

	//Validate password
	if (!user.password || typeof user.password != 'string' || user.password.length < 6){
		valid = false;
		errResp.fieldErrors.push( new FieldError('password', 'the field "password" must be at least 6 chars long'));
	}

	//If Something is not valid, send a BadRequest error
	if(!valid){
		errResp.message = 'La rischesta non è valida.'
		return res.status(400).json(errResp);
	}
	
	// at this point, email and password are valid
	
	// check if password is registered	
	let tempUser = db.users.find(u => u.email == user.email);
	if (tempUser == null) {
		errResp.message = 'Utente inserito non è esistente'
		return res.status(404).json(errResp);
	} else{
		//check if the entered password matches
		if (user.password != tempUser.password){
			errResp.message = 'Password errata'
			return res.status(401).json(errResp);
		} else {
			//request is valid, return ID user
			console.log(tempUser.id);
			res.status(201).send("utente " + tempUser.id + " loggato");
			return tempUser.id;					//qui andrebbe il reindirizzamento
		}

	}


};









