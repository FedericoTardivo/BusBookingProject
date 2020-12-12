const app = require('../app.js');
const supertest = require('supertest');

const db = require("../lib/db.js");

const request = supertest(app);

const US = require('../models/User');
const TICK = require('../models/Ticket');

// Some test data to mock DB functions
    //new Mock User
const US1 = new US();
US1._id ="US1";
US1.name="Nome1";
US1.surname="Surname1";
US1.email="EmailUS1@esempio.com"
US1.password="pass1"

const US2 = new US();
US2._id ="US2";
US2.name="Nome2";
US2.surname="Surname2";
US2.email="EmailUS2@esempio.com"
US2.password="pass2"

const US3 = new US();
US3._id ="US3";
US3.name="Nome3";
US3.surname="Surname3";
US3.email="EmailUS3@esempio.com"
US3.password="pass3"

    //new Mock Ticket
const Tick1 = new TICK();
Tick1._id = 'T1';
Tick1.userId = 'US1';

const Tick2 = new TICK();
Tick1._id = 'T2';
Tick1.userId = 'US2';

const Tick3 = new TICK();
Tick1._id = 'T3';
Tick1.userId = 'US2';

const MockUSCollection = {
    US1,
    US2,
    US3
}
const MockTickCollection ={
    Tick1,
    Tick2,
    Tick3
}



describe('Test API - Tickets endpoint', () => {
    beforeEach(async () => {
        await db.tickets.clear();
    })

    afterAll(async () => {
		await db.tickets.clear();
	});

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

describe ('Test API - Delete Tickets', () => {
    // Moking DB methods
    let ticketSpyFindBy, adminSpyFindBy;

    beforeAll(() => {
        // Mock db.tickets.findBy method
        ticketSpyFindBy = jest.spyOn(db.tickets, "findBy").mockImplementation(query => {
            // Get all the ticket
            let filtered = MockTickCollection;

            // Filter based on the query
            if (query._id) filtered = filtered.filter(x => x._id == query._id);

            // Return the filtered items
            return filtered;
        });

        // Mock db.admins.findBy method
        userSpyFindBy = jest.spyOn(db.users, "findBy").mockImplementation(query => {
            // Get all the user
            let filtered = MockUSCollection;

            // Filter based on the query
            if (query._id) filtered = filtered.filter(x => x._id == query._id);

            // Return the filtered items
            return filtered;
        });
    });

    afterAll(async () => {
        bsSpyFindBy.mockRestore();
        adminSpyFindBy.mockRestore();
    });

    it("Request from unauthenticated user should return 401 error", (done) => {
        request(app)
            .delete(`/api/v1/tickets/${Tick1._id}`)

            .expect(401)
            .end(() => done());
    });

    it("Request from a user different from the owner of the bus stop should return 403 error", (done) => {
        request(app)
            .delete(`/api/v1/tickets/${Tick3._id}`)
            .query({userId: US1._id})

            .expect(403)
            .end(() => done());
    });

    it("Request with a non-existing ID should return 404 error", (done) => {
        request(app)
            .delete(`/api/v1/tickets/IDSBagliato`)
            .query({userId: US1._id})

            .expect(404)
            .end(() => done());
    });
    
    it("Correct request should return 204 ", (done) => {
        request(app)
            .delete(`/api/v1/tickets/${Tick1._id}`)
            .query({userId: US1._id})

            .expect(204)
            .expect({})
            .end(() => done());
    });
});