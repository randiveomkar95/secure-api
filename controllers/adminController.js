const User = require('../models/User');
const Order = require('../models/Order');

exports.getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalRevenueData = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);

    const totalRevenue = totalRevenueData[0]?.total || 0;

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email');

    res.status(200).json({
      status: 'success',
      data: {
        totalUsers,
        totalOrders,
        totalRevenue,
        recentOrders,
      },
    });
  } catch (err) {
    console.error('Dashboard Error:', err);
    res.status(500).json({ message: err.message });
  }
};
