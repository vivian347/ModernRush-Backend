const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;
    if (req?.headers?.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        try {
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decoded?.id);
                req.user = user;
                next();
            }
        } catch (error) {
            throw new Error('Not authorized, token expired. Please Login again');
        }
    } else {
        throw new Error('Not authorized, no token');
    }
});

const isAdmin = asyncHandler(async (req, res, next) => {
    const email = req?.user?.email;
    const adminUser = await User.findOne({ email: email });

    if (adminUser.role === 'admin') {
        next();
    } else {
        throw new Error('Not authorized as an admin');
    }
})

module.exports = { authMiddleware, isAdmin };