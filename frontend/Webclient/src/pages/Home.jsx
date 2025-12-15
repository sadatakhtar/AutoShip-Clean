import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import axios from 'axios';
import CarTable from '../components/CarTable';

const Home = () => {
  const [count, setCount] = useState(0);

  // const [cars, setCars] = useState([]);
  // const [error, setError] = useState(null);

  // useEffect(() => {
  //   axios
  //     .get('http://localhost:5065/api/car')
  //     .then((response) => {
  //       setCars(response.data.$values);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching car data: ', error);
  //       setError('Failed to fetch car data');
  //     });
  // }, []);

 // cars.map((c) => console.log('*', c?.make));

  return (
 
    <div data-testid="home-component">
      <Typography variant="h4">Welcome to the Home Page</Typography>
    


    
      <div>
      

      </div>
    </div>
  );
};

export default Home;
