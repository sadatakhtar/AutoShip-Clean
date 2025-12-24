import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
} from '@mui/material';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function MainLayout() {
  const { user } = useAuth();

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h4" sx={{ flexGrow: 1, paddingLeft: '170px' }}>
            AutoShip
          </Typography>

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',

              alignItems: 'center',
            }}
          >
            <div>
              {/* Logged in as */}
              {user && (
                <Box sx={{ marginRight: 3 }}>
                  <Typography
                    variant="body1"
                    sx={{ color: 'rgba(176, 239, 30, 1)' }}
                  >
                    Logged in as:{' '}
                    <strong
                      style={{
                        color: 'rgba(45, 48, 38, 1)',
                        paddingLeft: '3px',
                      }}
                    >
                      {user.username}
                    </strong>
                  </Typography>
                </Box>
              )}
            </div>
            <div style={{ paddingRight: '10px' }}>
              <Button
                sx={{
                  color: 'white',
                  '&:hover': {
                    color: '#96ee08ff',
                  },
                }}
                color="inherit"
                component={Link}
                to="/home"
              >
                Home
              </Button>
              <Button
                sx={{
                  color: 'white',
                  '&:hover': {
                    color: '#96ee08ff',
                  },
                }}
                color="inherit"
                component={Link}
                to="/dashboard"
              >
                Dashboard
              </Button>

              {user?.role === 'Admin' && (
                <Button
                  sx={{
                    color: 'white',
                    '&:hover': {
                      color: '#96ee08ff',
                    },
                  }}
                  color="inherit"
                  component={Link}
                  to="/settings"
                >
                  Settings
                </Button>
              )}
              <Button
                sx={{
                  color: 'white',
                  '&:hover': {
                    color: '#96ee08ff', // light blue or any color you want
                  },
                }}
                color="inherit"
                component={Link}
                to="/profile"
              >
                Profile
              </Button>

              <Button
                sx={{
                  color: 'white',
                  '&:hover': {
                    color: '#96ee08ff',
                  },
                }}
                color="inherit"
                component={Link}
                to="/about"
              >
                About
              </Button>
              <Button
                sx={{
                  color: 'white',
                  '&:hover': {
                    color: '#96ee08ff',
                  },
                }}
                color="inherit"
                component={Link}
                to="/logout"
              >
                Log Out
              </Button>
            </div>
          </div>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Outlet />
      </Container>
    </>
  );
}
