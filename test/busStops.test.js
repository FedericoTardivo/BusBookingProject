const app = require('../app');
const request = require('supertest');

const db = require('../lib/db.js');

const BusStop = require('../models/BusStop');
const Admin = require('../models/Admin');

// Some test data to mock DB functions
const test1 = new BusStop();
test1._id = "abc";
test1.companyId = "fakeCompanyId";
test1.name = "Fermata1";

const test2 = new BusStop();
test1._id = "def";
test2.companyId = "fakeCompanyId";
test2.name = "Fermata2";

const test3 = new BusStop();
test1._id = "ghi";
test3.companyId = "fakeOtherCompanyId";
test3.name = "Fermata3";

const mockBusStopsCollection = [
    test1,
    test2,
    test3
];

const mockAdmin1 = new Admin();
mockAdmin1._id = "abc";
mockAdmin1.companyId = "fakeCompanyId";
mockAdmin1.email = "admin@example.com";
mockAdmin1.password = "password";

const mockAdmin2 = new Admin();
mockAdmin2._id = "def";
mockAdmin2.companyId = "otherCompanyId";
mockAdmin2.email = "example@domain.com";
mockAdmin2.password = "password";

const mockAdminsCollection = [
    mockAdmin1,
    mockAdmin2
];

describe('API Bus stops - Update bus stop', () => {
    // Moking DB methods
    let bsSpyFindBy, bsSpyUpdate, adminSpyFindBy;

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

        // Mock db.busStops.update method
        bsSpyUpdate = jest.spyOn(db.busStops, "update").mockImplementation(obj => {
            // Find the element to update
            let oldObj = mockBusStopsCollection.find(x => x._id == obj._id);
            // Update the object with the new one
            oldObj = obj;
            // Return the updated object
            return obj;
        })

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
    });

    afterAll(async () => {
        bsSpyFindBy.mockRestore();
        bsSpyUpdate.mockRestore();
        adminSpyFindBy.mockRestore();
    });

    it("Request from unauthenticated user should return 401 error", (done) => {
        const body = {name: "Nome nuovo"};
        request(app)
            .put(`/api/v1/busStops/${test1._id}`)
            .send(body)
            
            .expect(401)
            .end(() => done());
    });

    it("Request from a user different from the owner of the bus stop should return 403 error", (done) => {
        const body = {name: "Nome nuovo"};
        request(app)
            .put(`/api/v1/busStops/${test1._id}`)
            .query({userId: mockAdmin2._id})
            .send(body)

            .expect(403)
            .end(() => done());
    });

    it("Request with a non-existing ID should return 404 error", (done) => {
        const body = {name: "Nome nuovo"};
        request(app)
            .put(`/api/v1/busStops/notExistingID`)
            .query({userId: test1.adminId})
            .send(body)

            .expect(404)
            .end(() => done());
    });

    it("Trying to update the name with an alrerady existing name should return 409 error", (done) => {
        const body = {name: test2.name};
        request(app)
            .put(`/api/v1/busStops/${test1._id}`)
            .query({userId: test1.adminId})
            .send(body)

            .expect(409)
            .end(() => done());
    });

    it("Request with an incorrect body should return 400 error", (done) => {
        const body = {wrongProperty: "This is not what the server expects"};
        request(app)
            .put(`/api/v1/busStops/${test1._id}`)
            .query({userId: test1.adminId})
            .send(body)

            .expect(400)
            .end(() => done());
    });
    
    it("Correct request should return 200 with the updated bus stop in the body", (done) => {
        const body = {name: "Nome nuovo"};
        request(app)
            .put(`/api/v1/busStops/${test1._id}`)
            .query({userId: test1.adminId})
            .send(body)

            .expect(200)
            .expect(
                {
                    self: `/api/v1/busStops/${test1._id}`,
                    id: test1._id,
                    name: body.name
                })
            .end(() => done());
    });
});

describe('API Bus stops - Delete bus stop', () => {
    // Moking DB methods
    let bsSpyFindBy, bsSpyUpdate, adminSpyFindBy;

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

        // Mock db.busStops.update method
        bsSpyUpdate = jest.spyOn(db.busStops, "update").mockImplementation(obj => {
            // Find the element to update
            let oldObj = mockBusStopsCollection.find(x => x._id == obj._id);
            // Update the object with the new one
            oldObj = obj;
            // Return the updated object
            return obj;
        })

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
    });

    afterAll(async () => {
        bsSpyFindBy.mockRestore();
        bsSpyUpdate.mockRestore();
        adminSpyFindBy.mockRestore();
    });

    it("Request from unauthenticated user should return 401 error", (done) => {
        request(app)
            .delete(`/api/v1/busStops/${test1._id}`)

            .expect(401)
            .end(() => done());
    });

    it("Request from a user different from the owner of the bus stop should return 403 error", (done) => {
        request(app)
            .delete(`/api/v1/busStops/${test1._id}`)
            .query({userId: mockAdmin2._id})

            .expect(403)
            .end(() => done());
    });

    it("Request with a non-existing ID should return 404 error", (done) => {
        request(app)
            .delete(`/api/v1/busStops/notExistingID`)
            .query({userId: test1.adminId})

            .expect(404)
            .end(() => done());
    });
    
    it("Correct request should return 204 with an empty body", (done) => {
        request(app)
            .delete(`/api/v1/busStops/${test1._id}`)
            .query({userId: test1.adminId})

            .expect(204)
            .expect({})
            .end(() => done());
    });
});