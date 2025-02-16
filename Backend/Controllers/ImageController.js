const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const Image = require('../Models/ImageModel');
const crypto = require('crypto');


const calculateImageHash = (filePath) => {
    const imageBuffer = fs.readFileSync(filePath);
    return crypto.createHash('sha256').update(imageBuffer).digest('hex');
};


const analyzeImage = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const imagePath = req.file.path;

    try {
        
        const imageHash = calculateImageHash(imagePath);

      
        const existingImage = await Image.findOne({ imageHash });

        if (existingImage) {
            return res.status(200).json({
                message: 'Image already analyzed',
                chemicalAmount: existingImage.chemicalAmount,
                imageUrl: existingImage.imageUrl,
            });
        }

     
        const metadata = await sharp(imagePath).resize(100, 100).toBuffer();
        const { r, g, b } = await sharp(metadata).raw().toBuffer().then((data) => {
            const avgRed = data[0];
            const avgGreen = data[1];
            const avgBlue = data[2];

          
            return { r: avgRed, g: avgGreen, b: avgBlue };
        });

       
        const avgColor = (r + g + b) / 3;
        const chemicalAmount = Math.floor((avgColor / 255) * 100); 

       
        const newImage = new Image({
            imageUrl: `/uploads/${req.file.filename}`,
            chemicalAmount: chemicalAmount,
            imageHash: imageHash, 
        });

       
        await newImage.save();

       
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


const getChemicalAmount = async (req, res) => {
    try {
        const image = await Image.findOne().sort({ _id: -1 }); 

        if (!image) {
            return res.status(404).json({ error: 'No image found' });
        }

       
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
