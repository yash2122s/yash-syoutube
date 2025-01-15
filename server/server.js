const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());
app.use(express.static('uploads'));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

// Video Schema
const videoSchema = new mongoose.Schema({
    title: String,
    description: String,
    filename: String,
    views: { type: Number, default: 0 },
    uploadDate: { type: Date, default: Date.now }
});

const Video = mongoose.model('Video', videoSchema);

// Multer configuration for video uploads
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function(req, file, cb) {
        if (!file.originalname.match(/\.(mp4|webm)$/)) {
            return cb(new Error('Only video files are allowed!'));
        }
        cb(null, true);
    }
});

// Routes
app.post('/api/upload', upload.single('video'), async (req, res) => {
    try {
        const video = new Video({
            title: req.body.title,
            description: req.body.description,
            filename: req.file.filename
        });
        await video.save();
        res.json({ success: true, video });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

app.get('/api/videos', async (req, res) => {
    try {
        const videos = await Video.find().sort({ uploadDate: -1 });
        res.json(videos);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 