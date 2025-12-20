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
              <Button color="inherit" component={Link} to="/home">
                Home
              </Button>
              <Button color="inherit" component={Link} to="/dashboard">
                Dashboard
              </Button>

              {user?.role === 'Admin' && (
                <Button color="inherit" component={Link} to="/register">
                  Register user
                </Button>
              )}
                <Button color="inherit" component={Link} to="/profile">
                Profile
              </Button>

              <Button color="inherit" component={Link} to="/about">
                About
              </Button>
              <Button color="inherit" component={Link} to="/logout">
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
