const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const path = require('path');
const fs = require('fs');

const userRoutes = require('../src/Routes/userRoutes');
const User = require('../src/Components/User');

let app;
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  // Create uploads dir if not exist (mock multer destination)
  const uploadsPath = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath);
  }

  app = express();
  app.use(express.json());
  app.use('/api/users', userRoutes);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany(); // cleanup users after each test
});

describe('User Routes', () => {

  it('should create a user', async () => {
    const res = await request(app)
      .post('/api/users/create')
      .field('firstName', 'John')
      .field('lastName', 'Doe')
      .field('username', 'johndoe')
      .field('email', 'john@example.com')
      .field('password', 'password123')
      .field('age', 30);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.username).toBe('johndoe');
  });

  it('should not login with wrong password', async () => {
    await request(app).post('/api/users/create')
      .field('firstName', 'Jane')
      .field('lastName', 'Smith')
      .field('username', 'janesmith')
      .field('email', 'jane@example.com')
      .field('password', 'mypassword')
      .field('age', 25);

    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'jane@example.com', password: 'wrongpass' });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe('Invalid email or password.');
  });

  it('should create a user with a profile picture', async () => {
    const res = await request(app)
      .post('/api/users/create')
      .field('firstName', 'Pic')
      .field('lastName', 'Upload')
      .field('username', 'picuser')
      .field('email', 'pic@example.com')
      .field('password', 'test123')
      .field('age', 28)
      .attach('profilePicture', path.join(__dirname, 'demo_profile.jpg'));

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.profilePicture).toContain('/uploads/');
  });

});
