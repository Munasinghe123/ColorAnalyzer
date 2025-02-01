const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const Image = require('../Models/ImageModel');
const crypto = require('crypto');

// Function to calculate image hash
const calculateImageHash = (filePath) => {
    const imageBuffer = fs.readFileSync(filePath);
    return crypto.createHash('sha256').update(imageBuffer).digest('hex');
};

// Function to analyze the image and calculate chemical amount
const analyzeImage = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const imagePath = req.file.path;

    try {
        // Generate hash from the uploaded image to check if it's already in the DB
        const imageHash = calculateImageHash(imagePath);

        // Check if image with the same hash already exists in DB
        const existingImage = await Image.findOne({ imageHash });

        if (existingImage) {
            return res.status(200).json({
                message: 'Image already analyzed',
                chemicalAmount: existingImage.chemicalAmount,
                imageUrl: existingImage.imageUrl,
            });
        }

        // Use sharp to get the average color of the image
        const metadata = await sharp(imagePath).resize(100, 100).toBuffer();
        const { r, g, b } = await sharp(metadata).raw().toBuffer().then((data) => {
            const avgRed = data[0];
            const avgGreen = data[1];
            const avgBlue = data[2];

            // Return the average RGB color values
            return { r: avgRed, g: avgGreen, b: avgBlue };
        });

        // Calculate a "chemical amount" from the average color values
        const avgColor = (r + g + b) / 3;
        const chemicalAmount = Math.floor((avgColor / 255) * 100); // Normalize to 0-100 range

        // Save image info to the database
        const newImage = new Image({
            imageUrl: `/uploads/${req.file.filename}`,
            chemicalAmount: chemicalAmount,
            imageHash: imageHash,  // Save the hash of the image for future reference
        });

        // Save to MongoDB
        await newImage.save();

        // Respond with the chemical amount and image URL
        res.status(200).json({
            message: 'Image analyzed and saved successfully',
            chemicalAmount: chemicalAmount,
            imageUrl: newImage.imageUrl,
        });
    } catch (err) {
        console.error('Error analyzing image:', err);
        res.status(500).json({ error: 'Failed to analyze image' });
    }
};

// Function to fetch chemical amount from DB
const getChemicalAmount = async (req, res) => {
    try {
        const image = await Image.findOne().sort({ _id: -1 }); // Fetch the latest image (or adjust based on your needs)

        if (!image) {
            return res.status(404).json({ error: 'No image found' });
        }

        // Respond with the chemical amount and image URL
        res.status(200).json({
            chemicalAmount: image.chemicalAmount,
            imageUrl: image.imageUrl,
        });
    } catch (err) {
        console.error('Error fetching chemical amount:', err);
        res.status(500).json({ error: 'Failed to fetch chemical amount' });
    }
};


module.exports = { analyzeImage, getChemicalAmount };
