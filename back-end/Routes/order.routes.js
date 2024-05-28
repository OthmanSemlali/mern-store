const express = require('express');
const { checkAuthenticated, requireRole } = require('../middlewares/auth.mw');
const {  updateOrderStatus, fetchPaginatedOrders, getTotalRevenue, getTodayAndYesterdayRevenueComparison, getTodayAndYesterdayOrderCountComparison, getOrderCountsByDayOfWeek, getOrderCountsByMonth, getSalesRevenueByMonth } = require('../Controllers/order.controller');
const { body } = require('express-validator');
const router = express.Router();


router.get('/', fetchPaginatedOrders)
// router.get('/getTodayOrdersCountAndCompare', getTodayOrdersCountAndCompare)
router.get('/getTodayAndYesterdayRevenueComparison', getTodayAndYesterdayRevenueComparison)
router.get('/getTodayAndYesterdayOrderCountComparison', getTodayAndYesterdayOrderCountComparison)
router.get('/getOrderCountsByDayOfWeek', getOrderCountsByDayOfWeek)
router.get('/getOrderCountsByMonth', getOrderCountsByMonth)
router.get('/getSalesRevenueByMonth', getSalesRevenueByMonth)

router.get('/getTotalRevenue', getTotalRevenue)
// router.get('/getOrderHistoryForClient/:id', checkAuthenticated, requireRole(['admin']), getOrderHistoryForClient)
// router.get('/getOrderStatus/:id', checkAuthenticated, getOrderStatus)

// router.get('/getOrderDetails/:id', checkAuthenticated, requireRole(['seller']), getOrderDetails)
// router.get('/getAllOrders', checkAuthenticated, requireRole(['admin']), getAllOrders)
router.post('/updateOrderStatus/:id', 
// checkAuthenticated, 
updateOrderStatus )
module.exports = router;
