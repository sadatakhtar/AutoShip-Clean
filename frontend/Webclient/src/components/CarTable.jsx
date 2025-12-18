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
} from '@mui/material';

const CarTable = ({ data, isLoading }) => {
  const [error, setError] = useState(null);

  const getVehicleStatus = (status) => {
    if (status === 1) return 'Awaiting documents';
    if (status === 2) return 'Documents recieved';
    if (status === 3) return 'Awaiting customs';
    if (status === 4) return 'Customs cleared';
    if (status === 5) return 'IVA completed';
    if (status === 6) return 'MOT completed';
    if (status === 7) return 'Approved';
  };

  console.log('DDDD', data);
  return (
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
                <TableCell>{<button>Edit</button>}</TableCell>
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
  );
};

export default CarTable;
