const app = require('../app');
const supertest = require('supertest');

const User = require('../models/User.js');

const db = require('../lib/db.js');

const request = supertest(app);

describe('Test API - User registration', () => {
    it("POST request without body should return 400 with an error in the body", async () => {
        const response = await request.post("/api/v1/users");

        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
            "message": "La richiesta non è valida.",
            "fieldsErrors": [
                {
                    "fieldName": "name",
                    "fieldMessage": "The field \"name\" must be a non-empty string"
                },
                {
                    "fieldName": "surname",
                    "fieldMessage": "The field \"surname\" must be a non-empty string"
                },
                {
                    "fieldName": "email",
                    "fieldMessage": "The field \"email\" must be a valid email address"
                },
                {
                    "fieldName": "password",
                    "fieldMessage": "The field \"password\" must be at least 6 chars long"
                }
            ]
        });
    });

    it("POST request with correct data should return 201 with the account just created in the body", async () => {
        const user = {
            name: "Mario",
            surname: "Rossi",
            email: "mario.rossi@domain.com",
            password: "MySuperSecretPassword",
            confirmPassword: "MySuperSecretPassword"
        };
        const response = await request.post("/api/v1/users").send(user);

        expect(response.status).toBe(201);
        expect(response.headers).toHaveProperty('location');
        expect(response.body).toHaveProperty('self');
        expect(response.body).toHaveProperty('name');
        expect(response.body).toHaveProperty('surname');
        expect(response.body).toHaveProperty('email');
    });
});

describe ('Test API - BookingReview', () => {

	const mockUser = new User();
    mockUser.name = "Mario";
    mockUser.surname = 'Rossi';
    mockUser.email = 'mario.rossi@domain.com';
    mockUser.password = 'MySuperSecretPassword';

	let IDUSER;

    beforeEach(async() => {
        await db.users.clear();
		IDUSER = await db.users.register(mockUser);
	});

    it("Get request with wrong parameters should return 400 (limit test)", async () => {

		const response = await request.get(`/api/v1/users/${IDUSER}/tickets`).query({userId : IDUSER, limit : 0});

		expect(response.status).toBe(400);
		expect(response.body).toMatchObject({
            "message": "La richiesta non è valida",
            "fieldsErrors": [
                {
                    "fieldName": "limit",
                    "fieldMessage": "Il parametro deve essere un numero intero maggiore o uguale a 1"
                },
                {
                    "fieldName": "limit, offset",
                    "fieldMessage": "limit e offset devono essere definiti insieme o rimossi entrambi"
                }
            ]
        });
	});

	it("Get request with wrong parameters should return 400 (offeset test)", async () => {

		const response = await request.get(`/api/v1/users/${IDUSER}/tickets`).query({userId : IDUSER, offset : "abc"});

		expect(response.status).toBe(400);
		expect(response.body).toMatchObject({
            "message": "La richiesta non è valida",
            "fieldsErrors": [
                {
                    "fieldName": "offset",
                    "fieldMessage": "Il parametro deve essere un numero intero maggiore o uguale a 0"
                },
                {
                    "fieldName": "limit, offset",
                    "fieldMessage": "limit e offset devono essere definiti insieme o rimossi entrambi"
                }
            ]
        });
	});

	it("Get request of a unlogged user should return 401", async () =>{

		const response = await request.get("/api/v1/users/IDqualsiasi/tickets");

		expect(response.status).toBe(401);
		expect(response.text).toBe("Utente non autenticato.");
	});

    it("Get request of a logged user to a private resource should return 403", async () => {

		const response = await request.get("/api/v1/users/Qualsiasi/tickets").query({userId : IDUSER});

		expect(response.status).toBe(403);
		expect(response.text).toBe("Accesso non autorizzato.");
    });
	
    it("Get request witch correct parameter should return 200", async () => {

		const response = await request.get (`/api/v1/users/${IDUSER}/tickets`).query({userId : IDUSER});

		expect(response.status).toBe(200);
		expect(response.body).toMatchObject([]);
        
    });
    
});
