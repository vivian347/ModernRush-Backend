const express = require('express');
const { createUser, loginUserCtrl, getAllUsers, getAUser, deleteAUser, updateaUser, blockUser, unblockUser, handleRefreshToken, logout, updatePassword, forgotPasswordToken, resetPassword, loginAdmin, getWishlist, saveAddress } = require('../controller/userCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', createUser)
router.post('/forgot-password-token', forgotPasswordToken)
router.put('/reset-password/:token', resetPassword)
router.get('/wishlist', authMiddleware, getWishlist)
router.put('/update-password', authMiddleware, updatePassword)
router.post('/login', loginUserCtrl)
router.post('/access', loginAdmin)
router.get('/all-users', getAllUsers)
router.get('/refresh', handleRefreshToken)
router.get('/logout', logout)
router.put('/edit-user', authMiddleware, updateaUser)
router.put('/save-address', authMiddleware, saveAddress)

router.get('/:id', authMiddleware, isAdmin, getAUser)
router.delete('/:id', deleteAUser)
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser)
router.put('/unblock-user/:id', authMiddleware, isAdmin, unblockUser)


module.exports = router;