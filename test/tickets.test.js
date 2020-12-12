const app = require('../app.js');
const request = require('supertest');

const db = require("../lib/db.js");

const { v4: uuidv4 } = require('uuid');

const BusStop = require('../models/BusStop');
const Admin = require('../models/Admin');
const User = require('../models/User');
const Ticket = require('../models/Ticket.js');
const { expect } = require('@jest/globals');

// Some test data to mock DB functions
const bs1 = new BusStop();
bs1._id = "abc";
bs1.companyId = "fakeCompanyId";
bs1.name = "Fermata1";

const bs2 = new BusStop();
bs2._id = "def";
bs2.companyId = "fakeCompanyId";
bs2.name = "Fermata2";

const bs3 = new BusStop();
bs3._id = "ghi";
bs3.companyId = "fakeOtherCompanyId";
bs3.name = "Fermata3";

const bs4 = new BusStop();
bs4._id = "jky";
bs4.companyId = "fakeCompanyId";
bs4.name = "Fermata3";

const mockBusStopsCollection = [
    bs1,
    bs2,
    bs3,
    bs4
];

const admin1 = new Admin();
admin1._id = "abc";
admin1.companyId = "fakeCompanyId";
admin1.email = "admin@example.com";
admin1.password = "password";

const admin2 = new Admin();
admin2._id = "def";
admin2.companyId = "otherCompanyId";
admin2.email = "example@domain.com";
admin2.password = "password";

const mockAdminsCollection = [
    admin1
];

const user1 = new User();
user1._id = "abc";
user1.name = "Mario";
user1.surname = "Rossi";
user1.email = "mario.rossi@example.com";
user1.password = "password";

const line1 = {
  _id: "abc",
  companyId: "fakeCompanyId",
  name: "Linea 5",
  capacity: 2,
  path: [
    {
      busStopId: bs1._id,
      number: 1,
      times: [
        {
          time: "10:00",
          accessibility: true
        },
        {
          time: "11:00",
          accessibility: true
        }
      ]
    },
    {
      busStopId: bs2._id,
      number: 2,
      times: [
        {
          time: "10:10",
          accessibility: true
        },
        {
          time: "11:10",
          accessibility: true
        }
      ]
    },
    {
        busStopId: bs4._id,
        number: 3,
        times: [
          {
            time: "10:20",
            accessibility: true
          },
          {
            time: "11:20",
            accessibility: true
          }
        ]
      }
  ]
};

const line2 = {
  _id: "def",
  companyId: "otherCompanyId",
  name: "Linea Mattia",
  capacity: 6,
  path: [
    {
      busStopId: bs1._id,
      number: 1,
      times: [
        {
          time: "14:00",
          accessibility: true
        },
        {
          time: "15:00",
          accessibility: true
        }
      ]
    },
    {
      busStopId: bs3._id,
      number: 2,
      times: [
        {
          time: "14:10",
          accessibility: true
        },
        {
          time: "15:20",
          accessibility: true
        }
      ]
    }
  ]
};

const mockLinesCollection = [
  line1,
  line2
];

const ticket1 = new Ticket();
ticket1._id = "abc";
ticket1.issueDate = new Date("2020-12-10T08:12:01+00:00");
ticket1.userId = user1._id;
ticket1.lineId = line1._id;
ticket1.startBusStopId = line1.path[0].busStopId;
ticket1.endBusStopId = line1.path[1].busStopId;
ticket1.startTime = new Date(`2020-12-11T${line1.path[0].times[0].time}:00+00:00`);
ticket1.arrivalTime = new Date(`2020-12-11T${line1.path[1].times[0].time}:00+00:00`);

const ticket2 = new Ticket();
ticket2._id = "def";
ticket2.issueDate = new Date("2020-12-10T08:15:51+00:00");
ticket2.userId = user1._id;
ticket2.lineId = line1._id;
ticket2.startBusStopId = line1.path[0].busStopId;
ticket2.endBusStopId = line1.path[1].busStopId;
ticket2.startTime = new Date(`2020-12-11T${line1.path[0].times[0].time}:00+00:00`);
ticket2.arrivalTime = new Date(`2020-12-11T${line1.path[1].times[0].time}:00+00:00`);

const ticket3 = new Ticket();
ticket3._id = "ghi";
ticket3.issueDate = new Date("2020-12-10T09:32:14+00:00");
ticket3.userId = user1._id;
ticket3.lineId = line1._id;
ticket3.startBusStopId = line1.path[0].busStopId;
ticket3.endBusStopId = line1.path[1].busStopId;
ticket3.startTime = new Date(`2020-12-11T${line1.path[0].times[1].time}:00+00:00`);
ticket3.arrivalTime = new Date(`2020-12-11T${line1.path[1].times[1].time}:00+00:00`);

const ticket4 = new Ticket();
ticket4._id = "jkl";
ticket4.issueDate = new Date("2020-11-02T18:52:42+00:00");
ticket4.userId = user1._id;
ticket4.lineId = line1._id;
ticket4.startBusStopId = line1.path[0].busStopId;
ticket4.endBusStopId = line1.path[1].busStopId;
ticket4.startTime = new Date(`2020-12-04T${line1.path[0].times[0].time}:00+00:00`);
ticket4.arrivalTime = new Date(`2020-12-04T${line1.path[1].times[0].time}:00+00:00`);

const mockTicketsCollection = [
    ticket1,
    ticket2,
    ticket3,
    ticket4
];

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
    let ticketsSpyFindBy, linesSpyFindBy, ticketsSpyInsert, ticketsSpyGet;

    beforeAll(() => {
        // Mock db.tickets.findBy method
        ticketsSpyFindBy = jest.spyOn(db.tickets, "findBy").mockImplementation(query => {
            let filtered = mockTicketsCollection;

            // Filter based on the query
            if (query._id) filtered = filtered.filter(x => x._id == query._id);
            if (query.issueDate) filtered = filtered.filter(x => x.issueDate.getTime() === query.issueDate.getTime());
            if (query.userId) filtered = filtered.filter(x => x.userId == query.userId);
            if (query.lineId) filtered = filtered.filter(x => x.lineId == query.lineId);
            if (query.startBusStopId) filtered = filtered.filter(x => x.startBusStopId == query.startBusStopId);
            if (query.endBusStopId) filtered = filtered.filter(x => x.endBusStopId == query.endBusStopId);
            if (query.startTime) filtered = filtered.filter(x => x.startTime.getTime() === query.startTime.getTime());
            if (query.arrivalTime) filtered = filtered.filter(x => x.arrivalTime.getTime() === query.arrivalTime.getTime());
            
            // Return the filtered items
            return filtered;
        });

        // Mock db.tickets.get method
        ticketsSpyGet = jest.spyOn(db.tickets, "get").mockImplementation(() => {
          return mockTicketsCollection;
      });

        // Mock db.lines.findBy method
        linesSpyFindBy = jest.spyOn(db.lines, "findBy").mockImplementation(query => {
            // Get all the lines
            let filtered = mockLinesCollection;
  
            // Filter based on the query
            if (query._id) filtered = filtered.filter(x => x._id == query._id);
            if (query.companyId) filtered = filtered.filter(x => x.companyId == query.companyId);
            if (query.name) filtered = filtered.filter(x => x.name == query.name);
            if (query.capacity) filtered = filtered.filter(x => x.capacity == query.capacity);
            if (query.path) filtered = filtered.filter(x => x.path == query.path);
  
            // Return the filtered items
            return filtered;
          });

        // Mock db.tickets.insert method
        ticketsSpyInsert = jest.spyOn(db.tickets, "insert").mockImplementation(obj => {
            // Add the ID
            const objWithId = {...obj, _id: uuidv4()};
            // Add the object to the collection
            mockTicketsCollection.push(objWithId);
            // Return the ID
            return objWithId._id;
        });
    });

    afterAll(async () => {
        ticketsSpyFindBy.mockRestore();
        linesSpyFindBy.mockRestore();
        ticketsSpyInsert.mockRestore();
        ticketsSpyGet.mockRestore();
    });

    /*it("POST request without body should return 400", async () => {
        const response = await request(app).post("/api/v1/tickets").query({userId: user1._id});

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message");
        expect(response.body).toHaveProperty("fieldsErrors");
    });

    it("Buying a ticket without authentication must return 401", async () => {
        const response = await request(app).post("/api/v1/tickets");

        expect(response.status).toBe(401);
    });*/

    it("POST request with a ticket already bought should return 409 with an error message", async () => {
        // Buy a ticket
        /*const ticket = {
            lineId: line1._id,
            startBusStopId: line1.path[0].busStopId,
            endBusStopId: line1.path[1].busStopId,
            startTime: `2020-12-09T${line1.path[0].times[0].time}:00`,
            arrivalTime: `2020-12-09T${line1.path[1].times[0].time}:00`
        };
        const correctResp = await request(app).post("/api/v1/tickets").query({userId: user1._id}).send(ticket);
        if(correctResp.status != 201)
            throw new Error(`Test not completed because the response that should have been successful responded with ${correctResp.status}`);*/

        // Buy the same ticket again, this should result in an error
        const response = await request(app).post("/api/v1/tickets").query({userId: ticket1.userId}).send({
            lineId: ticket1.lineId,
            startBusStopId: ticket1.startBusStopId,
            endBusStopId: ticket1.endBusStopId,
            startTime: ticket1.startTime,
            arrivalTime: ticket1.arrivalTime
        });
        
        console.log(response.body);

        expect(response.status).toBe(409);
        expect(response.body).toHaveProperty("fieldName");
        expect(response.body).toHaveProperty("fieldMessage");
    });

    // Buy the same ticket again should result in an error

    /*it("POST request with correct data should return 201 with the data of the ticket", async () => {
        const ticket = {
            lineId: line2._id,
            startBusStopId: line2.path[0].busStopId,
            endBusStopId: line2.path[1].busStopId,
            startTime: new Date(`2020-12-09T${line2.path[0].times[0].time}:00+00:00`),
            arrivalTime: new Date(`2020-12-09T${line2.path[1].times[0].time}:00+00:00`)
        };
        const response = await request(app).post("/api/v1/tickets").query({userId: user1._id}).send(ticket);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("userId");
        expect(response.body).toHaveProperty("lineId");
        expect(response.body).toHaveProperty("startBusStopId");
        expect(response.body).toHaveProperty("endBusStopId");
        expect(response.body).toHaveProperty("startTime");
        expect(response.body).toHaveProperty("arrivalTime");
    });
    
    it("Buying a ticket when there are no available seats must return 409 error", async () => {
        const body = {
            lineId: line1._id,
            startBusStopId: line1.path[0].busStopId,
            endBusStopId: line1.path[1].busStopId,
            startTime: new Date(`2020-12-11T${line1.path[0].times[0].time}:00+00:00`),
            arrivalTime: new Date(`2020-12-11T${line1.path[1].times[0].time}:00+00:00`)
        };
        const response = await request(app).post("/api/v1/tickets").query({userId: user1._id}).send(body);

        expect(response.status).toBe(409);
    });*/
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
        supertest(app)
            .delete(`/api/v1/tickets/${Tick1._id}`)

            .expect(401)
            .end(() => done());
    });

    it("Request from a user different from the owner of the bus stop should return 403 error", (done) => {
        supertest(app)
            .delete(`/api/v1/tickets/${Tick3._id}`)
            .query({userId: US1._id})

            .expect(403)
            .end(() => done());
    });

    it("Request with a non-existing ID should return 404 error", (done) => {
        supertest(app)
            .delete(`/api/v1/tickets/IDSBagliato`)
            .query({userId: US1._id})

            .expect(404)
            .end(() => done());
    });
    
    it("Correct request should return 204 ", (done) => {
        supertest(app)
            .delete(`/api/v1/tickets/${Tick1._id}`)
            .query({userId: US1._id})

            .expect(204)
            .expect({})
            .end(() => done());
    });

    
});