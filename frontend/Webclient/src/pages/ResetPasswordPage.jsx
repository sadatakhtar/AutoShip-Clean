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
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async () => {
    setSuccess('');
    setError('');

    try {
      await api.post('/auth/reset-password', {
        token,
        newPassword,
      });

      setSuccess('Password reset successfully. You can now log in.');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      const msg = err?.response?.data || 'Invalid or expired reset link.';

      setError(msg);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: '80px auto' }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Reset Password
          </Typography>

          {!token && <Alert severity="error">Invalid reset link.</Alert>}

          {success && <Alert severity="success">{success}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="New Password"
            type="password"
            fullWidth
            sx={{ mt: 2 }}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
            onClick={handleSubmit}
            disabled={!token}
          >
            Reset Password
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
