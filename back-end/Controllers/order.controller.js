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
    console.log('order response', response)
    res.json({ response });
  } catch (error) {
 
      res.status(500).json({ message: "Server Error" });
    
  }
}

  const placeOrder = async (req, res)=> {

    const {cart, total_amount, shipping} = req.body;

    const products = cart.map(product => {
      const [productId] = product.id.split('-');
      return { ...product, id: productId };
  });

    // console.log('order products', products);
    // console.log('order products', products)
    try {
      const userID = req.user.id;
  
      // Check if user exists
      const user = await User.findById(userID);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      // Create a new order document in the database
      const newOrder = new Order({
        userID,
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
      console.log('add order success')

      res.status(201).json({ success: true, message: 'Order placed successfully' });
    } catch (error) {
      // Return error response
      res.status(500).json({ success: false, error: error.message });
      console.log('add order error', error.message)
    }
  }
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
  updateOrderStatus,
  fetchPaginatedOrders
  
};
