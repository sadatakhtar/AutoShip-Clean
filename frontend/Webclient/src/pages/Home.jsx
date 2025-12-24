import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const tiles = [
    {
      title: 'Dashboard',
      description: 'View system statistics and recent activity.',
      path: '/dashboard',
    },
    {
      title: 'Manage Users',
      description: 'View, edit, or remove users.',
      path: '/manage-users',
      requiresAdmin: true,
    },
    {
      title: 'Create New User',
      description: 'Add a new user to the system.',
      path: '/register',
      requiresAdmin: true,
    },
    {
      title: 'Profile',
      description: 'View and update your profile.',
      path: '/profile',
    },
    {
      title: 'Settings',
      description: 'Configure system preferences.',
      path: '/settings',
      requiresAdmin: true,
    },
    {
      title: 'About',
      description: 'Learn more about AutoShip.',
      path: '/about',
    },
  ];

  return (
    <Box data-testid="home-component" sx={{ mt: 10, px: 0 }}>
      <Typography variant="h5" sx={{ mb: 4, pt: 4 }}>
        Welcome to AutoShip
      </Typography>

      <Grid container spacing={3}>
        {tiles.map((tile) => {
          const isDisabled = tile.requiresAdmin && user?.role !== 'Admin';

          return (
            <Grid item xs={12} md={4} key={tile.title}>
              <Card
                sx={{
                  opacity: isDisabled ? 0.5 : 1,
                  pointerEvents: isDisabled ? 'none' : 'auto',
                }}
              >
                <CardContent>
                  <Typography variant="h6">{tile.title}</Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {tile.description}
                  </Typography>

                  <Button
                    variant="contained"
                    disabled={isDisabled}
                    onClick={() => navigate(tile.path)}
                  >
                    Open
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default Home;
