const express = require("express");
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const translationMiddleware = require('./middleware/translationMiddleware');
const net = require('net');
const http = require('http');
const fileUpload = require('express-fileupload');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 9999;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(translationMiddleware);
app.use(express.static('public'));
app.use(fileUpload());
app.use('/ckeditor', express.static(path.join(__dirname, 'node_modules/@ckeditor')));
app.use(express.static(path.join(__dirname, 'public')));

// Debug middleware - log all requests
app.use((req, res, next) => {
    console.log('\n🔍 Request received:');
    console.log('URL:', req.url);
    console.log('Method:', req.method);
    console.log('Body:', req.body);
    next();
});

// Test route
app.get('/test', (req, res) => {
    res.json({ message: 'Test route works!' });
});

// Mount FAQ routes
const faqRoutes = require('./routes/faqRoutes');
app.use('/api/faqs', faqRoutes);

// Admin routes
const adminRouter = require('./routes/admin');
app.use('/admin', adminRouter);

// Health check endpoint
app.get("/", (req, res) => {
    res.send("Welcome to the Bharat FAQs API");
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Handle 404 routes
app.use((req, res) => {
    console.log('404 Not Found:', req.method, req.originalUrl);
    res.status(404).json({ 
        message: 'Route not found',
        requestedPath: req.originalUrl
    });
});

// Create HTTP server
const server = http.createServer(app);

// Function to start server
const startServer = () => {
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

    server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
            console.log(`Port ${PORT} is busy. Trying ${PORT + 1}`);
            setTimeout(() => {
                server.close();
                server.listen(PORT + 1);
            }, 1000);
        } else {
            console.error('Server error:', error);
        }
    });
};

// Connect to MongoDB with correct options
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
    startServer();
})
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// Handle process termination
process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

// Graceful shutdown handling
process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(() => {
        mongoose.connection.close(false, () => {
            console.log('MongoDB connection closed.');
            process.exit(0);
        });
    });
});

// Handling uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    process.exit(1);
});


