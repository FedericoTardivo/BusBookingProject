const UserLogin = require('../models/UserLogin.js');
const BadRequestResponse = require('../models/BadRequestResponse.js');
const FieldError = require('../models/FieldError.js');

const db = require("../lib/db");

module.exports.authenticationUser = async (req, res) => {
	//Create the User before authentication
	let user = new UserLogin();
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
    
    // check if user is registered as admin
    let tempAdmin = await db.admins.findBy({email : user.email});
    if (tempAdmin.length > 0) {    //significa che l'utente che sta per accedere è un admin
        //check if the entered password matches
		if (user.password != tempAdmin[0].password){
			return res.status(401).json({message: 'Password errata per admin'});
        } else {
            //request is valid and the admin can log, return ID admin
            return res.status(200).json({
				id: tempAdmin[0]._id,
				type: "admin"
			});
        }
    }

	// check if user is registered (normal user)
	let tempUser = await db.users.findBy({email : user.email});
	if (tempUser.length == 0) {
		errResp.message = 'Utente inserito non è esistente';
		errResp.fieldsErrors.push( new FieldError('email', 'Email does not exist'));
		return res.status(401).json(errResp);
	} else {
		//check if the entered password matches
		if (user.password != tempUser[0].password){
			return res.status(401).json({message: 'Password errata per user'});
		} else {
			//request is valid, return ID user
			return res.status(200).json({
				id: tempUser[0]._id,
				type: "user"
			});
		}
	}
};

// https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
function checkIfEmailInString(text) {
    // eslint-disable-next-line
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(text);
}