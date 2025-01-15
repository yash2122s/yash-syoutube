const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Video Schema
const videoSchema = new mongoose.Schema({
    title: String,
    description: String,
    filename: String,
    views: { type: Number, default: 0 },
    uploadDate: { type: Date, default: Date.now }
});

const Video = mongoose.model('Video', videoSchema);

// Multer configuration
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit
    }
});

// Routes
app.get('/test', (req, res) => {
    res.json({ message: 'Server is working!' });
});

app.post('/api/upload', upload.single('video'), async (req, res) => {
    try {
        console.log('Upload request received:', req.body);
        
        if (!req.file) {
            throw new Error('No video file uploaded');
        }

        const video = new Video({
            title: req.body.title || 'Untitled',
            description: req.body.description || '',
            filename: req.file.filename
        });

        await video.save();
        console.log('Video saved:', video);

        res.json({ 
            success: true, 
            video,
            message: 'Video uploaded successfully' 
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(400).json({ 
            success: false, 
            error: error.message 
        });
    }
});

app.get('/api/videos', async (req, res) => {
    try {
        const videos = await Video.find().sort({ uploadDate: -1 });
        res.json(videos);
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ error: error.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        error: 'Something broke on the server!' 
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 