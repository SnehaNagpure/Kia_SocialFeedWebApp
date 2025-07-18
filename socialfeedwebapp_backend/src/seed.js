// import dotenv from 'dotenv';
// dotenv.config();

// import mongoose from 'mongoose';
// import { faker } from '@faker-js/faker';
// import bcrypt from 'bcrypt';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// import User from '../src/Components/User.js';
// import Post from '../src/Components/Post.js';

// // Setup __dirname for ES module
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Use existing static image folder
// const uploadDir = path.join(__dirname, 'src/Middlewares/uploads');

// const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/socialfeedwebapp';

// mongoose.connect(MONGO_URI)
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.error('MongoDB connection error:', err));

// const createSeedData = async () => {
//   try {
//     await Post.deleteMany();
//     await User.deleteMany();

//     const users = [];

//     // Use existing local profile pictures: profile_0.jpg to profile_3.jpg
//     for (let i = 0; i < 4; i++) {
//       const hashedPassword = await bcrypt.hash('password123', 10);

//       const user = new User({
//         username: faker.internet.userName(),
//         email: faker.internet.email(),
//         password: hashedPassword,
//         age: faker.number.int({ min: 18, max: 40 }),
//         firstName: faker.person.firstName(),
//         lastName: faker.person.lastName(),
//         profilePicture: `uploads/profile_${i}.jpg`, // Static path
//       });

//       await user.save();
//       users.push(user);
//     }

//     // Use existing local post images: post_0.jpg to post_39.jpg (2 per post)
//     for (let i = 0; i < 40; i++) {
//       const randomUser = users[Math.floor(Math.random() * users.length)];

//       const numberOfComments = faker.number.int({ min: 0, max: 5 });
//       const comments = [];

//       for (let j = 0; j < numberOfComments; j++) {
//         const commentUser = users[Math.floor(Math.random() * users.length)];
//         comments.push({
//           user: commentUser._id,
//           text: faker.lorem.sentence(),
//           username: commentUser.username,
//         });
//       }

//       const mediaFiles = [
//         `uploads/post_${i}_1.jpg`,
//         `uploads/post_${i}_2.jpg`
//       ];

//       const post = new Post({
//         title: faker.lorem.sentence(),
//         subtitle: faker.lorem.words(4),
//         description: faker.lorem.paragraph(),
//         rating: faker.number.int({ min: 1, max: 5 }),
//         media: mediaFiles,
//         username: randomUser.username,
//         userId: randomUser._id,
//         likeCount: faker.number.int({ min: 0, max: 200 }),
//         commentCount: comments.length,
//         comments: comments,
//       });

//       await post.save();
//     }

//     console.log('✅ Seed data inserted successfully using static images');
//   } catch (err) {
//     console.error('❌ Seeding failed:', err);
//   } finally {
//     mongoose.connection.close();
//   }
// };

// createSeedData();
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import path from 'path';
import { fileURLToPath } from 'url';

import User from '../src/Components/User.js';
import Post from '../src/Components/Post.js';

// Setup __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Static uploads folder
const uploadDir = path.join(__dirname, 'src/Middlewares/uploads');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/socialfeedwebapp';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const createSeedData = async () => {
  try {
    await Post.deleteMany();
    await User.deleteMany();

    const users = [];

    // Create 4 users with existing profile pics from uploads folder
    for (let i = 0; i < 4; i++) {
      const hashedPassword = await bcrypt.hash('password123', 10);

      const user = new User({
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: hashedPassword,
        age: faker.number.int({ min: 18, max: 40 }),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        profilePicture: `/uploads/profile_${i}.jpg`, // Use relative URL path from your static middleware
      });

      await user.save();
      users.push(user);
    }

    // Create 40 posts with 2 media files each from uploads folder
    for (let i = 0; i < 40; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];

      const numberOfComments = faker.number.int({ min: 0, max: 5 });
      const comments = [];

      for (let j = 0; j < numberOfComments; j++) {
        const commentUser = users[Math.floor(Math.random() * users.length)];
        comments.push({
          user: commentUser._id,
          text: faker.lorem.sentence(),
          username: commentUser.username,
          createdAt: new Date(),
        });
      }

      const mediaFiles = [
        `/uploads/post_0_1.jpg`,
        `/uploads/post_0_2.jpg`
      ];

      const post = new Post({
        title: faker.lorem.sentence(),
        subtitle: faker.lorem.words(4),
        description: faker.lorem.paragraph(),
        rating: faker.number.int({ min: 1, max: 5 }),
        media: mediaFiles,
        createdBy: randomUser._id,     // Your schema expects this field
        likes: [],                     // Empty likes initially
        comments: comments,
      });

      await post.save();
    }

    console.log('✅ Seed data inserted successfully using static images');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
  } finally {
    mongoose.connection.close();
  }
};

createSeedData();
