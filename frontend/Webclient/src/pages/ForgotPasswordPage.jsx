import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import api from '../api/axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setSuccess('');
    setError('');

    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }

    try {
      await api.post('/auth/forgot-password', { email });
      setSuccess('If that email exists, a reset link has been sent.');
    } catch (err) {
      console.error('Failed to send reset link',err);
      setError('Something went wrong. Try again later.');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: '80px auto' }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Forgot Password
          </Typography>

          <Typography sx={{ mb: 2 }}>
            Enter your email and we’ll send you a reset link.
          </Typography>

          {success && <Alert severity="success">{success}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Email"
            fullWidth
            sx={{ mt: 2 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
            onClick={handleSubmit}
          >
            Send Reset Link
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
