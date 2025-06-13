const request = require('supertest');
const { expect } = require('chai');
const app = require('../server');

describe('Vacation API', () => {
  it('GET / should return API info', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property('message', 'Vacation Request Management API');
  });

  it('GET /api/employees should return list of employees', async () => {
    const res = await request(app).get('/api/employees');
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('POST /api/employees should create a new employee', async () => {
    const newEmp = { name: 'Test User', email: 'test@example.com', department: 'IT', location: 'Remote' };
    const res = await request(app).post('/api/employees').send(newEmp);
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property('id');
    expect(res.body).to.include(newEmp);
  });
});
