import React from "react";
import { Snackbar, Alert } from "@mui/material";

const SuccessSnackbar = ({ open, message, onClose }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert onClose={onClose} severity="success" variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SuccessSnackbar;