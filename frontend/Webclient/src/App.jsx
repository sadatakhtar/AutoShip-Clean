import { Routes, Route } from 'react-router-dom';
import MainLayout from '../src/layout/MainLayout';
import AuthLayout from '../src/layout/AuthLayout';
import Home from '../src/pages/Home';
import About from '../src/pages/About';
import DashboardPage from '../src/pages/DashboardPage';
import LoginPage from '../src/pages/LoginPage';
import LogoutPage from './pages/LogoutPage';
import ProtectedRoute from './components/auth/ProtectedRoutes';

function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/" element={<LoginPage />} />
        <Route path="/logout" element={<LogoutPage />} />
      </Route>

      <Route element={<MainLayout />}>
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;

// import React from 'react';
// import { useEffect, useState } from 'react';
// import reactLogo from './assets/react.svg';
// import viteLogo from '/vite.svg';
// import axios from 'axios';
// import './App.css';
// import { Routes, Route, Link } from 'react-router-dom';
// import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
// import Home from './pages/Home';
// import About from './pages/About';
// import DashboardPage from './pages/DashboardPage';
// import LoginPage from './pages/LoginPage';

// function App() {
//   return (
//     <>
//       <AppBar position="fixed">
//         <Toolbar>
//           <Typography variant="h4" sx={{ flexGrow: 1, paddingLeft: '170px' }}>
//             AutoShip
//           </Typography>
//           <Button color="inherit" component={Link} to="/">
//             Home
//           </Button>
//           <Button color="inherit" component={Link} to="/dashboard">
//             Dashboard
//           </Button>
//           <Button color="inherit" component={Link} to="/about">
//             About
//           </Button>
//         </Toolbar>
//       </AppBar>

//       <Container sx={{ mt: 4 }}>
//         <Routes>
//           <Route path="/" element={<LoginPage />} />
//           <Route path="/home" element={<Home />}/>
//           <Route path="/about" element={<About />} />
//           <Route path="/dashboard" element={<DashboardPage />} />
//         </Routes>
//       </Container>
//     </>
//   );
// }

// export default App;
