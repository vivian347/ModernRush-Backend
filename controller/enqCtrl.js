const Enquiry = require('../models/enqModel');
const asyncHandler = require('express-async-handler');
const { validateMongodbId } = require('../utils/validatemongodbId');

// @desc    Create a category
const createEnquiry = asyncHandler(async (req, res) => {
    try {
        const newEnquiry = await Enquiry.create(req.body);
        res.status(201).json({ newEnquiry });
    } catch (error) {
        throw new Error(error);
    }
});

// @desc    Get all categories
const getEnquirys = asyncHandler(async (req, res) => {
    try {
        const getEnquirys = await Enquiry.find();
        res.json({ getEnquirys });
    } catch (error) {
        throw new Error(error);
    }
});

// @desc    Get a category by id
const getEnquiry = asyncHandler(async (req, res) => {
    const id = req.params.id;
    validateMongodbId(id);
    try {
        const getEnquiry = await Enquiry.findById(id);
        res.json({ getEnquiry });
    } catch (error) {
        throw new Error(error);
    }
});



// @desc    Update a category
const updateEnquiry = asyncHandler(async (req, res) => {
    const id = req.params.id;
    validateMongodbId(id);
    try {
        const updateEnquiry = await Enquiry.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ updateEnquiry });
    } catch (error) {
        throw new Error(error);
    }
});

// @desc    Delete a category
const deleteEnquiry = asyncHandler(async (req, res) => {
    const id = req.params.id;
    validateMongodbId(id);
    try {
        const deletedEnquiry = await Enquiry.findByIdAndDelete(id);
        res.json({ deletedEnquiry });
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = { createEnquiry, updateEnquiry, deleteEnquiry, getEnquiry, getEnquirys };