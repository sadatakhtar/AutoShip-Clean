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
  };

  const handleDelete = async (id) => {
    try {
      const res = await api.delete(`/Car/${id}`);

      // 204 = success
      if (res.status === 204) {
        setCars((prev) => (prev || []).filter((c) => c.id !== id));
        return;
      }
    } catch (err) {
      console.error('Delete error:', err);

      // If no response, it's a network or client-side error
      if (!err.response) {
        alert('Delete failed due to a network or client error.');
        return;
      }

      const status = err.response.status;

      if (status === 403) {
        alert('Delete failed: only admin users can perform this task.');
        return;
      }

      if (status === 401) {
        alert('Delete failed: you must be logged in.');
        return;
      }

      if (status === 404) {
        alert('Delete failed: vehicle not found.');
        return;
      }

      // Fallback for anything unexpected
      alert('Delete failed due to an unexpected server error.');
    }
  };

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
        setOpen={setOpen}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default DashboardPage;
