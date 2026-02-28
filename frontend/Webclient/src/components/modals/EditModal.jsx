import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid
} from "@mui/material";
import PropTypes from "prop-types";

export default function EditModal({
  open,
  onClose,
  onConfirm,
  vehicle
}) {
  const [formData, setFormData] = useState({
    vin: "",
    make: "",
    model: "",
    status: "",
    ivaStatus: "",
    motStatus: "",
    v55Status: ""
  });

  useEffect(() => {
    if (vehicle) {
      setFormData({
        vin: vehicle.vin || "",
        make: vehicle.make || "",
        model: vehicle.model || "",
        status: vehicle.status || "",
        ivaStatus: vehicle.ivaStatus || "",
        motStatus: vehicle.motStatus || "",
        v55Status: vehicle.v55Status || ""
      });
    }
  }, [vehicle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (!vehicle) return;
    onConfirm(vehicle.id, formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Vehicle</DialogTitle>

      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              label="VIN"
              name="vin"
              value={formData.vin}
              onChange={handleChange}
              fullWidth
              disabled
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Make"
              name="make"
              value={formData.make}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="IVA Status"
              name="ivaStatus"
              value={formData.ivaStatus}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="MOT Status"
              name="motStatus"
              value={formData.motStatus}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="V55 Status"
              name="v55Status"
              value={formData.v55Status}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>

        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

EditModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  vehicle: PropTypes.object
};
