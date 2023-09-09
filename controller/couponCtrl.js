const Coupon = require('../models/couponModel');
const validateMongodbId = require('../utils/validatemongodbId');
const asyncHandler = require('express-async-handler');

const createCoupon = asyncHandler(async (req, res) => {
    try {
        const newCoupon = await Coupon.create(req.body);
        res.json({ newCoupon })
    } catch (error) {
        throw new Error(error);
    }
});

const getallcoupons = asyncHandler(async (req, res) => {
    try {
        const coupons = await Coupon.find();
        res.json({ coupons })
    } catch (error) {
        throw new Error(error);
    }
});

const getCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const coupon = await Coupon.findById(id);
        res.json(coupon)
    } catch (error) {
        throw new Error(error);
    }
});

const updateCoupon = asyncHandler(async (req, res) => {
    const id = req.params.id;
    console.log(id);
    try {
        const updateCoupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ updateCoupon });
    } catch (error) {
        throw new Error(error);
    }
});

const deleteCoupon = asyncHandler(async (req, res) => {
    const id = req.params.id;
    console.log(id);
    try {
        const deleteCoupon = await Coupon.findByIdAndDelete(id);
        res.json({ message: 'Coupon deleted successfully' });
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = { createCoupon, getallcoupons, getCoupon, updateCoupon, deleteCoupon };