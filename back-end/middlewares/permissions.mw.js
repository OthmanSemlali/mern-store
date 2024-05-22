const { ObjectId } = require("bson");
const productController = require("../Controllers/product.controller");
const Product = require("../Models/product.model");
const { default: mongoose } = require("mongoose");

const verifyOwnership = async (req, res, next) => {
    try {
        const productId = req.params.id;

        console.log('req.params.id(productId) ', req.params.id)
        const product = await Product.fetchProductById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        console.log('pro found for update****')
        console.log('product.sellerID', product.sellerID)
        console.log('req.user.id', req.user.id)
        if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        if (product.sellerID.toString() !== req.user.id) {
            return res.status(403).json({ error: 'You are not authorized to manage this product' });
        }
        // if (product.sellerID !== new ObjectId(req.user.id)) {
        //     return res.status(403).json({ error: 'You are not authorized to manage this product' });
        // }

        next();
    } catch (error) {
        console.error('Error verifying ownership:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { verifyOwnership }