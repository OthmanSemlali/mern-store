//Product routers
const express = require('express');
const { body } = require('express-validator');
const productController = require('../Controllers/product.controller');
const { verifyOwnership } = require('../middlewares/permissions.mw');
const { requireRole, checkAuthenticated } = require('../middlewares/auth.mw');

const router = express.Router();

router.get('/fetchPaginatedProducts/:page/:pageSize', productController.fetchPaginatedProducts);
router.get('/fetchPaginatedProductsByCategory/:categoryName/:page/:pageSize', productController.fetchPaginatedProductsByCategory)
router.get('/fetchPaginatedProductsByPriceRange/:minPrice/:maxPrice/:page/:pageSize', productController.fetchProductsByPriceRange)
router.get('/fetchSingleProductByName/:name', productController.fetchSingleProductByName);
router.get('/fetchSingleProductByID/:id', productController.fetchProductById);

router.get('/getCategoriesWithProductsCounts', productController.getCategoriesWithProductsCounts)
router.get('/getRelatedProducts', productController.getRelatedProducts)
// router.get('/:title', productController.fetchProductById);

// router.get('/search/:title', productController.findByTitle);
router.post('/create', checkAuthenticated, requireRole(['seller']), [
    body('name').notEmpty().withMessage('Name is required').isLength({ min: 5 }).withMessage('name must be alteas 5 chars long').escape(),
    body('description').notEmpty().withMessage('Description is required').escape(),
    body('seoDescription').notEmpty().withMessage('seoDescription is required').escape(),
    body('price').notEmpty(),
    body('stock').notEmpty(),
    body('size').notEmpty(),
    body('options').notEmpty(),
    body('style').notEmpty(),
    body('tileUse').notEmpty(),
    body('materials').notEmpty(),
    body('featured').notEmpty(),
    body('published').notEmpty(),
    
    // body('sellerID').notEmpty(),
    body('categoryID').notEmpty()
], productController.createProduct);

router.delete('/:id',checkAuthenticated, verifyOwnership, productController.deleteProductById);
router.put('/:id', checkAuthenticated, verifyOwnership, [
    body('name').notEmpty().withMessage('Name is required').isLength({ min: 5 }).withMessage('name must be alteas 5 chars long').escape(),
    body('description').notEmpty().withMessage('Description is required').escape(),
    body('seoDescription').notEmpty().withMessage('seoDescription is required').escape(),
    
    // body('categoryID').notEmpty()
], productController.updateProductById);


router.get('/getFeaturedProducts', productController.getFeaturedProducts)
router.post('/toggleProductVisibility/:id', productController.toggleVisibility)
module.exports = router