const app = require('../app.js');
const supertest = require('supertest');

const db = require("../lib/db.js");

const request = supertest(app);

describe('Test API - Tickets endpoint', () => {
    beforeEach(async () => {
        await db.tickets.clear();
    })

    it("POST request without body should return 400", async () => {
        const response = await request.post("/api/v1/tickets");

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message");
        expect(response.body).toHaveProperty("fieldsErrors");
    });

    it("POST request with a ticket already bought should return 409 with an error message", async () => {
        // Buy a ticket
        const ticket = {
            userId: "_id dell'utente",
            lineId: "linea 5",
            startBusStopId: "Povo Valoni",
            endBusStopId: "Venezia Corallo",
            startTime: "14:30",
            arrivalTime: "14:35"
        }
        const correctResp = await request.post("/api/v1/tickets").send(ticket);
        if(correctResp.status != 201)
            throw new Error(`Test not completed because the response that should have been successful responded with ${correctResp.status}`);

        // Buy the same ticket again, this should result in an error
        const errResponse = await request.post("/api/v1/tickets").send(ticket);
        
        expect(errResponse.status).toBe(409);
        expect(errResponse.body).toHaveProperty("fieldName");
        expect(errResponse.body).toHaveProperty("fieldMessage");
    });

    // Buy the same ticket again should result in an error

    it("POST request with correct data should return 201 with the data of the ticket", async () => {
        const response = await request.post("/api/v1/tickets").send({
            userId: "_id dell'utente",
            lineId: "linea 5",
            startBusStopId: "Povo Valoni",
            endBusStopId: "Venezia Corallo",
            startTime: "14:30",
            arrivalTime: "14:35"
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("userId");
        expect(response.body).toHaveProperty("lineId");
        expect(response.body).toHaveProperty("startBusStopId");
        expect(response.body).toHaveProperty("endBusStopId");
        expect(response.body).toHaveProperty("startTime");
        expect(response.body).toHaveProperty("arrivalTime");
    });
});