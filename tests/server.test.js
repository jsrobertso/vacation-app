const request = require('supertest');
const app = require('../server');

describe('Vacation API', () => {
  it('GET / should return API info', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Vacation Request Management API');
  });

  it('GET /api/employees should return list of employees', async () => {
    const res = await request(app).get('/api/employees');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/employees should create a new employee', async () => {
    const newEmp = { name: 'Test User', email: 'test@example.com', department: 'IT', location: 'Remote' };
    const res = await request(app).post('/api/employees').send(newEmp);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toMatchObject(newEmp);
  });
});
