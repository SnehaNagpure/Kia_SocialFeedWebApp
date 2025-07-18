import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store/store';
import { loginUser } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Container, Typography,Alert } from '@mui/material';

const Login = () => {
  const dispatch = useDispatch<AppDispatch>(); // Properly typed dispatch
  const navigate = useNavigate();

  const [email, setemail] = useState('');
  const [password, setPassword] = useState(''); // Add password state
  const [error, setError] = useState('');

  const handleLogin = async () => {
     setError('')
    // Optionally, add validation here before dispatch
     console.log('Login attempt:', { email, password });
    try {
      await dispatch(loginUser({ email, password })).unwrap(); // unwrap() helps with error handling
      
      navigate('/Profile');
    } catch (err: any) {
    // err is expected to be the error message string from your thunk rejectWithValue

    // Customize error message based on backend error text
    if (
      err.toLowerCase().includes('invalid email') ||
      err.toLowerCase().includes('invalid password') ||
      err.toLowerCase().includes('invalid credentials')
    ) {
      setError('Invalid email or password.');
    } else {
      setError('An unexpected error occurred. Please try again later.');
    }
  }
  };

  return (
    <Container sx={{ mt: 10 }}>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
        {/* Show error message here if error exists */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
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
