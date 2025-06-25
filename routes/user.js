const express = require('express');
const { protect, authorizeRoles } = require('../middlewares/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile and admin access
 */

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get logged-in user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns current user profile
 *       401:
 *         description: Unauthorized
 */
router.get('/me', protect, (req, res) => {
  res.json({
    message: 'You accessed a protected route',
    user: req.user,
  });
});

/**
 * @swagger
 * /users/admin:
 *   get:
 *     summary: Access for admin users only
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Welcome message for admins
 *       403:
 *         description: Forbidden - not an admin
 */
router.get('/admin', protect, authorizeRoles('admin'), (req, res) => {
  res.json({ message: 'Welcome Admin!', user: req.user });
});

module.exports = router;
