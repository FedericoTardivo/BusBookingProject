const User = require('../models/User.js');
const BadRequestResponse = require('../models/BadRequestResponse.js');
const FieldError = require('../models/FieldError.js');

const db = require("../lib/db");


module.exports.loginUser = (req, res) => {
	//Create the User before authentication
	let user = new User();
	user.email = req.body.email;
	user.password = req.body.password;

	let valid = true;
    let errResp = new BadRequestResponse();
	
	//Validate email
	if (!user.email || typeof user.email != 'string' || !checkIfEmailInString(user.email)) {
		valid = false;
		errResp.fieldsErrors.push (new FieldError('email', 'The field "email" must be a valid email address'));
	}

	//Validate password
	if (!user.password || typeof user.password != 'string'){
		valid = false;
		errResp.fieldsErrors.push( new FieldError('password', 'The field "password" must be provided'));
	}

	// If Something is not valid, send a BadRequest error
	if(!valid){
		errResp.message = 'La richiesta non è valida.'
		return res.status(400).json(errResp);
	}
	
	// at this point, email and password are valid
	
	// check if user is registered	
	let tempUser = db.accounts.get().find(u => u.username == user.email);
	if (tempUser == null) {
		errResp.message = 'Utente inserito non è esistente';
		errResp.fieldsErrors.push( new FieldError('email', 'Email does not exist'));
		return res.status(401).json(errResp);
	} else{
		//check if the entered password matches
		if (user.password != tempUser.password){
			errResp.message = 'Password errata'
			return res.status(401).json(errResp);
		} else {
			//request is valid, return ID user
			console.log(tempUser.id);
			return res.status(200).send("utente " + tempUser.id + " loggato");
			//tempUser.id;					//qui andrebbe il reindirizzamento
		}

	}


};

// https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
function checkIfEmailInString(text) {
    // eslint-disable-next-line
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(text);
}