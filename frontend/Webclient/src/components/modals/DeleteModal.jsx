import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import PropTypes from "prop-types";

export default function DeleteModal({ open, onClose, onConfirm, carId }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Vehicle</DialogTitle>

      <DialogContent>
        <Typography>
          Are you sure you want to delete vehicle with ID{' '}
          <strong>{carId}</strong>?
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>

        <Button
          onClick={() => onConfirm(carId)}
          color="error"
          variant="contained"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
DeleteModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  carId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
