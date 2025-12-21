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
} from '@mui/material';
import EditAndDelBtns from './buttons/EditAndDelBtns';
import AddIcon from '@mui/icons-material/Add';
import { getVehicleStatus } from '../utils/carTableHelpers';
import AddCarModal from './modals/AddCarModal';
import Loading from './Loading';

const CarTable = ({ data, isLoading, error, open, handleClose }) => {
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
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#acb7c2ff' }}>
              <TableCell style={{ fontSize: 20 }}>Id</TableCell>
              <TableCell style={{ fontSize: 20 }}>Make</TableCell>
              <TableCell style={{ fontSize: 20 }}>Model</TableCell>
              <TableCell style={{ fontSize: 20 }}>IVA Application</TableCell>
              <TableCell style={{ fontSize: 20 }}>MOT</TableCell>
              <TableCell style={{ fontSize: 20 }}>Status</TableCell>
              <TableCell style={{ fontSize: 20 }}>Action</TableCell>
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
                <TableRow
                  key={vehicle?.id}
                  sx={{
                    '&:hover': {
                      backgroundColor: '#d8ddecff', // light blue hover
                      cursor: 'pointer',
                    },
                  }}
                >
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
