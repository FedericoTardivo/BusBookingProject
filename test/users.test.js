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

describe ('Test API - User login', () => {
    const mockUser = new User();
    mockUser.name = "Mario";
    mockUser.surname = 'Rossi';
    mockUser.email = 'mario.rossi@domain.com';
    mockUser.password = 'MySuperSecretPassword';

    beforeEach(() => {
        db.users.clear();
        db.users.register(mockUser);
    });

	it("Post request without body should return 400 with an error in the body", async () => {
		const response = await request.post("/api/v1/authentication");

		expect(response.status).toBe(400);
		expect(response.body).toMatchObject({
			"message": "La richiesta non è valida.",
			"fieldsErrors": [
				{
					"fieldName": "email",
					"fieldMessage": "The field \"email\" must be a valid email address"
				},
				{
					"fieldName": "password",
					"fieldMessage": "The field \"password\" must be provided"
				}
			]
		});
	});

	it("Post request with no registered account", async () =>{
		const loginData = {
            email: "notregistered.user@test.com",
            password: "SomePasswprd"
        };
		const response = await request.post("/api/v1/authentication").send(loginData);

		expect(response.status).toBe(401);
		expect(response.body).toMatchObject({
			"message": "Utente inserito non è esistente",
			"fieldsErrors": [
				{
					"fieldName": "email",
					"fieldMessage": "Email does not exist"
				}
			]
		});
	});

	it("Post request with wrong password", async () => {
		const loginData = {
            email: "mario.rossi@domain.com",
            password: "wrongPassword"
        };
		const response = await request.post("/api/v1/authentication").send(loginData);

		expect(response.status).toBe(401);
		expect(response.body).toMatchObject({
			"message": "Password errata"
		});
	});

	it("Post request witch correct data should return 200", async () => {
		const loginData = {
			email: "mario.rossi@domain.com",
			password: "MySuperSecretPassword"
		};
		const response = await request.post ("/api/v1/authentication").send(loginData);

		expect(response.status).toBe(200);
	});
});