const Product = require("../Models/product.model");
const User = require("../Models/user.model");
const Order = require("../Models/order.model")

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'oops User not found' });
        }
        console.log("user", user);
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error. Please try again later.' });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ 'user.id': req.params.id });
        if (!orders) {
            return res.status(404).json({ message: 'oops No orders found for this user' });
        }
        console.log("orders", orders);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error. Please try again later.' });
    }
};

const updateUserById = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'oops User not found' });
        }
        console.log("updatedUser", updatedUser);
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error. Please try again later.' });
    }
};

const deleteSellerProfile = async (req, res) => {
    try {
        if (!req.user.id) {
            return res.json({ message: "seller acc doesnt exist" })
        }
        // Get seller ID from the request (it could be retrieved from authentication middleware)
        const sellerID = req.user.id;

        // const user = await User.findById(sellerID)

        // Check if the user has the role 'seller'
        // if (req.user.role !== 'seller') {
        //     return res.status(403).json({ message: 'Forbidden: You do not have permission to delete this account.' });
        // }

        // Delete all products posted by the seller
        await Product.deleteMany({ sellerID });

        // Delete the seller's profile
        await User.findByIdAndDelete({ _id: sellerID });



        // Send a success response
        return res.status(200).json({ message: 'Seller profile and all products deleted successfully.' });
    } catch (error) {
        console.error('Error deleting seller profile:', error);
        return res.status(500).json({ message: 'Internal server error. Please try again later.' });
    }
};


const fetchPaginatedUsers = async (req, res) => {
    const {
        page = 1,
        pageSize = 6,
        filters
    } = req.query;

    try {

        const response = await User.fetchUsers(
            parseInt(page),
            parseInt(pageSize),
            filters
        );
        res.json({ response });
    } catch (error) {

        res.status(500).json({ message: "Server Error" });

    }
}

module.exports = { getUserById, getUserOrders, updateUserById, deleteSellerProfile, fetchPaginatedUsers }