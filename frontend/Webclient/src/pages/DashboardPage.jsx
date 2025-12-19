import React, { useEffect, useState } from 'react';
import CarTable from '../../src/components/CarTable';
import api from '../api/axios';
import { Box, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import DashboardTitleAndModal from '../components/DashboardTitleAndModal';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const [cars, setCars] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const navigate = useNavigate();

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

  const handleBack = () => {
    navigate(-1);
  }

  return (
    <div data-testid="dashboard-component" style={{ marginTop: 100 }}>
      <DashboardTitleAndModal
        title="Dashboard"
        addLabel="Add Vehicle"
        handleOpen={handleOpen}
        handleBack={handleBack}
      />
      <CarTable
        data={cars}
        loading={isLoading}
        error={error}
        open={open}
        handleClose={handleClose}
      />
    </div>
  );
};

export default DashboardPage;
