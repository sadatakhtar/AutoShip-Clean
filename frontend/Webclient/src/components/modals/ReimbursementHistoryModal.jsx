import { Modal, Paper, Typography, Box } from '@mui/material';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'white',
  borderRadius: '8px',
  boxShadow: 24,
  p: 3,
};

const ReimbursementHistoryModal = ({ open, onClose, history }) => (
  <Modal open={open} onClose={onClose}>
    <Paper sx={modalStyle}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Reimbursement History
      </Typography>

      {history.length === 0 ? (
        <Typography>No reimbursements yet…</Typography>
      ) : (
        history.map((h) => (
          <Box key={h.id} sx={{ mb: 2 }}>
            <Typography>
              <strong>{h.user}</strong>{' '}
              {h.action === 'reimburse'
                ? 'reimbursed'
                : 'undid reimbursement of'}{' '}
              <strong>£{h.amount}</strong>
              {h.cost && h.cost.name && (
                <>
                  {' '}
                  for <strong>{h.cost.name}</strong>
                </>
              )}
            </Typography>

            <Typography variant="body2" color="gray">
              {new Date(h.timestamp).toLocaleString()}
            </Typography>
          </Box>
        ))
      )}
    </Paper>
  </Modal>
);

export default ReimbursementHistoryModal;
