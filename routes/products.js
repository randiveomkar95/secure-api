const express = require('express');
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

const { protect, authorizeRoles } = require('../middlewares/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management (public + admin)
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 */

/**
 * @swagger
 * /products/id/{id}:
 *   get:
 *     summary: Get a single product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: "iPhone 15"
 *               description:
 *                 type: string
 *                 example: "Latest Apple iPhone"
 *               price:
 *                 type: number
 *                 example: 999.99
 *               imageUrl:
 *                 type: string
 *                 example: "https://example.com/image.png"
 *               inStock:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Product created
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /products/id/{id}:
 *   put:
 *     summary: Update a product (admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Product updated
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /products/id/{id}:
 *   delete:
 *     summary: Delete a product (admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted
 *       404:
 *         description: Product not found
 */

// Public routes
router.get('/', getProducts);
router.get('/id/:id', getProduct); // changed from '/:id' to avoid parsing ambiguity

// Admin-only routes
router.post('/', protect, authorizeRoles('admin'), createProduct);
router.put('/id/:id', protect, authorizeRoles('admin'), updateProduct);
router.delete('/id/:id', protect, authorizeRoles('admin'), deleteProduct);

module.exports = router;
