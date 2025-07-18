# 📱 React Social Media App

A full-stack social media-style web app with user authentication, post creation (images/videos), profile management, star rating, likes, comments, and follow/unfollow functionality.

---

## 🏗️ Project Structure

| Parent Folder       | Files / Folders                    | Explanation                                                                 |
|---------------------|------------------------------------|-----------------------------------------------------------------------------|
| **root/**           | `server.js`                        | Express server entry point                                                  |
|                     | `uploads/`                         | Stores uploaded media (images/videos)                                      |
|                     | `README.md`                        | This documentation file                                                    |
| **/client/**        | React frontend source                                                  |
|                     | `package.json`                     | Frontend dependencies and scripts                                          |
|                     | `src/pages/`                       | Page-level components (Login, Register, Home, Profile)                     |
|                     | `src/components/`                  | Reusable components (Navbar, PostCard, PostModal, CreatePostForm)         |
|                     | `src/redux/`                       | Redux slices (authSlice, postSlice, userSlice)                             |
|                     | `src/services/`                    | API service functions                                                       |
|                     | `src/App.tsx`                      | React app routes                                                            |
| **/server/**        | Express backend source                                                 |
|                     | `routes/`                          | API routes for auth, posts, users                                          |
|                     | `controllers/`                     | Request handlers for each route                                            |
|                     | `models/`                          | Mongoose models (User, Post, Comment)                                      |
|                     | `middleware/`                      | Auth middleware, error handling                                            |
|                     | `config/`                          | DB connection setup                                                         |
|                     | `utils/`                           | Helper functions                                                            |
|                     | `seed/`                            | Demo data generation scripts                                               |

---

## 🔧 Features

- **Authentication**: Register/Login with JWT
- **User Profile Page**: 
  - Shows user details, posts
  - Follow/Unfollow functionality
- **Create Post**:
  - Title, subtitle, description, star rating
  - Upload **multiple images/videos**
  - Dynamic `createdBy` from logged-in user
- **Post Feed**:
  - Infinite scrolling
  - Media preview, like count, user info
- **Post Details Modal**:
  - Carousel for media
  - Long description
  - Comments & likes
- **Follow/Unfollow**:
  - On Profile page
  - Updates following/followers count
- **Like/Comment on Posts**
- **Media Uploads** stored in `uploads/` folder (server root)
- **TypeScript** support on frontend
- **MongoDB** for database
- **React + Redux Toolkit** frontend
- **Express + Node.js** backend

---

## 🚀 Getting Started

### Prerequisites

- Node.js
- MongoDB (Local or Atlas)
- Postman (for API testing)

---

## 🔧 Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/react-social-media-app.git
cd react-social-media-app
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Install frontend dependencies

```bash
cd ../client
npm install
```

---

## 🔌 Environment Variables

### Backend (`server/.env`):

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/socialapp
JWT_SECRET=your_jwt_secret
```

---

## ▶️ Running the App

### Backend

```bash
cd src
node app.js
```

### Frontend

```bash
cd client
npm start
```

---

## 🧪 API Sample (Postman)

### Endpoint: Create Post

- **Method**: `POST`
- **URL**: `http://localhost:5000/api/posts/create`
- **Headers**: 
  - `Authorization`: `Bearer <token>`
  - `Content-Type`: `multipart/form-data`
- **Body**: (form-data)
  - `title`: My First Post
  - `subtitle`: Hello World
  - `description`: This is a sample description
  - `rating`: 4.5
  - `createdBy`: `<user_id>`
  - `media[]`: (upload multiple image/video files)

---

## 🗃️ Seed Script

- Adds demo users, posts (with images/videos), comments

```bash
cd src/seed
node seed.js
```

---

## 📸 Screenshots

> _(Add screenshots here if needed: Feed, Post modal, Profile, etc.)_

---

## 🧪 Frontend Testing (Optional)

You can use **React Testing Library** and **Jest** to write test cases. Example test scenarios:

- LoginForm validation
- CreatePostForm field inputs
- Comment/Like button click
- Follow/Unfollow state changes

---

## 📦 Tech Stack

- **Frontend**: React, TypeScript, Redux Toolkit
- **Backend**: Express, Node.js
- **Database**: MongoDB + Mongoose
- **Media Handling**: Multer
- **Authentication**: JWT
- **State Management**: Redux Toolkit

---

## 🧑‍💻 Author

Sneha Nagpure  
GitHub: [@SnehaNagpure](https://github.com/SnehaNagpure)  
Email: snehanagpure1@gmail.com