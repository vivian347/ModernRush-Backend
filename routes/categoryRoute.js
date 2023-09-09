const express = require('express');
const { createCategory, updateCategory, deleteCategory, getCategory, getCategories } = require('../controller/categoryCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');


const router = express.Router();

router.post('/', authMiddleware, isAdmin, createCategory)
router.get('/', getCategories)


router.put('/:id', authMiddleware, isAdmin, updateCategory)
router.delete('/:id', authMiddleware, isAdmin, deleteCategory)
router.get('/:id', getCategory)


module.exports = router;