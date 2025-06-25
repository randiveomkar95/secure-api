const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

let token = ''; // to be reused in other tests

describe('🔐 Auth API', () => {

  const testUser = {
    name: 'Test User1',
    email: 'testuser1@example.com',
    password: 'Password123!',
  };

  // ✅ REGISTER
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe(testUser.email);
  });

  // ✅ LOGIN
  it('should login an existing user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe(testUser.email);

    // Store token for future use
    token = res.body.token;
  });
});

// Close DB connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

module.exports = { token };
