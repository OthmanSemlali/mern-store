const express = require('express');
const { checkAuthenticated, requireRole } = require('../middlewares/auth.mw');
const { placeOrder, getOrderHistoryForClient, getOrderStatus, getOrderDetails, getAllOrders, updateOrderStatus } = require('../Controllers/order.controller');
const { body } = require('express-validator');
const router = express.Router();

router.post('/placeOrder', checkAuthenticated, requireRole(['user']),[
    body('products').notEmpty().isArray(),
    body('products.*.productID').notEmpty(),
    body('products.*.quantity').notEmpty().isNumeric()
    .custom((value) => quantity !== 0).withMessage('Quantity must not be equal to 0'),
], placeOrder);
router.get('/getOrderHistoryForClient/:id', checkAuthenticated, requireRole(['admin']), getOrderHistoryForClient)
router.get('/getOrderStatus/:id', checkAuthenticated, getOrderStatus)

router.get('/getOrderDetails/:id', checkAuthenticated, requireRole(['seller']), getOrderDetails)
router.get('/getAllOrders', checkAuthenticated, requireRole(['admin']), getAllOrders)
router.post('/updateOrderStatus/:id', checkAuthenticated, requireRole(['seller']), updateOrderStatus )
module.exports = router;
