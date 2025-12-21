import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    username: '',
    password: '',
    email: '',
    role: '',
  });

  // ✅ Check if user is Admin
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      navigate('/'); // not logged in
      return;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    if (
      payload[
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
      ] !== 'Admin'
    ) {
      navigate('/dashboard'); // not admin
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await api.post('/auth/register', form);
      navigate('/dashboard');
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Paper elevation={3} sx={{ padding: 4, width: 400 }}>
        <Typography variant="h5" mb={2}>
          Create New User
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
          
            variant="standard"
            fullWidth
            label="Username"
            name="username"
            margin="normal"
            value={form.username}
            onChange={handleChange}
            required
          />

          <TextField
            variant="standard"
            fullWidth
            label="Email"
            name="email"
            margin="normal"
            value={form.email}
            onChange={handleChange}
            required
          />

          <TextField
            variant="standard"
            fullWidth
            label="Password"
            name="password"
            type="password"
            margin="normal"
            value={form.password}
            onChange={handleChange}
            required
          />

          <TextField
            fullWidth
            label="Role"
            name="role"
            margin="normal"
            value={form.role}
            onChange={handleChange}
            placeholder="User or Admin"
          />

          {error && (
            <Typography color="error" mt={1}>
              {error}
            </Typography>
          )}

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
            Register User
          </Button>

          <Button
            fullWidth
            sx={{ mt: 1 }}
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
