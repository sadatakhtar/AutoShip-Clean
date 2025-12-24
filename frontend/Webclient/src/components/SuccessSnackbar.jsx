import React from "react";
import { Snackbar, Alert } from "@mui/material";
import PropTypes from "prop-types";

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

SuccessSnackbar.propTypes = {
    open: PropTypes.bool.isRequired,
    message: PropTypes.string,
    onClose: PropTypes.func.isRequired,
}

export default SuccessSnackbar;