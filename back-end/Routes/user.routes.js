const express = require('express');
const { getUserById, getUserOrders, updateUserById, deleteSellerProfile } = require('../Controllers/user.controller');
const { checkAuthenticated, requireRole } = require('../middlewares/auth.mw');
const router = express.Router();
// const { deleteSellerProfile } = require('./controllers');

// Add middleware for authentication and role checking

//* Get user info by ID
router.get('/:id', getUserById);

//* Get user orders
router.get('/:id/orders', getUserOrders);

//* Update user info
router.put('/:id', updateUserById);

router.delete('/seller/delete', checkAuthenticated, requireRole(['seller']), deleteSellerProfile);

module.exports = router;
