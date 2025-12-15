import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import CarTable from '../../src/components/CarTable';
import axios from 'axios';

const DashboardPage = () => {
  const [cars, setCars] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:5065/api/car')
      .then((response) => {
        setCars(response.data.$values);
      })
      .catch((error) => {
        console.error('Error fetching car data: ', error);
        setError('Failed to fetch car data');
      });
  }, []);

  return (
    <div data-testid="dashboard-component">
      <Typography variant="h5" mb={2}>
        Dashboard
      </Typography>
      <CarTable data={cars} />
    </div>
  );
};

export default DashboardPage;
