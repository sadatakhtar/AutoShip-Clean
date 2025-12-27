import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Grid,
  Alert,
  Typography,
  Box,
} from '@mui/material';
import api from '../../api/axios';
import PropTypes from 'prop-types';

const carStatuses = [
  'Available',
  'InTransit',
  'Sold',
  'Reserved',
  'Registered',
];
const ivaStatuses = ['Pending', 'Passed', 'Failed'];
const motStatuses = ['Pending', 'Valid', 'Expired'];
const v55Statuses = ['Pending', 'Submitted', 'Approved'];

export default function CreateVehicleModal({ open, setOpen, onSuccess }) {
  const [form, setForm] = useState({
    vin: '',
    make: '',
    model: '',
    manufactureDate: '',
    status: '',
    ivaStatus: '',
    motStatus: '',
    v55Status: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    try {
      await api.post('/newcar', {
        VIN: form.vin,
        Make: form.make,
        Model: form.model,
        ManufactureDate: form.manufactureDate,
        Status: form.status,
        IVAStatus: form.ivaStatus,
        MOTStatus: form.motStatus,
        V55Status: form.v55Status,
        Documents: [],
      });

      setSuccess('Vehicle created successfully');
      setTimeout(() => {
        setOpen(false);
        onSuccess(); // refreshes dashboard car list
      }, 1200);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        'Error creating vehicle';
      setError(msg);
    }
  };

  const handleClose = () => {
    setError('');
    setSuccess('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ pb: 1, fontWeight: 'bold' }}>
        Create New Vehicle
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          backgroundColor: '#fafafa',
          pt: 3,
          pb: 3,
        }}
      >
        <Box sx={{ mb: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="VIN"
              name="vin"
              fullWidth
              value={form.vin}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Make"
              name="make"
              fullWidth
              value={form.make}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Model"
              name="model"
              fullWidth
              value={form.model}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Manufacture Date"
              name="manufactureDate"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={form.manufactureDate}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              select
              label="Status"
              name="status"
              fullWidth
              sx={{ minWidth: 260 }}
              value={form.status}
              onChange={handleChange}
            >
              {carStatuses.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              select
              label="IVA Status"
              name="ivaStatus"
              fullWidth
              sx={{ minWidth: 260 }}
              value={form.ivaStatus}
              onChange={handleChange}
            >
              {ivaStatuses.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              select
              label="MOT Status"
              name="motStatus"
              fullWidth
              sx={{ minWidth: 260 }}
              value={form.motStatus}
              onChange={handleChange}
            >
              {motStatuses.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              select
              label="V55 Status"
              name="v55Status"
              fullWidth
              sx={{ minWidth: 260 }}
              value={form.v55Status}
              onChange={handleChange}
            >
              {v55Statuses.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Document upload coming soon…
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button variant="contained" onClick={handleSubmit}>
          Create Vehicle
        </Button>
        <Button variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

CreateVehicleModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};
