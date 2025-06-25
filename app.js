// app.js
const express = require('express');
const errorHandler = require('./middlewares/errorHandler');
const AppError = require('./utils/AppError');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();
require('./config/passport');
require('./config/db')();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payments');
const { swaggerUi, swaggerSpec } = require('./swagger');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(session({
  secret: 'secretkey',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);


app.get('/', (req, res) => res.send('API is running...'));

// Global error handlers
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

app.use(errorHandler);

module.exports = app;
