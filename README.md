# SocialFeed Web Application

A full-stack social media-style web application built using React.js, Node.js, Express.js, and MongoDB.

## 🌐 Features

- User authentication (Sign up, Login)
- Create posts with media (images/videos) and star rating
- Profile page with user-specific posts
- Like, comment on posts
- Follow/unfollow users
- Infinite scroll on feed and profile
- Post detail modal with media carousel and comments
- Seed script using `faker.js` for generating sample users and posts

---

## 📁 Folder Structure

```
SocialFeedWebApp/
├── SOCIALFEEDWEBAPP_BACKEND/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── Components/
│   │   │   ├── Post.js
│   │   │   ├── User.js
│   │   ├── Controllers/
│   │   │   ├── postcontroller.js
│   │   │   ├── usercontroller.js
│   │   ├── Middlewares/
│   │   │   ├── upload.js
│   │   ├── Routes/
│   │   ├── app.js
│   │   ├── db.js
│   │   ├── index.js
│   │   ├── index.css
│   │   ├── App.css
│   │   ├── logo.svg
│   │   ├── reportWebVitals.js
│   │   ├── seed.js
│   ├── tests/
│   ├── uploads/
│   ├── .env
│   ├── setupTests.js
│   ├── jest.config.js
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   ├── .gitignore

├── SOCIALFEEDWEBAPPFRONT/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── shared/
│   │   │   │   ├── CreatePostForm.tsx
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── ProfilePage.css
│   │   │   │   ├── CreatePostForm.css
│   │   │   │   ├── ProtectedRoute.tsx
│   │   │   │   ├── LoginForm.tsx
│   │   ├── pages/
│   │   │   ├── CreatePostPage.tsx
│   │   │   ├── FollowButton.tsx
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── ProfilePage.tsx
│   │   ├── routes/
│   │   │   ├── AppRoutes.tsx
│   │   ├── store/
│   │   │   ├── slices/
│   │   │   ├── store.ts
│   │   ├── App.tsx
│   │   ├── App.test.tsx
│   │   ├── hooks.ts
│   │   ├── index.tsx
│   │   ├── App.css
│   │   ├── index.css
│   │   ├── logo.svg
│   │   ├── react-app-env.d.ts
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
```


## 🚀 Getting Started

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

### Seed Data

```bash
node src/seed.js
```

## ⚙️ Environment Variables

Create a `.env` file in the backend with:

```
MONGO_URI=mongodb://localhost:27017/socialfeedwebapp
PORT=5000
```

## 📸 Media Handling

- Uploaded media files are stored in `/src/Middlewares/uploads`.
- Accessed via `/uploads/filename.ext` from the client.

## 🧪 Testing

Basic testing setup (optional) with Jest/React Testing Library for frontend components.

## 📄 License

MIT