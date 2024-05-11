const Order = require("../Models/order.model");
const Product = require("../Models/product.model");
const User = require("../Models/user.model");
const productController = require("./product.controller");

const placeOrder = async (req, res) => {
    try {
      // Receive order details from the frontend
      const { products } = req.body;
      const userID = req.user.id;
  
      // Validate order details
    //   if (!userId || !products || products.length === 0 || !totalPrice) {
    //     return res.status(400).json({ success: false, message: 'Invalid order details' });
    //   }
  
      // Check if user exists
      const user = await User.findById(userID);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      // Calculate total price of the order based on product prices and quantities
      let totalPrice = 0;
      for (const productItem of products) {
        const product = await Product.findById(productItem.productID);
        if (!product) {
          return res.status(400).json({ success: false, message: `Invalid product ID(product not found) "${productItem.productID}"` });
        }
        // Check if quantity ordered exceeds available stock
        if (productItem.quantity > product.stock) {
          return res.status(400).json({ success: false, message: `Insufficient stock for product "${productItem.productID}"` });
        }
        // Update calculated total price
        totalPrice += product.price * productItem.quantity;
      }
  
      // Check if totalPrice matches calculatedTotalPrice
    //   if (totalPrice !== calculatedTotalPrice) {
    //     return res.status(400).json({ success: false, message: 'Incorrect total price calculation' });
    //   }
  
      // Create a new order document in the database
      const newOrder = new Order({
        userID,
        products,
        totalPrice,
        orderStatus: 'pending', // Default status
        paymentStatus: 'pending' // Default status
      });
  
      // Save the order to the database
      await newOrder.save();
  
      // Update stock levels of the ordered products
      await productController.updateProductStock(products);
  
      // Return success response
      res.status(201).json({ success: true, message: 'Order placed successfully' });
    } catch (error) {
      // Return error response
      res.status(500).json({ success: false, error: error.message });
    }
  };

const getOrderHistoryForClient = async (req, res) => {
  try {
    const userID = req.params.id;

    const orders = await Order.find({ userID });

    return res.status(200).json({ success: true, orders: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getOrderStatus = async (req, res) => {
    try {
      // Retrieve order ID from request
      const orderId = req.params.id;
  
      // Fetch order details
      const order = await Order.findById(orderId);
  
      if(!order){
        return res.json({success:false, error:'order not found or deleted from DB'})
      }
      // Return order status
      res.status(200).json({ success: true, orderStatus: order.orderStatus });
    } catch (error) {
      // Return error response
      res.status(500).json({ success: false, error: error.message });
    }
  };

//   const getOrderDetails = async (req, res) => {
//     try {
//         const orderID = req.params.id;
//         const order = await Order.findById(orderID);
//         if (!order) {
//             return res.status(404).json({ success: false, message: 'Order not found' });
//         }
//         return res.status(200).json({ success: true, order });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// };

const getOrderDetails = async (req, res) => {
    try {
        const orderID = req.params.id;

        // Find the order by ID and populate user and product details
        const order = await Order.findById(orderID)
            .populate('userID', 'name email') // Populate user details (e.g., name, email)
            .populate('products.productID', 'name price'); // Populate product details (e.g., name, price)

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Return the order details with populated user and product information
        return res.status(200).json({ success: true, order });
    } catch (error) {
        // Return error response
        res.status(500).json({ success: false, error: error.message });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        const count = await Order.countDocuments()
        return res.status(200).json({ success: true, orders,count });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const orderID = req.params.id;
        const { newStatus } = req.body;

        const order = await Order.findById(orderID);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Update the order status
        order.orderStatus = newStatus;
        await order.save();

        return res.status(200).json({ success: true, message: 'Order status updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


module.exports = {
  getOrderHistoryForClient,
  placeOrder,
  getOrderStatus,
  getOrderDetails,
  getAllOrders,
  updateOrderStatus
};
