const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path')
const imageRoutes = require('./Routes/ImageRoutes')

const app = express();

//middleware
app.use(cors());
app.use(express.json());

//routes
app.use('/api/images/', imageRoutes)

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
mongoose
    .connect(`mongodb+srv://jaya:color@color.rscj8.mongodb.net/`)
    .then(() => console.log('Database connected'))
    .catch((err) => {
        console.error('Database connection failed:', err.message);
        process.exit(1);
    });

// Start the Server
const PORT = 7001
app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));




//mongodb+srv://jaya:color@color.rscj8.mongodb.net/

//jaya //color