
require('dotenv').config();
console.log('All env vars:', process.env);
const express = require('express');
const path = require('path');

const mongoose = require('mongoose');
const mongoUri = process.env.MONGO_URI;

const cors = require('cors');


const userRoutes = require('./Routes/userRoutes');
const postRoutes = require('./Routes/postRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
<<<<<<< HEAD
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads')); // Serve media files statically
//app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

=======
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
>>>>>>> origin/main
// MongoDB connection

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// API routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
