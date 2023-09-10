const { generateToken } = require('../config/jwtToken');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const Coupon = require('../models/couponModel');
const Order = require('../models/orderModel');
const asyncHandler = require('express-async-handler');
const { validateMongodbId } = require('../utils/validatemongodbId');
const { generateRefreshToken } = require('../config/refreshToken');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const uniqid = require('uniqid');
const { sendMail } = require('./emailCtrl');

//create user
const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({ email: email });

    if (!findUser) {
        const newUser = await User.create(req.body);
        res.json(newUser);

    } else {
        throw new Error('User already exists');
    }
});

// login user
const loginUserCtrl = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // find user in db
    const findUser = await User.findOne({ email: email });
    if (findUser && await findUser.isPasswordMatched(password)) {
        const refreshToken = await generateRefreshToken(findUser?._id);
        const updateUser = await User.findByIdAndUpdate(
            findUser.id,
            {
                refreshToken: refreshToken,
            },
            {
                new: true,
            }
        )
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 10 * 24 * 60 * 60 * 1000,
        });
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id)

        });
    } else {
        throw new Error('Invalid email or password');
    }
})

// login admin
const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // find user in db
    const findAdmin = await User.findOne({ email: email });
    if (findAdmin.role !== 'admin') throw new Error('You are not admin')
    if (findAdmin && await findAdmin.isPasswordMatched(password)) {
        const refreshToken = await generateRefreshToken(findAdmin?._id);
        const updateAdmin = await User.findByIdAndUpdate(
            findAdmin.id,
            {
                refreshToken: refreshToken,
            },
            {
                new: true,
            }
        )
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 10 * 24 * 60 * 60 * 1000,
        });
        res.json({
            _id: findAdmin?._id,
            firstname: findAdmin?.firstname,
            lastname: findAdmin?.lastname,
            email: findAdmin?.email,
            mobile: findAdmin?.mobile,
            token: generateToken(findAdmin?._id)

        });
    } else {
        throw new Error('Invalid email or password');
    }
})

// handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) {
        throw new Error('No refresh token');
    }
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken })
    if (!user) throw new Error('No user found');
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || user.id !== decoded.id) {
            throw new Error('Invalid refresh token');
        }
        const accessToken = generateToken(user?._id);
        res.json({ accessToken })

    })
});

//logout
const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) {
        throw new Error('No refresh token');
    }
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken })
    if (!user) {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(204);

    }
    await User.findOneAndUpdate({ refreshToken }, { refreshToken: '' });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
    });
    return res.sendStatus(204);
});

// update a user
const updateaUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongodbId(_id);

    try {
        const updateaUser = await User.findByIdAndUpdate(_id, {
            firstname: req?.body.firstname,
            lastname: req?.body.lastname,
            email: req?.body.email,
            mobile: req?.body.mobile,
        }, { new: true });
        res.json({ updateaUser });
    } catch (error) {
        throw new Error('Error in updating user');
    }
})

// save user address
const saveAddress = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    validateMongodbId(_id);

    try {
        const updateaUser = await User.findByIdAndUpdate(_id, {
            address: req?.body.address,
        }, { new: true });
        res.json({ updateaUser });
    } catch (error) {
        throw new Error('Error in updating user');
    }
})

// get all users
const getAllUsers = asyncHandler(async (req, res) => {
    try {
        getUsers = await User.find()
        res.json({ getUsers })
    } catch (error) {
        throw new Error('Error in getting users');
    }
});

//get single user
const getAUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);

    try {
        const getUser = await User.findById(id);
        res.json({ getUser });
    } catch (error) {
        throw new Error('Error in getting user');
    }
})

//delete single user
const deleteAUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);

    try {
        const deleteaUser = await User.findByIdAndDelete(id);
        res.json({ deleteaUser });
    } catch (error) {
        throw new Error('Error in getting user');
    }
})

const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);

    try {
        const block = await User.findByIdAndUpdate(id, { isBlocked: true }, { new: true });
        res.json(block)
    } catch (error) {
        throw new Error('Error in blocking user');
    }
});

const unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);

    try {
        const unblock = await User.findByIdAndUpdate(id, { isBlocked: false }, { new: true });
        res.json({
            unblock,
            message: "User unblocked successfully"
        })
    } catch (error) {
        throw new Error('Error in unblocking user');
    }
});

const updatePassword = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const password = req.body.password;
    validateMongodbId(_id);
    const user = await User.findById(_id);
    if (password) {
        user.password = password;
        const updatedPassword = await user.save();
        res.json(updatedPassword)
    } else {
        res.json(user)
    }
})

const forgotPasswordToken = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');
    try {
        const token = await user.createPasswordResetToken();
        await user.save();
        const resetUrl = `Hi, Please follow this link to reset your password. The link is available for 30 minutes only. <a href="http://localhost:4000/api/user/reset-password/${token}">Reset Password</a>`;
        const data = {
            to: email,
            subject: 'Reset Password',
            text: "Hey User",
            html: resetUrl,
        }
        sendMail(data);
        res.json({ token });
    } catch (error) {
        throw new Error(error);
    }
});

const resetPassword = asyncHandler(async (req, res) => {
    const password = req.body.password;
    const token = req.params.token;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });
    if (!user) throw new Error('Token is invalid or has expired');
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json({ user, message: "Password reset successfully" });
});

const getWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    console.log(req.user)
    validateMongodbId(_id);
    try {
        const user = await User.findById(_id).populate('wishlist');
        res.json(user.wishlist);
    } catch (error) {
        throw new Error(error);
    }

});

const userCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { cart } = req.body;
    validateMongodbId(_id);
    try {
        let products = [];
        const user = await User.findById(_id);
        const cartExists = await Cart.findOne({ orderby: user._id });
        if (cartExists) {
            cartExists.remove();
        }
        for (let i = 0; i < cart.length; i++) {
            let object = {};
            object.product = cart[i]._id;
            object.count = cart[i].count;
            object.color = cart[i].color;
            let getPrice = await Product.findById(cart[i]._id).select('price').exec();
            object.price = getPrice.price;
            products.push(object);
        }
        let cartTotal = 0;
        for (let i = 0; i < products.length; i++) {
            cartTotal = cartTotal + products[i].price * products[i].count;
        }
        let newCart = await new Cart({
            products,
            cartTotal,
            orderby: user._id,
        }).save();
        res.json(newCart);
    } catch (error) {
        throw new Error(error);
    }
});

const getUserCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongodbId(_id);
    try {
        const cart = await Cart.findOne({ orderby: _id }).populate('products.product', '_id title price totalAfterDiscount');
        res.json(cart);
    } catch (error) {
        throw new Error(error);
    }
});

const emptyCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongodbId(_id);
    try {
        const cart = await Cart.findOneAndRemove({ orderby: _id });
        res.json(cart);
    } catch (error) {
        throw new Error(error);
    }
});

const applyCoupon = asyncHandler(async (req, res) => {
    const { coupon } = req.body;
    const validCoupon = await Coupon.findOne({ name: coupon });
    const { _id } = req.user;
    validateMongodbId(_id);

    if (validCoupon === null) {
        throw new Error('Invalid coupon');
    }
    const user = await User.findById(_id);
    let { cartTotal } = await Cart.findOne({ orderby: user._id }).populate('products.product');
    let totalAfterDiscount = (cartTotal - (cartTotal * validCoupon.discount) / 100).toFixed(2);
    await Cart.findOneAndUpdate({ orderby: user._id }, { totalAfterDiscount }, { new: true });
    res.json(totalAfterDiscount);
});

const createOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongodbId(_id);
    const { COD, couponApplied } = req.body;
    try {
        // TODO: Integrate mpesa and paypal payment
        if (!COD) throw new Error('Please select payment method');
        const user = await User.findById(_id);
        let userCart = await Cart.findOne({ orderby: user._id });
        let finalAmount = 0;
        if (couponApplied && userCart.totalAfterDiscount) {
            finalAmount = userCart.totalAfterDiscount;
        } else {
            finalAmount = userCart.cartTotal;
        }

        let newOrder = await new Order({
            products: userCart.products,
            paymentIntent: {
                id: uniqid(),
                method: "COD",
                amount: finalAmount,
                status: "Cash On Delivery",
                created: Date.now(),
                currency: "usd",
            },
            orderby: user._id,
            orderStatus: "Processing",
        }).save()
        let update = userCart.products.map((item) => {
            return {
                updateOne: {
                    filter: { _id: item.product._id },
                    update: { $inc: { quantity: -item.count, sold: +item.count } },
                }
            }
        });
        const updated = await Product.bulkWrite(update, {})
        res.json({ message: "success" })
    } catch (error) {
        throw new Error(error);
    }
});

const getOrders = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongodbId(_id);
    try {
        const userOrders = await Order.findOne({ orderby: _id }).populate('products.product');
        res.json(userOrders);
    } catch (error) {
        throw new Error(error);
    }
})

const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const updateOrderStatus = await Order.findByIdAndUpdate(id, {
            orderStatus: status, paymentIntent: {
                status: status,
            }
        }, { new: true });
        res.json(updateOrderStatus);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = { createUser, loginUserCtrl, loginAdmin, getAllUsers, getAUser, deleteAUser, updateaUser, blockUser, unblockUser, handleRefreshToken, logout, updatePassword, forgotPasswordToken, resetPassword, getWishlist, saveAddress, userCart, getUserCart, emptyCart, applyCoupon, createOrder, getOrders, updateOrderStatus };