const app = require('../app');
const request = require('supertest');

const db = require('../lib/db.js');

const BusStop = require('../models/BusStop');

// Some test data to mock DB functions
const test1 = new BusStop();
test1.adminId = "adminId";
test1.name = "Fermata1";

const test2 = new BusStop();
test2.adminId = "adminId";
test2.name = "Fermata2";

const test3 = new BusStop();
test3.adminId = "altroAdmin";
test3.name = "Fermata3";

const mockDB = [
    test1,
    test2,
    test3
];

describe('API Bus stops - Update bus stop', () => {
    // Moking DB methods
    let bsSpyFindBy, bsSpyUpdate;

    beforeAll(() => {
        bsSpyFindBy = jest.spyOn(db.busStops, "findBy").mockImplementation(query => {
            let filtered = mockDB;

            if (query._id) filtered = filtered.filter(x => x._id == query._id);
            if (query.name) filtered = filtered.filter(x => x.name == query.name);
            if (query.adminId) filtered = filtered.filter(x => x.adminId == query.adminId);

            return filtered;
        });

        bsSpyUpdate = jest.spyOn(db.busStops, "update").mockImplementation(obj => {
            mockDB.find(x => x._id == obj._id) = obj;
            return obj;
        })
    });

    afterAll(async () => {
        bsSpyFindBy.mockRestore();
        bsSpyUpdate.mockRestore();
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
            .query({userId: "notTheOwner"})
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
    let bsSpyFindBy, bsSpyDelete;

    beforeAll(() => {
        bsSpyFindBy = jest.spyOn(db.busStops, "findBy").mockImplementation(query => {
            let filtered = mockDB;

            if (query._id) filtered = filtered.filter(x => x._id == query._id);
            if (query.name) filtered = filtered.filter(x => x.name == query.name);
            if (query.adminId) filtered = filtered.filter(x => x.adminId == query.adminId);

            return filtered;
        });

        bsSpyDelete = jest.spyOn(db.busStops, "delete").mockImplementation(obj => {
            const index = mockDB.findIndex((el) => el._id == obj._id);
            if (index > -1) {
                mockDB.splice(index, 1);
                return true;
            } else {
                return false;
            }
        })
    });

    afterAll(async () => {
        bsSpyFindBy.mockRestore();
        bsSpyDelete.mockRestore();
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
            .query({userId: "notTheOwner"})

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