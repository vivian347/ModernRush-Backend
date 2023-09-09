const express = require('express');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { createBrand, getBrands, updateBrand, deleteBrand, getBrand } = require('../controller/brandCtrl');


const router = express.Router();

router.post('/', authMiddleware, isAdmin, createBrand)
router.get('/', getBrands)


router.put('/:id', authMiddleware, isAdmin, updateBrand)
router.delete('/:id', authMiddleware, isAdmin, deleteBrand)
router.get('/:id', getBrand)


module.exports = router;