import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  Alert,
  Box,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
} from '@mui/material';

import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';

import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import api from '../lib/axios';

const documentTypes = [
  'Nova',
  'V5',
  'MOT',
  'IVA',
  'Invoice',
  'Export Certificate',
  'Bill of Lading',
  'Customs Invoice',
  'Other',
];

export default function UploadDocumentsModal({
  open,
  onClose,
  carId,
  onUploaded,
}) {
  const navigate = useNavigate();

  const [docType, setDocType] = useState('');
  const [receivedDate, setReceivedDate] = useState('');
  const [files, setFiles] = useState([]);
  const [existingDocs, setExistingDocs] = useState([]);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState(null);

  // useEffect(() => {
  //   if (!open) return;

  //   const fetchDocs = async () => {
  //     try {
  //       const res = await api.get(`/document/car/${carId}`, {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem('token')}`,
  //         },
  //       });
  //       setExistingDocs(res.data || []);
  //     } catch (err) {
  //       console.error('Error fetching documents', err);
  //     }
  //   };

  //   fetchDocs();
  // }, [open, carId]);
  useEffect(() => {
    if (!open) return;

    const fetchDocs = async () => {
      try {
        const res = await api.get(`/document/car/${carId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setExistingDocs(res.data || []);
      } catch (err) {
        console.error('Error fetching documents', err);
      }
    };

    // Delay fetch until after Dialog has mounted its children
    const timer = setTimeout(fetchDocs, 0);

    return () => clearTimeout(timer);
  }, [open, carId]);

  const handleUpload = async () => {
    setError('');
    setSuccess('');

    if (!docType) {
      setError('Please select a document type.');
      return;
    }

    if (files.length === 0) {
      setError('Please select at least one file.');
      return;
    }

    setUploading(true);

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('Type', docType);
        formData.append(
          'ReceivedDate',
          receivedDate || new Date().toISOString()
        );

        await api.post(`/document/${carId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
      }

      setSuccess('Documents uploaded successfully.');
      setFiles([]);

      if (onUploaded) onUploaded();

      setTimeout(() => {
        setUploading(false);
        onClose();
        navigate('/dashboard');
      }, 1200);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        'Error uploading documents';
      setError(msg);
      setUploading(false);
    }
  };

  const openDeleteConfirm = (doc) => {
    setDocToDelete(doc);
    setConfirmOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!docToDelete) return;

    try {
      await api.delete(`/document/${carId}/${docToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setExistingDocs((prev) => prev.filter((d) => d.id !== docToDelete.id));
      setConfirmOpen(false);
      setDocToDelete(null);
    } catch (err) {
      console.error('Error deleting document', err);
      setError('Failed to delete document.');
      setConfirmOpen(false);
    }
  };

  const handleDownload = async (docId) => {
    try {
      const res = await api.get(`/document/download/${docId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      window.open(res.data.url, '_blank');
    } catch (err) {
      console.error('Error downloading document', err);
      setError('Failed to download document.');
    }
  };

  const handleClose = () => {
    setError('');
    setSuccess('');
    setFiles([]);
    setDocType('');
    setReceivedDate('');
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Documents</DialogTitle>

        <DialogContent dividers>
          <Box sx={{ mb: 2 }}>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
          </Box>

          {uploading && <LinearProgress sx={{ mb: 2 }} />}

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                select
                label="Document Type"
                fullWidth
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                sx={{ minWidth: 300 }}
              >
                {documentTypes.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Received Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={receivedDate}
                onChange={(e) => setReceivedDate(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <label>Choose files</label>
              <input
                data-testid="file-input"
                type="file"
                multiple
                onChange={(e) => setFiles([...e.target.files])}
                style={{ display: 'block', marginTop: '8px' }}
              />

              {files.length > 0 && (
                <List dense sx={{ mt: 1 }}>
                  {files.map((f, i) => (
                    <ListItem key={i}>
                      <ListItemText primary={f.name} />
                    </ListItem>
                  ))}
                </List>
              )}
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <h4>Previously Uploaded Documents</h4>
          {existingDocs.length === 0 && (
            <p style={{ opacity: 0.6 }}>No documents uploaded yet.</p>
          )}

          {existingDocs.length > 0 && (
            <List dense>
              {existingDocs.map((doc) => (
                <ListItem
                  key={doc.id}
                  secondaryAction={
                    <>
                      <IconButton
                        color="primary"
                        onClick={() => handleDownload(doc.id)}
                        sx={{ mr: 1 }}
                      >
                        <DownloadIcon />
                      </IconButton>

                      <IconButton
                        color="error"
                        onClick={() => openDeleteConfirm(doc)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  }
                >
                  <ListItemText
                    primary={doc.fileName}
                    secondary={`${doc.type} — ${new Date(
                      doc.receivedDate
                    ).toLocaleDateString()}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={uploading}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Delete Document?</DialogTitle>
        <DialogContent>
          Are you sure you want to delete{' '}
          <strong>{docToDelete?.fileName}</strong>? This cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDeleteConfirmed}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

UploadDocumentsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  carId: PropTypes.number.isRequired,
  onUploaded: PropTypes.func,
};
