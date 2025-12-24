import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import SuccessSnackbar from '../components/SuccessSnackbar';
import api from '../api/axios';
import DashboardTitleAndModal from '../components/DashboardTitleAndModal';
import { useNavigate } from 'react-router-dom';

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const navigate = useNavigate();

  const handleBack = () => navigate(-1);

  // Fetch users on load
  useEffect(() => {
    api
      .get('/user')
      .then((res) => setUsers(res.data))
      .catch((err) => console.error('Failed to fetch users', err));
  }, []);

  const handleDelete = async () => {
    try {
      await api.delete(`/user/${deleteId}`);
      setUsers(users?.filter((u) => u.id !== deleteId));
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Delete failed', err);
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <Box sx={{ mt: 10, px: 4 }}>
      <DashboardTitleAndModal title="Manage Users" handleBack={handleBack} />

      <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>
        Current Users
      </Typography>

      <Table sx={{ backgroundColor: 'background.paper' }}>
        <TableHead>
          <TableRow style={{ backgroundColor: '#acb7c2ff' }}>
            <TableCell style={{ fontSize: 20 }}>
              <strong>ID</strong>
            </TableCell>
            <TableCell style={{ fontSize: 20 }}>
              <strong>Username</strong>
            </TableCell>
            <TableCell style={{ fontSize: 20 }}>
              <strong>Email</strong>
            </TableCell>
            <TableCell style={{ fontSize: 20 }}>
              <strong>Role</strong>
            </TableCell>
            <TableCell style={{ fontSize: 20 }}> 
              <strong>Action</strong>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => setDeleteId(user.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Delete Confirmation Dialog */}
      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          Are you sure you want to delete user with ID{' '}
          <strong>{deleteId}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <SuccessSnackbar
        open={snackbarOpen}
        message="User deleted successfully"
        onClose={() => setSnackbarOpen(false)}
      />
    </Box>
  );
};

export default ManageUsersPage;
