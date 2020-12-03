const app = require('../app.js');
const supertest = require('supertest');

const request = supertest(app);

describe('Test API - Line insertion', () =>{
    it("POST request without body should return 400 with an error in the body", async()=>{
        const response = await request.post("/api/v1/lines");

        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
            "message": "Unvalid Request.",
            "fieldsErrors": [
                {
                    "fieldName": "name",
                    "fieldMessage": "the field \"name\" must be a non-empty string"
                },
                {
                    "fieldName": "path",
                    "fieldMessage": "the field \"path\" must be a non-empty array"
                }
            ]
        });
    });

    it("POST request with correct data should return 201 with the account just created in the body", async () =>{
        const line = {
            name: "Linea 5",
            path: [
              {
                idBusStop: "a",
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
                idBusStop: "b",
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
        const response = await request.post("/api/v1/lines").send(line);

        expect(response.status).toBe(201);
        expect(response.headers).toHaveProperty('location');
        expect(response.body).toHaveProperty('name');
        expect(response.body).toHaveProperty('path');
    });

    it("POST request with already inserted line should return 409 with an error in the body", async()=>{
        
        const line = {
            name: "Linea 5",
            path: [
              {
                idBusStop: "a",
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
                idBusStop: "b",
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
        const response = await request.post("/api/v1/lines").send(line);
        expect(response.status).toBe(409);
        
        expect(response.body).toMatchObject({
                    "fieldName" : "name",
                    "fieldMessage": `La linea \"${line.name}\" è già esistente`
        });   
    });
    
});