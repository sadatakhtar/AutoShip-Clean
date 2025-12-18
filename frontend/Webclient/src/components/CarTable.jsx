import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import EditAndDelBtns from './buttons/EditAndDelBtns';
import AddIcon from '@mui/icons-material/Add';
import { getVehicleStatus } from '../utils/carTableHelpers';
import AddCarModal from './modals/AddCarModal';
import Loading from './Loading';

const CarTable = ({ data, isLoading, error }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  console.log('DDDD', data);

  // Handle loading state first
  if (isLoading) {
    return <Loading message="Loading data..." />;
  }

  // Handle error state
  if (error) {
    return <Loading message={error} />;
  }

  // Handle no data
  if (!data || data.length === 0) {
    return <Loading message={error} />;
  }

  return (
    <Box>
      {/* Header with Add button */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">Add Vehicle</Typography>
        <IconButton color="primary" aria-label="add car" onClick={handleOpen}>
          <AddIcon />
        </IconButton>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Make</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>IVA Application</TableCell>
              <TableCell>MOT</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6} align="center" style={{ color: 'red' }}>
                  {error}
                </TableCell>
              </TableRow>
            ) : data?.length > 0 ? (
              data?.map((vehicle) => (
                <TableRow key={vehicle?.id}>
                  <TableCell>{vehicle?.id}</TableCell>
                  <TableCell>{vehicle?.make}</TableCell>
                  <TableCell>{vehicle?.model}</TableCell>
                  <TableCell>{vehicle?.ivaStatus}</TableCell>
                  <TableCell>{vehicle?.motStatus}</TableCell>
                  <TableCell>{getVehicleStatus(vehicle?.status)}</TableCell>
                  <TableCell>{<EditAndDelBtns />}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No cars available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <AddCarModal open={open} handleClose={handleClose} />
    </Box>
  );
};

export default CarTable;
