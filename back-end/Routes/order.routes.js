const express = require('express');
const { checkAuthenticated, requireRole } = require('../middlewares/auth.mw');
const {  updateOrderStatus, fetchPaginatedOrders } = require('../Controllers/order.controller');
const { body } = require('express-validator');
const router = express.Router();


router.get('/', fetchPaginatedOrders)
// router.get('/getOrderHistoryForClient/:id', checkAuthenticated, requireRole(['admin']), getOrderHistoryForClient)
// router.get('/getOrderStatus/:id', checkAuthenticated, getOrderStatus)

// router.get('/getOrderDetails/:id', checkAuthenticated, requireRole(['seller']), getOrderDetails)
// router.get('/getAllOrders', checkAuthenticated, requireRole(['admin']), getAllOrders)
router.post('/updateOrderStatus/:id', 
// checkAuthenticated, 
updateOrderStatus )
module.exports = router;
