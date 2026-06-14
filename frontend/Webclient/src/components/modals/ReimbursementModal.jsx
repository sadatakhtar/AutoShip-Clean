import React from 'react';
import {
  Modal,
  Paper,
  Typography,
  Button,
  Box
} from '@mui/material';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 420,
  bgcolor: 'white',
  borderRadius: '8px',
  boxShadow: 24,
  p: 3,
};

const ReimburseModal = ({ open, onClose, cost, onReimburseOne, onReimburseAll }) => {
  if (!cost) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Paper sx={modalStyle}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Reimburse Cost
        </Typography>

        <Typography mb={3}>
          Would you like to reimburse:
        </Typography>

        <Typography mb={2}>
          • <strong>Only this cost</strong> (£{cost.amount})
        </Typography>

        <Typography mb={3}>
          • <strong>All costs paid by {cost.paidByUserName}</strong>
        </Typography>

        <Box display="flex" justifyContent="flex-end" gap={1}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <Button
            variant="contained"
            color="warning"
            onClick={() => onReimburseOne(cost)}
          >
            This Cost
          </Button>

          <Button
            variant="contained"
            color="success"
            onClick={() => onReimburseAll(cost.paidByUserName)}
          >
            All for {cost.paidByUserName}
          </Button>
        </Box>
      </Paper>
    </Modal>
  );
};

export default ReimburseModal;
