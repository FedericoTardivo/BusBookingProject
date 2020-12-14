const app = require('../app.js');
const request = require('supertest');
const db = require('../lib/db.js');
const { v4: uuidv4 } = require('uuid');

const BusStop = require('../models/BusStop');
const Admin = require('../models/Admin');

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

const mockBusStopsCollection = [
    bs1,
    bs2,
    bs3
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

const line1 = {
  _id: "abc",
  companyId: "fakeCompanyId",
  name: "Linea 5",
  capacity: 10,
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
      idBusStop: bs2._id,
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
      idBusStop: bs3._id,
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

describe('Test API - Line insertion', () =>{
    // Moking DB methods
    let bsSpyFindBy, adminSpyFindBy, linesSpyFindBy, linesSpyGet, linesSpyInsert;

    beforeAll(() => {
        // Mock db.busStops.findBy method
        bsSpyFindBy = jest.spyOn(db.busStops, "findBy").mockImplementation(query => {
            // Get all the bus stops
            let filtered = mockBusStopsCollection;

            // Filter based on the query
            if (query._id) filtered = filtered.filter(x => x._id == query._id);
            if (query.name) filtered = filtered.filter(x => x.name == query.name);
            if (query.companyId) filtered = filtered.filter(x => x.companyId == query.companyId);

            // Return the filtered items
            return filtered;
        });

        // Mock db.admins.findBy method
        adminSpyFindBy = jest.spyOn(db.admins, "findBy").mockImplementation(query => {
            // Get all the admins
            let filtered = mockAdminsCollection;

            // Filter based on the query
            if (query._id) filtered = filtered.filter(x => x._id == query._id);
            if (query.companyId) filtered = filtered.filter(x => x.companyId == query.companyId);
            if (query.email) filtered = filtered.filter(x => x.email == query.email);

            // Return the filtered items
            return filtered;
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

        // Mock db.lines.get method
        linesSpyGet = jest.spyOn(db.lines, "get").mockImplementation(() => {
          // Get all the lines
          return mockLinesCollection;
        });

        // Mock db.lines.insert method
        linesSpyInsert = jest.spyOn(db.lines, "insert").mockImplementation(obj => {
          // Add the ID
          const objWithId = {...obj, _id: uuidv4()};
          // Add the object to the collection
          mockLinesCollection.push(objWithId);
          // Return the ID
          return objWithId._id;
        });
    });

    afterAll(async () => {
        bsSpyFindBy.mockRestore();
        adminSpyFindBy.mockRestore();
        linesSpyFindBy.mockRestore();
        linesSpyGet.mockRestore();
        linesSpyInsert.mockRestore();
    });

    it("POST request without body should return 400 with an error in the body", (done) => {
        request(app)
          .post("/api/v1/lines")

          .expect(400)
          .expect({
            "message": "Unvalid Request.",
            "fieldsErrors": [
                {
                    "fieldName": "name",
                    "fieldMessage": "the field \"name\" must be a non-empty string"
                },
                {
                  "fieldName": "capacity",
                  "fieldMessage": "the field \"capacity\" must be positive number"
                },
                {
                    "fieldName": "path",
                    "fieldMessage": "the field \"path\" must be a non-empty array"
                }
            ]
        })
        .end(() => done());
    });

    it("POST request with correct data should return 201 with the account just created in the body", async () => {
        const response = await request(app).post("/api/v1/lines").query({userId: admin1._id}).send({
          name: "AnotherLine",
          capacity: 9,
          path: [
            {
              busStopId: bs1._id,
              number: 1,
              times: [
                {time: "10:00", accessibility: true}
              ]
            }
          ]
        });

        expect(response.status).toBe(201);
        expect(response.headers).toHaveProperty('location');
        expect(response.body).toHaveProperty('name');
        expect(response.body).toHaveProperty('capacity');
        expect(response.body).toHaveProperty('path');
    });

    it("POST request with already inserted line should return 409 with an error in the body", async()=>{
        const body = {
          name: "AnotherLine",
          capacity: 9,
          path: [
            {
              busStopId: bs2._id,
              number: 1,
              times: [
                {time: "10:00", accessibility: true}
              ]
            }
          ]
        };
        
        const response = await request(app).post("/api/v1/lines").query({userId: admin1._id}).send(body);
        expect(response.status).toBe(409);
        
        expect(response.body).toMatchObject({
                    "fieldName" : "name",
                    "fieldMessage": `La linea \"${body.name}\" è già esistente`
        });   
    });
    
});

describe('Test API - Lines Modification',() => {
  var tempLineId;
  var tempAdminId;
  var tempCompanyId;
  beforeAll(async () => {
    tempCompanyId = await db.companies.insert({
      name : "compagniaDiProva"
    });
    tempLineId=await db.lines.insert(
      {
        companyId: tempCompanyId,
        name: "Linea di prova per modifica",
        capacity: "4",
        path: [{"busStopId":"b6a6cb98-6341-48ff-b220-3513dffdded7","number":1,"times":[{"time":"12:00","accessibility":false}]}]
      }
    );
    tempAdminId=await db.admins.insert({
        companyId: tempCompanyId,
        email: "admin@example.com",
        password: "password"
    });
  });

  afterAll(async () => {
    await db.lines.clear();
    await db.admins.clear();
    await db.companies.clear();
  });
  
  it("Put request with user not logged should return 401", async () => {
    const response = await request(app).put(`/api/v1/lines/${tempLineId}`);
    expect(response.status).toBe(401);
    expect(response.text).toBe("Utente non autenticato.");
  });

  it("Put request with not existing line should return 404", async () => {
    const response = await request(app).put(`/api/v1/lines/id_non_esistente`).query({userId: tempAdminId});
    expect(response.status).toBe(404);
    expect(response.text).toBe("404: Not Found");
  });

  it("Put request with not ownded line should return 403", async () => {
    const response = await request(app).put(`/api/v1/lines/${tempLineId}`).query({userId: tempAdminId}).send({
      companyId : "not the right one"
    });
    expect(response.status).toBe(403);
    expect(response.text).toBe("Prohibited access");
  });

  it("Put request with wrong parameters should return 400", async () => {
    const response = await request(app).put(`/api/v1/lines/${tempLineId}`).query({userId: tempAdminId}).send({
        _id: tempLineId,
        companyId: tempCompanyId,
        name: "Linea di prova per modifica",
        capacity: 0,
        path: [{"busStopId":"b6a6cb98-6341-48ff-b220-3513dffdded7","number":1,"times":[{"time":"12:00","accessibility":false}]}]
    });
    expect(response.status).toBe(400);
  });

  it("Put request with right parameters should return 200", async () => {
    const response = await request(app).put(`/api/v1/lines/${tempLineId}`).query({userId: tempAdminId}).send({
        _id: tempLineId,
        companyId: tempCompanyId,
        name: "Linea di prova per modifica",
        capacity: 5,
        path: [{"busStopId":"b6a6cb98-6341-48ff-b220-3513dffdded7","number":1,"times":[{"time":"12:00","accessibility":false}]}]
    });
    expect(response.status).toBe(200);
  });
});
