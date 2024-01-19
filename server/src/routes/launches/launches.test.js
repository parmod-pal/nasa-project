const request = require('supertest');
const app = require('../../app');
describe('TEST GET /launches',()=>{
    test('It should be respond with 200 succes',async ()=>{
        const response = await request(app)
        .get('/launches')
        .expect('Content-Type',/json/)
        .expect(200);
    })
})

describe('TEST POST /launch',()=>{
    test('It should be respond with 200 succes',()=>{
    });
    test('It should catch missing required properties',()=>{
    });
    test('It should catch invalid dates',()=>{
    });
})