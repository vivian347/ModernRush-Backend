const Color = require('../models/colorModel');
const asyncHandler = require('express-async-handler');
const { validateMongodbId } = require('../utils/validatemongodbId');

// @desc    Create a category
const createColor = asyncHandler(async (req, res) => {
    try {
        const newColor = await Color.create(req.body);
        res.status(201).json({ newColor });
    } catch (error) {
        throw new Error(error);
    }
});

// @desc    Get all categories
const getColors = asyncHandler(async (req, res) => {
    try {
        const getColors = await Color.find();
        res.json({ getColors });
    } catch (error) {
        throw new Error(error);
    }
});

// @desc    Get a category by id
const getColor = asyncHandler(async (req, res) => {
    const id = req.params.id;
    validateMongodbId(id);
    try {
        const getColor = await Color.findById(id);
        res.json({ getColor });
    } catch (error) {
        throw new Error(error);
    }
});



// @desc    Update a category
const updateColor = asyncHandler(async (req, res) => {
    const id = req.params.id;
    validateMongodbId(id);
    try {
        const updateColor = await Color.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ updateColor });
    } catch (error) {
        throw new Error(error);
    }
});

// @desc    Delete a category
const deleteColor = asyncHandler(async (req, res) => {
    const id = req.params.id;
    validateMongodbId(id);
    try {
        const deletedColor = await Color.findByIdAndDelete(id);
        res.json({ deletedColor });
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = { createColor, updateColor, deleteColor, getColor, getColors };