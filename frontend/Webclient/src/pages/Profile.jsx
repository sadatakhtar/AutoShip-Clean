import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
} from '@mui/material';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import ChangePasswordModal from '../components/modals/ChangePasswordModal';

export default function Profile() {
  const [user, setUser] = useState(null);

  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  // Load user info from JWT
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) return;

    const payload = JSON.parse(atob(token.split('.')[1]));

    setUser({
      username:
        payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
      role: payload[
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
      ],
    });
  }, []);

  const handleChangePassword = async () => {
    setError('');
    setSuccess('');

    try {
      await api.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });

      setSuccess('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setOpen(false);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        'Error changing password';

      setError(msg);
    }
  };

  if (!user) return <Typography>Loading...</Typography>;

  const handleBackBtn = () => {
    navigate(-1);
  };

  return (
    <Box sx={{ maxWidth: 500, margin: '200px auto' }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Account Settings
          </Typography>

          <Typography>
            <strong>Username:</strong> {user.username}
          </Typography>
          <Typography>
            <strong>Role:</strong> {user.role}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="contained"
              sx={{ mt: 3 }}
              onClick={() => setOpen(true)}
            >
              Change Password
            </Button>
            <Button variant="outlined" sx={{ mt: 3 }} onClick={handleBackBtn}>
              Back
            </Button>
          </Box>
        </CardContent>
      </Card>

      <ChangePasswordModal
        open={open}
        setOpen={setOpen}
        error={error}
        success={success}
        setCurrentPassword={setCurrentPassword}
        setNewPassword={setNewPassword}
        handleChangePassword={handleChangePassword}
        currentPassword={currentPassword}
        newPassword={newPassword}
      />
    </Box>
  );
}
