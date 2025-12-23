import { Box, IconButton, Typography } from '@mui/material';
import React from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';

const DashboardTitleAndModal = ({
  handleOpen,
  title,
  addLabel = 'none',
  handleBack,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ paddingRight: '10px' }}>
            <IconButton
              color="primary"
              aria-label="add car"
              onClick={handleBack}
            >
              <ArrowBackIcon />
            </IconButton>
          </div>

          <Typography variant="h6">{title}</Typography>
        </div>
      </div>
      <div>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          {addLabel !== 'none' && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}
            >
              <Typography variant="h7">{addLabel}</Typography>
              <IconButton
                color="primary"
                aria-label="add car"
                onClick={handleOpen}
              >
                <AddIcon />
              </IconButton>
            </div>
          )}
        </Box>
      </div>
    </div>
  );
};

export default DashboardTitleAndModal;
