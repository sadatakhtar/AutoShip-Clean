import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import CarTable from '../../src/components/CarTable';
import api from '../api/axios';

const DashboardPage = () => {
  const [cars, setCars] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    api
      .get('/car')
      .then((response) => {
        setCars(response?.data?.$values || response?.data);
      })
      .catch((error) => {
        console.error('Error fetching car data: ', error);
        setError('Error fetching Data...');
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div data-testid="dashboard-component">
      <Typography variant="h5" mb={2}>
        Dashboard
      </Typography>
      <CarTable data={cars} loading={isLoading} error={error} />
    </div>
  );
};

export default DashboardPage;
