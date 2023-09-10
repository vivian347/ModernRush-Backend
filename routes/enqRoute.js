const express = require('express');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { createEnquiry, getEnquirys, updateEnquiry, deleteEnquiry, getEnquiry } = require('../controller/enqCtrl');


const router = express.Router();

router.post('/', authMiddleware, isAdmin, createEnquiry)
router.get('/', getEnquirys)


router.put('/:id', authMiddleware, isAdmin, updateEnquiry)
router.delete('/:id', authMiddleware, isAdmin, deleteEnquiry)
router.get('/:id', getEnquiry)


module.exports = router;