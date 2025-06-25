const Order = require('../models/Order');

exports.mockCheckout = async (req, res) => {
  const { orderId, method } = req.body;

  const supportedMethods = ['stripe', 'paypal', 'razorpay'];
  if (!supportedMethods.includes(method)) {
    return res.status(400).json({ message: 'Invalid payment method' });
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Simulate success
    order.status = 'paid';
    order.payment = {
      method,
      transactionId: `${method}_txn_${Math.random().toString(36).substring(2, 10)}`,
      paidAt: new Date(),
    };

    await order.save();

    res.status(200).json({
      message: `Payment successful (mock) via ${method}`,
      order,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
