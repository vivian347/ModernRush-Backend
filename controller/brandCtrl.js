const Brand = require('../models/brandModel');
const asyncHandler = require('express-async-handler');
const { validateMongodbId } = require('../utils/validatemongodbId');

// @desc    Create a category
const createBrand = asyncHandler(async (req, res) => {
    try {
        const newBrand = await Brand.create(req.body);
        res.status(201).json({ newBrand });
    } catch (error) {
        throw new Error(error);
    }
});

// @desc    Get all categories
const getBrands = asyncHandler(async (req, res) => {
    try {
        const getBrands = await Brand.find();
        res.json({ getBrands });
    } catch (error) {
        throw new Error(error);
    }
});

// @desc    Get a category by id
const getBrand = asyncHandler(async (req, res) => {
    const id = req.params.id;
    validateMongodbId(id);
    try {
        const getBrand = await Brand.findById(id);
        res.json({ getBrand });
    } catch (error) {
        throw new Error(error);
    }
});



// @desc    Update a category
const updateBrand = asyncHandler(async (req, res) => {
    const id = req.params.id;
    validateMongodbId(id);
    try {
        const updateBrand = await Brand.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ updateBrand });
    } catch (error) {
        throw new Error(error);
    }
});

// @desc    Delete a categor
const deleteBrand = asyncHandler(async (req, res) => {
    const id = req.params.id;
    validateMongodbId(id);
    try {
        const deletedBrand = await Brand.findByIdAndDelete(id);
        res.json({ deletedBrand });
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = { createBrand, updateBrand, deleteBrand, getBrand, getBrands };