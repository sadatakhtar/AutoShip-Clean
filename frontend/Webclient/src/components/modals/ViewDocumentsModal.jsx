import React, { useEffect, useState } from 'react';
import { Modal, Box, Button, CircularProgress } from '@mui/material';

const ViewDocumentsModal = ({ open, onClose, carId }) => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && carId) {
      setLoading(true);

      fetch(`http://localhost:5065/api/Car/${carId}/documents`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setDocs(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [open, carId]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          background: 'white',
          padding: 3,
          margin: '10% auto',
          width: 450,
          borderRadius: 2,
          boxShadow: 24,
        }}
      >
        <h2 style={{ marginBottom: '20px' }}>Attached Documents</h2>

        {loading ? (
          <CircularProgress />
        ) : docs.length === 0 ? (
          <p>No documents uploaded for this vehicle.</p>
        ) : (
          docs.map((doc) => (
            <Box
              key={doc.id}
              sx={{
                padding: '10px',
                borderBottom: '1px solid #ddd',
                marginBottom: '10px',
              }}
            >
              <strong>{doc.fileName}</strong>
              <br />
              <small>Type: {doc.type}</small>
              <br />
              <small>Uploaded: {new Date(doc.receivedDate).toLocaleDateString()}</small>
              <br />

              <Button
                variant="contained"
                size="small"
                sx={{ marginTop: '10px' }}
                onClick={() =>
                  window.open(
                    `http://localhost:5065/api/Documents/${doc.id}/download`,
                    '_blank'
                  )
                }
              >
                Download
              </Button>
            </Box>
          ))
        )}

        <Button
          variant="outlined"
          onClick={onClose}
          sx={{ marginTop: '20px', width: '100%' }}
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default ViewDocumentsModal;
