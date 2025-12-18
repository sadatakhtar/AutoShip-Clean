import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Link, Outlet, useNavigate } from 'react-router-dom';

export default function MainLayout() {
//     const navigate = useNavigate();
//      const handleClearToken = () => {
//     // Remove token
//     localStorage.removeItem("jwtToken");

//     // Redirect to login page
//     navigate("/");
//   };


  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h4" sx={{ flexGrow: 1, paddingLeft: '170px' }}>
            AutoShip
          </Typography>
          <Button color="inherit" component={Link} to="/home">Home</Button>
          <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
          <Button color="inherit" component={Link} to="/about">About</Button>
          <Button color='inherit' component={Link} to="/logout">Log Out</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Outlet />
      </Container>
    </>
  );
}

