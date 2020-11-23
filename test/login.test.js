const app = require('../lib/app.js');
const supertest = require('supertest');
const db = require('../lib/db.js');

const request = supertest(app);

describe ('Test API Login Users', () => {

	afterAll((done) => {
		done();
	})

	it("Post request without body should return 400 with an error in the body", async () => {
		const response = await request.post("/api/v1/users/login");

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
            email: "mario.rossi@domain.com",
            password: "MySuperSecretPassword"
        };
		const response = await request.post("/api/v1/users/login").send(loginData);

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
		db.accounts.register("mario.rossi@domain.com", "password");
		const loginData = {
            email: "mario.rossi@domain.com",
            password: "wrongPassword"
        };
		const response = await request.post("/api/v1/users/login").send(loginData);

		expect(response.status).toBe(401);
		expect(response.body).toMatchObject({
			"message": "Password errata"
		});
	});

	it("Post request witch correct data should return 200", async () => {
		db.accounts.register("mario.rossi@domain.com", "password");
		const loginData = {
			email:"mario.rossi@domain.com",
			password:"password"
		};
		const response = await request.post ("/api/v1/users/login").send(loginData);

		expect(response.status).toBe(200);
	});
});
