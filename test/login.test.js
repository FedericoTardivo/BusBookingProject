const app = require('../index.js');
const supertest = require('supertest');

const require = supertest(app);

describe ('Test API Login Users, () => {

	afertAll((done) => {
		done();
	})

	it("Post request without body should return 400 with an error in the body", async () => {
		const response = await request.post("/users");

		expect(response.status).toBe(400);
		expect(response.body).toMatchObject({
			"message": "la richiesta non è valida.",
			"fieldsErrors": [
				{
					"fieldName": "email"
					"fieldMessage": "The field \"email\" must be a valid email adress"
				},
				{
					"fieldName": "password"
					"fieldMessage": "the field \"password\" must be at least 6 chars long"
				}
			]
		});
	});

	it("Post request with no registered account", async () =>{
		const response = await request.post("/users");

		expect(response.status).toBe(404);
		expect(response.body).toMatchObject({
			"message":"Utente inserito non è esistente"
		});
	});

	it("Post request with wrong password", async () => {
		const response = await request.post("/users");

		expect(response.status).toBe(401);
		expetc(response.body).toMatchObject({
			"message":"Password errata"
		});
	});

	it("Post request witch correct data should return 201", async () => {
		const user = {
			email:"mario.rossi@domain.com",
			password:"MySuperSecretPassword"
		};
		const response = await request.post ("/users").send(user);

		expect(response.status).toBe(201);
	});
});
