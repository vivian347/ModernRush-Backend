const express = require('express');
const { createProduct, getaProduct, getAllProducts, updateProduct, deleteProduct } = require('../controller/productCtrl');
const { isAdmin, authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, isAdmin, createProduct)
router.get('/all-products', getAllProducts)
router.get('/:id', getaProduct)
router.put('/edit-product/:id', authMiddleware, isAdmin, updateProduct)
router.delete('/:id', authMiddleware, isAdmin, authMiddleware, deleteProduct)

module.exports = router;