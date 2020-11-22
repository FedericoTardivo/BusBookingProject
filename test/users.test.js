const app = require('../index.js');
const supertest = require('supertest');

const request = supertest(app);

describe('Test API - Users endpoint', () => {
    afterAll((done) => {
        done();
    })

    it("POST request without body should return 400 with an error in the body", async () => {
        const response = await request.post("/users");

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
        const response = await request.post("/users").send(user);

        expect(response.status).toBe(201);
        expect(response.headers).toHaveProperty('location');
        expect(response.body).toHaveProperty('self');
        expect(response.body).toHaveProperty('name');
        expect(response.body).toHaveProperty('surname');
        expect(response.body).toHaveProperty('email');
    });
});