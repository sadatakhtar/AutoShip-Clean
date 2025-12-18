import { Box, CircularProgress, Typography } from '@mui/material';
import React from 'react'

const Loading = ({ message = "Fetching data..."}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100%"
      p={2}
    >
      <CircularProgress color="primary" />
      <Typography variant="body2" mt={2}>
        {message}
      </Typography>
    </Box>
  );

}

export default Loading