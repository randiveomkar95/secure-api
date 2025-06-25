const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

let adminToken;

beforeAll(async () => {
  // Log in as admin
  const res = await request(app).post('/api/auth/login').send({
    email: 'testuser1@example.com',
    password: 'Password123!',
  });

  adminToken = res.body.token;
});

describe('🧑‍💼 Admin Dashboard API', () => {
  it('should return admin dashboard metrics', async () => {
    const res = await request(app)
      .get('/api/admin/dashboard')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data).toHaveProperty('totalUsers');
    expect(res.body.data).toHaveProperty('totalOrders');
    expect(res.body.data).toHaveProperty('totalRevenue');
    expect(Array.isArray(res.body.data.recentOrders)).toBe(true);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
