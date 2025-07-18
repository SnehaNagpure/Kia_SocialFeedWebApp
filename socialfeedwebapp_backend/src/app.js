
require('dotenv').config();
console.log('All env vars:', process.env);
const express = require('express');

const mongoose = require('mongoose');
const mongoUri = process.env.MONGO_URI;
//console.log('Mongo URI:', mongoUri);  
// if (!mongoUri) {
//   console.error('MongoDB connection string is missing! Check your .env file');
//   process.exit(1);
// }
const cors = require('cors');


const userRoutes = require('./Routes/userRoutes');
const postRoutes = require('./Routes/postRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve media files statically
//app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection

mongoose.connect('mongodb://localhost:27017/socialfeedwebapp', {
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
