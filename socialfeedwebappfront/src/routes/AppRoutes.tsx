import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Profile from '../pages/ProfilePage';
import ProtectedRoute from '../components/shared/ProtectedRoute';
import CreatePost from '../pages/CreatePostPage';
const AppRoutes = () => {
  return (
    
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      

      <Route 
        path="/create-post" 
        element={
          <ProtectedRoute>
            <CreatePost />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Login />} />
    </Routes>
  );
};

export default AppRoutes;
