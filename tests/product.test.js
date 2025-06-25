const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

let token;
let createdProductId;

beforeAll(async () => {
  // Login with an admin account to get token
  const res = await request(app).post('/api/auth/login').send({
    email: 'testuser@example.com',
    password: 'Password123!',
  });

  token = res.body.token;
});

describe('📦 Product API', () => {
  // ✅ GET all products
  it('should return all products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // ✅ CREATE product
  it('should create a new product (admin only)', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Product',
        description: 'A test product',
        price: 49.99,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Test Product');
    createdProductId = res.body._id;
  });

  // ✅ GET product by ID
  it('should get product by ID', async () => {
    const res = await request(app).get(`/api/products/id/${createdProductId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(createdProductId);
  });

  // ✅ UPDATE product
  it('should update the product', async () => {
    const res = await request(app)
      .put(`/api/products/id/${createdProductId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ price: 59.99 });

    expect(res.statusCode).toBe(200);
    expect(res.body.price).toBe(59.99);
  });

  // ✅ DELETE product
  it('should delete the product', async () => {
    const res = await request(app)
      .delete(`/api/products/id/${createdProductId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });
});

// 🧹 Cleanup DB connection
afterAll(async () => {
  await mongoose.connection.close();
});
