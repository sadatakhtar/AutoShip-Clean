import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import api from '../components/lib/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE } from "../env";

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/auth/login', { username, password });
      const { token } = response.data;

      // Save token (localStorage for simplicity)
      localStorage.setItem('jwtToken', token);

      // This is needed so new logged in user is updated
      login(token);

      navigate('/home');
    } catch (err) {
      console.error('Login failed:', err.response?.data || err?.message);
      alert('Invalid credentials');
      setError('Invalid username or password');
    }
  };
  // NB: Only use while debugging - this will cause test failure if left uncommented
  //console.log('API BASE:', import.meta.env.VITE_API_BASE);
  console.log("API BASE:", API_BASE);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Paper elevation={3} sx={{ p: 4, width: 300 }}>
        <Typography variant="h6" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            variant="standard"
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            variant="standard"
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Login
          </Button>
          <Typography
            sx={{ mt: 2, cursor: 'pointer' }}
            color="primary"
            onClick={() => navigate('/forgot-password')}
          >
            Forgot Password?
          </Typography>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginPage;
