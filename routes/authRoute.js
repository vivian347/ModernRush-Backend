const express = require('express');
const { createUser, loginUserCtrl, getAllUsers, getAUser, deleteAUser, updateaUser, blockUser, unblockUser, handleRefreshToken, logout, updatePassword, forgotPasswordToken, resetPassword, loginAdmin, getWishlist, saveAddress, userCart, getUserCart, emptyCart, applyCoupon, createOrder, getOrders, updateOrderStatus } = require('../controller/userCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', createUser)
router.post('/forgot-password-token', forgotPasswordToken)
router.put('/reset-password/:token', resetPassword)
router.get('/wishlist', authMiddleware, getWishlist)
router.put('/update-password', authMiddleware, updatePassword)
router.post('/login', loginUserCtrl)
router.post('/access', loginAdmin)
router.post('/cart', authMiddleware, userCart)
router.get('/get-cart', authMiddleware, getUserCart)
router.delete('/empty-cart', authMiddleware, emptyCart)
router.get('/all-users', getAllUsers)
router.get('/refresh', handleRefreshToken)
router.get('/logout', logout)
router.put('/edit-user', authMiddleware, updateaUser)
router.put('/save-address', authMiddleware, saveAddress)
router.post('/cart/apply-coupon', authMiddleware, applyCoupon)
router.post('/cart/create-order', authMiddleware, createOrder)
router.get('/get-orders', authMiddleware, getOrders)

router.put('/order/update-order/:id', authMiddleware, isAdmin, updateOrderStatus)
router.get('/:id', authMiddleware, isAdmin, getAUser)
router.delete('/:id', deleteAUser)
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser)
router.put('/unblock-user/:id', authMiddleware, isAdmin, unblockUser)

module.exports = router;