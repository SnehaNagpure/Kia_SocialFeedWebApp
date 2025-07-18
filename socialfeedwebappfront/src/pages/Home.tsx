// src/pages/Home.tsx
import React from 'react';
import { Typography, Container, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container sx={{ mt: 10, textAlign: 'center' }}>
      <Typography variant="h3" gutterBottom>
        Welcome to Social Feed App
      </Typography>
      <Typography variant="body1" gutterBottom>
        Share posts, connect with friends, and explore content.
      </Typography>
      <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={() => navigate('/login')}>
        Go to Login
      </Button>
    </Container>
  );
};

export default Home;
