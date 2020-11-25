const app = require('../app.js');
const supertest = require('supertest');

const request = supertest(app);

describe('Test API - Line insertion', () =>{
    afterAll((done) =>{
        done();
    })
    it("POST request without body should return 400 with an error in the body", async()=>{
        const response = await request.post("/api/v1/lines");

        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
            "message": "Unvalid Request.",
            "fieldsErrors": [
                {
                    "fieldName": "number",
                    "fieldMessage": "the field \"number\" must be a number and non-empty"
                },
                {
                    "fieldName": "BusStopTotal",
                    "fieldMessage": "the field \"BusStopTotal\" must be a number and non-empty"
                },
                {
                    "fieldName": "BusStopName",
                    "fieldMessage": "the field \"BusStopName\" must be a non-empty string"
                },
                {
                    "fieldName": "BusStopOrder",
                    "fieldMessage": "the field \"BusStopOrder\" must be a number and non-empty"
                },
                {
                    "fieldName": "ArrivalTime",
                    "fieldMessage": "the field \"ArrivalTime\" must be a non-empty string"
                }
            ]
        });
    });

    it("POST request with correct data should return 201 with the account just created in the body", async () =>{
        const line = {
            number: 6,
            BusStopTotal: 10,
            BusStopName: "Piazza Dante",
            BusStopOrder: 8,
            ArrivalTime: "20:00",
            loggeduser:{id: "fakeid"} // only for testing
        };
        const response = await request.post("/api/v1/lines").send(line);

        expect(response.status).toBe(201);
        expect(response.headers).toHaveProperty('location');
        expect(response.body).toHaveProperty('number');
        expect(response.body).toHaveProperty('BusStopTotal');
        expect(response.body).toHaveProperty('BusStopName');
        expect(response.body).toHaveProperty('BusStopOrder');
        expect(response.body).toHaveProperty('ArrivalTime');
    });
    it("POST request with already inserted line should return 409 with an error in the body", async()=>{
        
        const line = {
            number: 6,
            BusStopTotal: 10,
            BusStopName: "Piazza Dante",
            BusStopOrder: 8,
            ArrivalTime: "20:00",
            loggeduser:{id: "fakeid"} // only for testing
        };
        const response = await request.post("/api/v1/lines").send(line);
        expect(response.status).toBe(409);
        
        expect(response.body).toMatchObject({
            
                    "fieldName" : "number",
                    "fieldMessage": `Linea Numero \"${line.Number}\" già esistente`
        });   
    });
    
});