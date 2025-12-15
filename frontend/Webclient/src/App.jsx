import React from 'react'
import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import axios from 'axios';
import './App.css'
import { Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import Home from './pages/Home';
import About from './pages/About';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h4" sx={{ flexGrow:1, paddingLeft: "170px" }}>
            AutoShip
          </Typography>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
          <Button color="inherit" component={Link} to="/about">About</Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </Container>
    </>
  );
}


  // const [count, setCount] = useState(0)

  //  const [cars, setCars] = useState([]);
  // const [error, setError] = useState(null);

//   useEffect(() => {
//     axios.get('http://localhost:5065/api/car')
//     .then((response) => {
//       setCars(response.data.$values);
//     })
//     .catch((error) => {
//       console.error('Error fetching car data: ', error);
//       setError('Failed to fetch car data');
//     })
//   },[])

//   console.log(cars.$values)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vehicle Shipping Management App</h1>
//       <h2>Vehicle List</h2>
//       {error && <p style={{ color: 'red'}}>{error}</p>}
//       <ul>
//         {cars.map((vehicle, index) => (
//           <li key={index}>{vehicle.make} {vehicle.model}</li>
//         ))}
//       </ul>

//     </>
//   )
// }

export default App
