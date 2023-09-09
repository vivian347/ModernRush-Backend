const Category = require('../models/categoryModel');
const asyncHandler = require('express-async-handler');
const { validateMongodbId } = require('../utils/validatemongodbId');

// @desc    Create a category
const createCategory = asyncHandler(async (req, res) => {
    try {
        const newCategory = await Category.create(req.body);
        res.status(201).json({ newCategory });
    } catch (error) {
        throw new Error(error);
    }
});

// @desc    Get all categories
const getCategories = asyncHandler(async (req, res) => {
    try {
        const getCategories = await Category.find();
        res.json({ getCategories });
    } catch (error) {
        throw new Error(error);
    }
});

// @desc    Get a category by id
const getCategory = asyncHandler(async (req, res) => {
    const id = req.params.id;
    validateMongodbId(id);
    try {
        const getCategory = await Category.findById(id);
        res.json({ getCategory });
    } catch (error) {
        throw new Error(error);
    }
});



// @desc    Update a category
const updateCategory = asyncHandler(async (req, res) => {
    const id = req.params.id;
    validateMongodbId(id);
    try {
        const updateCategory = await Category.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ updateCategory });
    } catch (error) {
        throw new Error(error);
    }
});

// @desc    Delete a category
const deleteCategory = asyncHandler(async (req, res) => {
    const id = req.params.id;
    validateMongodbId(id);
    try {
        const deletedCategory = await Category.findByIdAndDelete(id);
        res.json({ deletedCategory });
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = { createCategory, updateCategory, deleteCategory, getCategory, getCategories };