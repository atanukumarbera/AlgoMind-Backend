// server.js - Final Secure Version

// --- This section is updated to reliably find the .env file ---
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env') });

// --- Import required packages ---
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// --- Initialize Express App ---
const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
// Allow requests specifically from your Netlify site
app.use(cors({
  origin: 'https://codeandquill.netlify.app' 
}));
app.use(express.json());

// --- Database Connection ---
// Check if the DATABASE_URL is loaded before trying to connect
if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL is not defined. Please check your .env file name and content.');
    process.exit(1); // Stop the server if the database URL is missing
}

mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log('>>> SUCCESS: MongoDB connected successfully!'))
    .catch(err => console.error('>>> ERROR: MongoDB connection error:', err));

// --- Define the structure (Schema) for a blog post ---
const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    excerpt: { type: String, required: true },
    author: String,
    date: { type: Date, default: Date.now },
    category: String,
    tags: [String],
    imageUrl: String,
    featured: Boolean
});

// --- Create a Model from the Schema ---
const Post = mongoose.model('Post', postSchema);

// --- API Routes (Endpoints) ---
app.get('/api/posts', async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 }); 
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/posts', async (req, res) => {
    const post = new Post(req.body);
    try {
        const newPost = await post.save();
        res.status(201).json(newPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`>>> Server is running on http://localhost:${PORT}`);
});