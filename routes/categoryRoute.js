const express = require('express');
const { createCategory, updateCategory } = require('../controller/categoryCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');


const router = express.Router();

router.post('/', authMiddleware, isAdmin, createCategory)
router.put('/:id', updateCategory)

module.exports = router;