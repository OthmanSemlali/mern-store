// const verifyOwnership = async (req, res, next) => {
//     try {
//         const productId = req.params.productId;

//         const product = await Product.findById(productId);

//         if (!product) {
//             return res.status(404).json({ error: 'Product not found' });
//         }

//         if (product.userId !== req.user.id) {
//             return res.status(403).json({ error: 'You are not authorized to manage this product' });
//         }

//         next();
//     } catch (error) {
//         console.error('Error verifying ownership:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };