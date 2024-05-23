const Order = require("../Models/order.model");
// const Product = require("../Models/product.model");
const User = require("../Models/user.model");
const productController = require("./product.controller");

const fetchPaginatedOrders = async (req, res) => {
  const {
    page = 1,
    pageSize = 6,
    // orderStatus
  } = req.query;
  console.log("req.query", req.query);

  const filters = {};

  // if (orderStatus) {
  //   filters.orderStatus = orderStatus;
  // }

  try {
    const response = await Order.fetchOrders(
      parseInt(page),
      parseInt(pageSize),
      filters
    );
    console.log("order response", response);
    res.json({ response });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const placeOrder = async (req, res) => {
  console.log("req.user.firstName", req.user.firstName);
  const { cart, total_amount, shipping } = req.body;

  const products = cart.map((product) => {
    const [productId] = product.id.split("-");
    return { ...product, id: productId };
  });

  // console.log('order products', products);
  // console.log('order products', products)
  try {
    const userID = req.user.id;

    // Check if user exists
    const user = await User.findById(userID);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Create a new order document in the database
    const newOrder = new Order({
      user: {
        id: userID,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
      },
      products,
      totalPrice: total_amount,
      shipping,
      // orderStatus: 'pending', // Default status
      // paymentStatus: 'pending' // Default status
    });

    // Save the order to the database
    await newOrder.save();

    // Update stock levels of the ordered products
    await productController.updateProductStock(products);

    // Return success response
    console.log("add order success");

    res
      .status(201)
      .json({ success: true, message: "Order placed successfully" });
  } catch (error) {
    // Return error response
    res.status(500).json({ success: false, error: error.message });
    console.log("add order error", error.message);
  }
};
// const getOrderHistoryForClient = async (req, res) => {
//   try {
//     const userID = req.params.id;

//     const orders = await Order.find({ userID });

//     return res.status(200).json({ success: true, orders: orders });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// const getOrderStatus = async (req, res) => {
//     try {
//       // Retrieve order ID from request
//       const orderId = req.params.id;

//       // Fetch order details
//       const order = await Order.findById(orderId);

//       if(!order){
//         return res.json({success:false, error:'order not found or deleted from DB'})
//       }
//       // Return order status
//       res.status(200).json({ success: true, orderStatus: order.orderStatus });
//     } catch (error) {
//       // Return error response
//       res.status(500).json({ success: false, error: error.message });
//     }
//   };

// const getOrderDetails = async (req, res) => {
//     try {
//         const orderID = req.params.id;

//         // Find the order by ID and populate user and product details
//         const order = await Order.findById(orderID)
//             .populate('userID', 'name email') // Populate user details (e.g., name, email)
//             .populate('products.productID', 'name price'); // Populate product details (e.g., name, price)

//         if (!order) {
//             return res.status(404).json({ success: false, message: 'Order not found' });
//         }

//         // Return the order details with populated user and product information
//         return res.status(200).json({ success: true, order });
//     } catch (error) {
//         // Return error response
//         res.status(500).json({ success: false, error: error.message });
//     }
// };

// const getAllOrders = async (req, res) => {
//     try {
//         const orders = await Order.find();
//         const count = await Order.countDocuments()
//         return res.status(200).json({ success: true, orders,count });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// };

const updateOrderStatus = async (req, res) => {
  try {
    const orderID = req.params.id;
    const { newStatus } = req.body;

    const order = await Order.findById(orderID);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Update the order status
    order.orderStatus = newStatus;
    await order.save();

    console.log("order", order);

    return res
      .status(200)
      .json({ success: true, message: "Order status updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// DASHBOARD STATS:
  const getTodayAndYesterdayRevenueComparison  = async (req, res) => {
    try {
      // Get today's date and yesterday's date
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set time to the beginning of the day
  
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
  
      // MongoDB aggregation pipeline to calculate total revenue for today and yesterday
      const [todayRevenue, yesterdayRevenue] = await Promise.all([
        // Calculate today's revenue
        Order.aggregate([
          {
            $match: {
              paymentStatus: 'succeeded',
              createdAt: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
            },
          },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: '$totalPrice' },
            },
          },
        ]),
  
        // Calculate yesterday's revenue
        Order.aggregate([
          {
            $match: {
              paymentStatus: 'succeeded',
              createdAt: { $gte: yesterday, $lt: today },
            },
          },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: '$totalPrice' },
            },
          },
        ]),
      ]);
  
      // Extract today's and yesterday's revenue from the aggregation results
      const todayRevenueAmount = todayRevenue.length > 0 ? todayRevenue[0].totalRevenue : 0;
      const yesterdayRevenueAmount = yesterdayRevenue.length > 0 ? yesterdayRevenue[0].totalRevenue : 0;
  
      // Calculate percentage change relative to yesterday's revenue
      let percentageChange = 0;
      if (yesterdayRevenueAmount !== 0) {
        percentageChange = ((todayRevenueAmount - yesterdayRevenueAmount) / yesterdayRevenueAmount) * 100;
      } else if (todayRevenueAmount !== 0) {
        percentageChange = 100; // Assume a 100% increase if yesterday's revenue is zero but today's revenue is not zero
      }
  
      // Format the comparison result
      const comparisonResult = Number(percentageChange.toFixed(2));
  
      res.json({
        todayRevenue: todayRevenueAmount,
        yesterdayRevenue: yesterdayRevenueAmount,
        comparison: comparisonResult,
      })
    } catch (error) {
      console.error('Error calculating revenue comparison:', error);
      throw error; // Handle or propagate the error as needed
    }
  };

  const getTodayAndYesterdayOrderCountComparison = async (req, res) => {
    try {
      // Get today's date and yesterday's date
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set time to the beginning of the day
  
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
  
      // MongoDB aggregation pipeline to calculate order count for today and yesterday
      const [todayOrderCount, yesterdayOrderCount] = await Promise.all([
        // Count orders for today
        Order.aggregate([
          {
            $match: {
              paymentStatus: 'succeeded',
              createdAt: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
            },
          },
          {
            $group: {
              _id: null,
              orderCount: { $sum: 1 },
            },
          },
        ]),
  
        // Count orders for yesterday
        Order.aggregate([
          {
            $match: {
              paymentStatus: 'succeeded',
              createdAt: { $gte: yesterday, $lt: today },
            },
          },
          {
            $group: {
              _id: null,
              orderCount: { $sum: 1 },
            },
          },
        ]),
      ]);
  
      // Extract today's and yesterday's order counts from the aggregation results
      const todayOrderCountValue = todayOrderCount.length > 0 ? todayOrderCount[0].orderCount : 0;
      const yesterdayOrderCountValue = yesterdayOrderCount.length > 0 ? yesterdayOrderCount[0].orderCount : 0;
  
      // Calculate percentage change relative to yesterday's order count
      let percentageChange = 0;
      if (yesterdayOrderCountValue !== 0) {
        percentageChange = ((todayOrderCountValue - yesterdayOrderCountValue) / yesterdayOrderCountValue) * 100;
      } else if (todayOrderCountValue !== 0) {
        percentageChange = 100; // Assume a 100% increase if yesterday's count is zero but today's count is not zero
      }
  
      // Format the comparison result
      const comparisonResult = Number(percentageChange.toFixed(2));
  
      res.json({
        todayOrderCount: todayOrderCountValue,
        yesterdayOrderCount: yesterdayOrderCountValue,
        comparison: comparisonResult,
      });
    } catch (error) {
      console.error('Error calculating order count comparison:', error);
      res.status(500).json({ error: 'Error calculating order count comparison' });
    }
  };
  const getTotalRevenue = async (req, res) => {
    try {
      // Get the start and end dates for the current year
      const startOfYear = new Date(new Date().getFullYear(), 0, 1);
      const endOfYear = new Date(new Date().getFullYear() + 1, 0, 1);
  
      // Get the start and end dates for the previous year
      const startOfLastYear = new Date(new Date().getFullYear() - 1, 0, 1);
      const endOfLastYear = startOfYear;
  
      // Aggregate total revenue for the current year
      const currentYearRevenue = await Order.aggregate([
        { $match: { paymentStatus: 'succeeded', createdAt: { $gte: startOfYear, $lt: endOfYear } } },
        { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } },
      ]);
  
      // Aggregate total revenue for the previous year
      const lastYearRevenue = await Order.aggregate([
        { $match: { paymentStatus: 'succeeded', createdAt: { $gte: startOfLastYear, $lt: endOfLastYear } } },
        { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } },
      ]);
  
      // Extract the total revenues from the aggregation results
      const currentYearRevenueAmount = currentYearRevenue.length > 0 ? currentYearRevenue[0].totalRevenue : 0;
      const lastYearRevenueAmount = lastYearRevenue.length > 0 ? lastYearRevenue[0].totalRevenue : 0;
  
      // Calculate percentage change relative to last year's revenue
      let percentageChange = 0;
      if (lastYearRevenueAmount !== 0) {
        percentageChange = ((currentYearRevenueAmount - lastYearRevenueAmount) / lastYearRevenueAmount) * 100;
      } else if (currentYearRevenueAmount !== 0) {
        percentageChange = 100; // Assume a 100% increase if last year's revenue is zero but current year's revenue is not zero
      }
  
      // Format the comparison result
      const comparisonResult = Number(percentageChange.toFixed(2));
  
      res.json({
        currentYearRevenue: currentYearRevenueAmount,
        lastYearRevenue: lastYearRevenueAmount,
        comparison: comparisonResult,
      });
    } catch (error) {
      console.error('Error calculating total revenue:', error);
      res.status(500).json({ error: 'Error calculating total revenue' });
    }
  };
  


const getOrderCountsByDayOfWeek = async (req, res) => {
  try {
    const ordersByDayOfWeek = await Order.aggregate([
      {
        $match: {
          createdAt: { $exists: true }, // Ensure there is a createdAt field for date filtering
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: { date: '$createdAt', timezone: 'America/New_York' } }, // Adjust timezone as per your application needs
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id': 1 } // Sort by day of the week, where 1 is Sunday, 2 is Monday, ..., 7 is Saturday
      }
    ]);

    // Initialize arrays to store orders and days of the week
    const orders = new Array(7).fill(0);
    const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    // Map the aggregation results to the correct day of the week
    ordersByDayOfWeek.forEach((result) => {
      const dayIndex = result._id - 1; // MongoDB $dayOfWeek returns 1 for Sunday, so adjust index
      orders[dayIndex] = result.count;
    });

    res.json({ ordersByDay: orders, daysOfWeek });
  } catch (error) {
    console.error('Error fetching order counts by day of week:', error);
    res.status(500).json({ error: 'Error fetching order counts by day of week' });
  }
};

const getOrderCountsByMonth = async (req, res) => {
  try {
    const ordersByMonth = await Order.aggregate([
      {
        $match: {
          createdAt: { $exists: true }, // Ensure there is a createdAt field for date filtering
        },
      },
      {
        $group: {
          _id: { $month: { date: '$createdAt', timezone: 'America/New_York' } }, // Adjust timezone as per your application needs
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id': 1 } // Sort by month number
      }
    ]);

    // Initialize arrays to store orders and months
    const orders = new Array(12).fill(0);
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    // Map the aggregation results to the correct month index
    ordersByMonth.forEach((result) => {
      const monthIndex = result._id - 1; // MongoDB $month returns 1 for January, so adjust index
      orders[monthIndex] = result.count;
    });

    res.json({ ordersByMonth: orders, months });
  } catch (error) {
    console.error('Error fetching order counts by month:', error);
    res.status(500).json({ error: 'Error fetching order counts by month' });
  }
};

const getSalesRevenueByMonth = async (req, res) => {
  try {
    const salesByMonth = await Order.aggregate([
      {
        $match: {
          createdAt: { $exists: true }, // Ensure there is a createdAt field for date filtering
          paymentStatus: 'succeeded' // Filter only orders with successful payment status
        },
      },
      {
        $group: {
          _id: { $month: { date: '$createdAt', timezone: 'America/New_York' } }, // Adjust timezone as per your application needs
          totalSales: { $sum: '$totalPrice' },
        },
      },
      {
        $sort: { '_id': 1 } // Sort by month number
      }
    ]);

    // Initialize arrays to store sales and months
    const sales = new Array(12).fill(0);
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    // Map the aggregation results to the correct month index
    salesByMonth.forEach((result) => {
      const monthIndex = result._id - 1; // MongoDB $month returns 1 for January, so adjust index
      sales[monthIndex] = result.totalSales;
    });

    res.json({ salesByMonth: sales, months });
  } catch (error) {
    console.error('Error fetching sales revenue by month:', error);
    res.status(500).json({ error: 'Error fetching sales revenue by month' });
  }
};


module.exports = {
  // getOrderHistoryForClient,
  placeOrder,
  // getOrderStatus,
  // getOrderDetails,
  // getAllOrders,
  updateOrderStatus,
  fetchPaginatedOrders,
  // getTodayOrdersCountAndCompare,
  getTotalRevenue,
  getTodayAndYesterdayRevenueComparison,
  getTodayAndYesterdayOrderCountComparison,
  getOrderCountsByDayOfWeek,
  getOrderCountsByMonth,
  getSalesRevenueByMonth
};
