const UserLogin = require('../models/UserLogin.js');
const BadRequestResponse = require('../models/BadRequestResponse.js');
const FieldError = require('../models/FieldError.js');

const db = require("../lib/db");

module.exports.authenticationUser = (req, res) => {
	//Create the User before authentication
	let user = new UserLogin();
	user.email = req.body.email;
	user.password = req.body.password;

    let valid = true;
    let isAdmin = false;
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
    
    // check if user is registered as admin
    let tempAdmin = db.admins.get().find(u => u.email == user.email);
    if (tempAdmin != null) {    //significa che l'utente che sta per accedere è un admin
        //check if the entered password matches
        if (user.password != tempAdmin.password){
			errResp.message = 'Password errata per admin'
            return res.status(401).json(errResp);
        } else {
            //request is valid and the admin can log, return ID admin
            return res.status(200).send("admin " + tempAdmin.id + "loggato");
        }
    }

	// check if user is registered (normal user)
	let tempUser = db.users.get().find(u => u.email == user.email);
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
			return res.status(200).send("utente " + tempUser.id + " loggato");
		}

	}
};

// https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
function checkIfEmailInString(text) {
    // eslint-disable-next-line
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(text);
}