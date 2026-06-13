import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Paper,
} from '@mui/material';
import api from '../../api/axios';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 450,
  bgcolor: 'white',
  borderRadius: '8px',
  boxShadow: 24,
  p: 3,
};

const AddCostModal = ({ open, onClose, vehicleId, onAdded }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Base');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [notes, setNotes] = useState('');
  const [users, setUsers] = useState([]);

  // Load users for "Paid By" dropdown
  const loadUsers = async () => {
    try {
      const res = await api.get('/User');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  useEffect(() => {
    if (open) loadUsers();
  }, [open]);

  const handleSubmit = async () => {
    if (!amount || isNaN(amount)) {
      alert('Amount is required');
      return;
    }

    try {
      await api.post('/Cost', {
        carId: Number(vehicleId),
        name,
        category,
        amount: amount ? Number(amount) : 0,
        date,
        paidByUserId: paidBy,
        notes,
      });

      onAdded(); // refresh cost list
      onClose(); // close modal
    } catch (err) {
      console.error('Failed to add cost:', err);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Paper sx={modalStyle}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Add Cost
        </Typography>

        <TextField
          fullWidth
          label="Cost Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          sx={{ mb: 2 }}
        >
          <MenuItem value="Base">Base</MenuItem>
          <MenuItem value="Processing">Processing</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </TextField>

        <TextField
          fullWidth
          type="number"
          label="Amount (£)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          type="date"
          label="Date"
          InputLabelProps={{ shrink: true }}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          select
          label="Paid By"
          value={paidBy}
          onChange={(e) => setPaidBy(e.target.value)}
          sx={{ mb: 2 }}
        >
          {users.map((u) => (
            <MenuItem key={u.id} value={u.id}>
              {u.username}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          label="Notes"
          multiline
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Box display="flex" justifyContent="flex-end" gap={1}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="success" onClick={handleSubmit}>
            Add Cost
          </Button>
        </Box>
      </Paper>
    </Modal>
  );
};

export default AddCostModal;
