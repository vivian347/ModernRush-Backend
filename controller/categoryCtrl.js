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

// @desc    Get a category by id

// @desc    Update a category
const updateCategory = asyncHandler(async (req, res) => {
    const id = req.params.id;
    try {
        console.log('Updating category with ID:', id);
        console.log('Request Body:', req.body);

        const updateCategory = await Category.findByIdAndUpdate(id, req.body, { new: true });

        console.log('Updated Category:', updateCategory);
        res.json({ updateCategory });

    } catch (error) {
        throw new Error(error);
    }
});

// @desc    Delete a category

module.exports = { createCategory, updateCategory };