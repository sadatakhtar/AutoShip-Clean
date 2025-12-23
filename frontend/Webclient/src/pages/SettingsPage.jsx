import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import DashboardTitleAndModal from '../components/DashboardTitleAndModal';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };
  return (
    <Box sx={{ mt: 10, px: 0 }}>
      <Box sx={{ mb: 2 }}>
        <DashboardTitleAndModal title="Settings" handleBack={handleBack} />
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Create New User</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Add a new user to the system.
              </Typography>
              <Button variant="contained">Open</Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Update User Role</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Modify permissions or roles for existing users.
              </Typography>
              <Button variant="contained">Open</Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Delete User</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Remove a user from the system.
              </Typography>
              <Button variant="contained" color="error">
                Open
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Change Password</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Update your account password.
              </Typography>
              <Button variant="contained">Open</Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SettingsPage;
