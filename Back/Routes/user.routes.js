const express = require('express');
const { deleteSellerProfile } = require('../Controllers/user.controller');
const { checkAuthenticated, requireRole } = require('../middlewares/auth.mw');
const router = express.Router();
// const { deleteSellerProfile } = require('./controllers');

// Add middleware for authentication and role checking
router.delete('/seller/delete', checkAuthenticated, requireRole(['seller']), deleteSellerProfile);

module.exports = router;
