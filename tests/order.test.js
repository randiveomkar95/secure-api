const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Product = require('../models/Product');

let token;
let orderId;
let testProductId;

beforeAll(async () => {
  // Login with a valid user/admin account
  const res = await request(app).post('/api/auth/login').send({
    email: 'testuser@example.com',
    password: 'Password123!',
  });

  token = res.body.token;

  // Create a test product to place order
  const productRes = await request(app)
    .post('/api/products')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'Order Test Product',
      description: 'Used for order API tests',
      price: 99.99,
    });

  testProductId = productRes.body._id;
});

    describe('📦 Order API', () => {
    // ✅ Create a new order
    it('should create a new order', async () => {
        const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({
            products: [
            {
                product: testProductId,
                quantity: 2,
            },
            ],
            total: 199.98 // (optional if server calculates total)
        });

        expect(res.statusCode).toBe(201);
        expect(res.body.products.length).toBeGreaterThan(0); // use .products not .items
        orderId = res.body._id;
    });


  // ✅ Get my orders
  it('should fetch logged-in user orders', async () => {
    const res = await request(app)
      .get('/api/orders/my')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // ✅ Get all orders (admin only)
  it('should fetch all orders (admin only)', async () => {
    const res = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // ✅ Update order status (admin only)
  it('should update order status', async () => {
    const res = await request(app)
      .put(`/api/orders/${orderId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'shipped' });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.status).toBe('shipped');
  });
});

// 🧹 Cleanup
afterAll(async () => {
  await Product.findByIdAndDelete(testProductId);
  await mongoose.connection.close();
});
