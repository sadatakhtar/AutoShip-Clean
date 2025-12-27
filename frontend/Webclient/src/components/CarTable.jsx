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
} from '@mui/material';
import EditAndDelBtns from './buttons/EditAndDelBtns';
import { getRowStyle } from '../utils/carTableHelpers';
import Loading from './Loading';
import PropTypes from 'prop-types';
import CreateVehicleModal from './modals/CreateVehicleModal';

const CarTable = ({
  data,
  isLoading,
  error,
  open,
  setOpen,
  handleClose,
  onDelete,
  refreshCarList,
}) => {
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
              <TableCell style={{ fontSize: 20 }}>IVA</TableCell>
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
                    ...getRowStyle(vehicle?.v55Status),
                    '&:hover': {
                      backgroundColor: '#d8ddecff',
                      cursor: 'pointer',
                    },
                  }}
                >
                  <TableCell>{vehicle?.id}</TableCell>
                  <TableCell>{vehicle?.make}</TableCell>
                  <TableCell>{vehicle?.model}</TableCell>
                  <TableCell>{vehicle?.ivaStatus}</TableCell>
                  <TableCell>{vehicle?.motStatus}</TableCell>
                  <TableCell>{vehicle?.status}</TableCell>
                  <TableCell>
                    {<EditAndDelBtns id={vehicle?.id} onDelete={onDelete} />}
                  </TableCell>
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
      <CreateVehicleModal
        open={open}
        setOpen={setOpen}
        onSuccess={refreshCarList}
      />
    </Box>
  );
};

CarTable.propTypes = {
  data: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.string,
  open: PropTypes.bool,
  setOpen: PropTypes.func.isRequired,
  handleClose: PropTypes.func,
  onDelete: PropTypes.func.isRequired,
  refreshCarList: PropTypes.func.isRequired,
};

export default CarTable;
