const app = require('../app');
const supertest = require('supertest');

const User = require('../models/User.js');
const Admin = require('../models/Admin.js');

const db = require('../lib/db.js');

const request = supertest(app);

describe ('Test API - Authentication', () => {

    const MockAdmin = new Admin();
    MockAdmin.society = "Facciabook";
    MockAdmin.email = "faccia.book@domain.com";
    MockAdmin.password = "MySecretSuperPassword";

    
    const mockUser = new User();
    mockUser.name = "Mario";
    mockUser.surname = 'Rossi';
    mockUser.email = 'mario.rossi@domain.com';
    mockUser.password = 'MySuperSecretPassword';

    beforeEach(async () => {
        await db.users.clear();
        await db.users.register(mockUser);
        await db.admins.clear();
        await db.admins.insert(MockAdmin);
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

	it("Post request with no registered User or Admin accounts", async () =>{
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
    
    it ("Post request with wrong password (admin)", async () => {
        const loginData ={
            email: "faccia.book@domain.com",
            password: "sbagliatissimaPassword"
        }
        const response = await request.post("/api/v1/authentication").send(loginData);

        expect(response.status).toBe(401);
        expect(response.body).toMatchObject({
            "message": "Password errata per admin"
        });
    });

	it("Post request with wrong password (normal user)", async () => {
		const loginData = {
            email: "mario.rossi@domain.com",
            password: "wrongPassword"
        };
		const response = await request.post("/api/v1/authentication").send(loginData);

		expect(response.status).toBe(401);
		expect(response.body).toMatchObject({
			"message": "Password errata per user"
		});
	});

    it("Post request witch correct data should return 200 (admin)", async () => {
		const loginData = {
			email: "faccia.book@domain.com",
			password: "MySecretSuperPassword"
		};
		const response = await request.post ("/api/v1/authentication").send(loginData);

		expect(response.status).toBe(200);
    });
    
	it("Post request witch correct data should return 200 (normal user)", async () => {
		const loginData = {
			email: "mario.rossi@domain.com",
			password: "MySuperSecretPassword"
		};
		const response = await request.post ("/api/v1/authentication").send(loginData);

		expect(response.status).toBe(200);
	});
});