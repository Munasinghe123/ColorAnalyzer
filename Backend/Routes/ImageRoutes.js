const express = require('express');
const router = express.Router();
const upload = require('../Middleware/upload');
const { analyzeImage, getChemicalAmount } = require('../Controllers/ImageController');

// Route to analyze image and save to DB
router.post('/analyzeImage', upload.single('image'), analyzeImage);

// Route to fetch chemical amount from DB
router.get('/getAmount', getChemicalAmount);

module.exports = router;
