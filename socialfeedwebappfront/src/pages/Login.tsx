import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store/store';
import { loginUser } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Container, Typography } from '@mui/material';

const Login = () => {
  const dispatch = useDispatch<AppDispatch>(); // Properly typed dispatch
  const navigate = useNavigate();

  const [email, setemail] = useState('');
  const [password, setPassword] = useState(''); // Add password state

  const handleLogin = async () => {
    // Optionally, add validation here before dispatch
     console.log('Login attempt:', { email, password });
    try {
      await dispatch(loginUser({ email, password })).unwrap(); // unwrap() helps with error handling
      
      navigate('/Profile');
    } catch (error) {
      // Handle login errors here, e.g. show error message
      console.error('Login failed:', error);
    }
  };

  return (
    <Container sx={{ mt: 10 }}>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <TextField
        label="email"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setemail(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleLogin}>
        Log In
      </Button>
    </Container>
  );
};

export default Login;
