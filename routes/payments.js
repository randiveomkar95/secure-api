const express = require('express');
const { mockCheckout } = require('../controllers/paymentController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Mock payment and checkout routes
 */

/**
 * @swagger
 * /payments/checkout:
 *   post:
 *     summary: Mock a checkout process (Razorpay/Stripe simulation)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 499.99
 *               currency:
 *                 type: string
 *                 example: INR
 *     responses:
 *       200:
 *         description: Mock checkout response
 *       401:
 *         description: Unauthorized
 */
router.post('/checkout', protect, mockCheckout);

module.exports = router;
