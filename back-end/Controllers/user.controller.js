const Product = require("../Models/product.model");
const User = require("../Models/user.model");

const deleteSellerProfile = async (req, res) => {
    try {
        if(!req.user.id){
            return res.json({message: "seller acc doesnt exist"})
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
        await User.findByIdAndDelete({_id:sellerID});


       
        // Send a success response
        return res.status(200).json({ message: 'Seller profile and all products deleted successfully.' });
    } catch (error) {
        console.error('Error deleting seller profile:', error);
        return res.status(500).json({ message: 'Internal server error. Please try again later.' });
    }
};

module.exports = { deleteSellerProfile}