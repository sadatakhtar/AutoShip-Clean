import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  Chip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
} from '@mui/material';
import api from '../components/lib/axios';
import AddCostModal from '../components/modals/AddCostModal';
import DashboardTitleAndModal from '../components/DashboardTitleAndModal';

const CostPage = () => {
  const { id } = useParams();

  const [vehicle, setVehicle] = useState(null);
  const [costs, setCosts] = useState([]);
  const [partners, setPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState('All');
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);

  const navigate = useNavigate();

  const loadData = async () => {
    try {
      setLoading(true);

      const vehicleRes = await api.get(`/Car/${id}`);
      setVehicle(vehicleRes.data);

      const costRes = await api.get(`/Cost/vehicle/${id}`);
      setCosts(costRes.data);

      const uniquePartners = [
        ...new Set(costRes.data.map((c) => c.paidByUserName)),
      ];
      setPartners(uniquePartners);
    } catch (err) {
      console.error('Failed to load cost data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const filteredCosts =
    selectedPartner === 'All'
      ? costs
      : costs.filter((c) => c.paidByUserName === selectedPartner);

  const totalCost = costs.reduce((sum, c) => sum + c.amount, 0);

  const partnerTotals = partners.map((p) => ({
    name: p,
    total: costs
      .filter((c) => c.paidByUserName === p)
      .reduce((sum, c) => sum + c.amount, 0),
  }));

  if (loading) {
    return (
      <Box p={3} textAlign="center" color="white">
        <CircularProgress />
        <Typography mt={2} color="white">
          Loading cost data…
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 10 }}>
      <Box sx={{ mb: 2 }}>
        <DashboardTitleAndModal
          title="Dashboard"
          handleBack={() => navigate(-1)}
        />
      </Box>

      <Box
        p={3}
        pt={5}
        sx={{
          color: 'white',
          background: 'lightgray',
          minHeight: '60vh',
        }}
      >
        {/* VEHICLE HEADER */}
        <Typography variant="h4" fontWeight="bold" gutterBottom color="black">
          Vehicle Costs — #{id}
        </Typography>

        {vehicle && (
          <Typography variant="h6" color="#151414" gutterBottom>
            {vehicle.make} {vehicle.model} — {vehicle.status}
          </Typography>
        )}

        <Divider sx={{ my: 2, borderColor: 'lightgray' }} />

        {/* TOTAL COST */}
        <Paper
          sx={{
            p: 2,
            mb: 3,
            background: '#f9f9f9',
            border: '1px solid #ddd',
            color: 'black',
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            Total Cost: £{totalCost.toLocaleString()}
          </Typography>
        </Paper>

        {/* PARTNER TOTALS */}
        <Typography variant="h6" gutterBottom color="black">
          Partner Contributions
        </Typography>

        <Box display="flex" gap={1} mb={2}>
          <Chip
            label="All"
            sx={{
              background: selectedPartner === 'All' ? '#1976d2' : '#444',
              color: 'white',
            }}
            onClick={() => setSelectedPartner('All')}
          />

          {partnerTotals.map((p) => (
            <Chip
              key={p.name}
              label={`${p.name}: £${p.total}`}
              sx={{
                background: selectedPartner === p.name ? '#1976d2' : '#444',
                color: 'white',
              }}
              onClick={() => setSelectedPartner(p.name)}
            />
          ))}
        </Box>

        <Divider sx={{ my: 2, borderColor: 'lightgray' }} />

        {/* ADD COST BUTTON */}
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button
            variant="contained"
            color="success"
            onClick={() => setAddOpen(true)}
          >
            + Add Cost
          </Button>
        </Box>

        {/* COST TABLE */}
        <Paper
          sx={{
            background: '#fafafa',
            border: '1px solid #ddd',
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ background: '#e0e0e0' }}>
                <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>
                  Name
                </TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>
                  Category
                </TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>
                  Paid By
                </TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>
                  Date
                </TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>
                  Amount
                </TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>
                  Reimbursed
                </TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredCosts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    align="center"
                    sx={{ py: 3, color: '#555' }}
                  >
                    No costs found for this vehicle
                  </TableCell>
                </TableRow>
              ) : (
                filteredCosts.map((c) => (
                  <TableRow
                    key={c.id}
                    sx={{
                      '&:hover': { background: '#f0f0f0' },
                    }}
                  >
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c.category}</TableCell>
                    <TableCell>{c.paidByUserName}</TableCell>
                    <TableCell>
                      {new Date(c.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>£{c.amount}</TableCell>
                    <TableCell>{c.isReimbursed ? 'Yes' : 'No'}</TableCell>
                    <TableCell>
                      {c.isReimbursed ? (
                        <Button size="small" variant="outlined">
                          View
                        </Button>
                      ) : (
                        <Button
                          size="small"
                          variant="contained"
                          color="warning"
                        >
                          Reimburse
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Paper>

        <Divider sx={{ my: 3, borderColor: 'lightgray' }} />

        {/* REIMBURSEMENT HISTORY */}
        <Typography variant="h6" gutterBottom color="black">
          Reimbursement History
        </Typography>

        <Paper
          sx={{
            p: 2,
            background: '#f9f9f9',
            border: '1px solid #ddd',
            color: '#333',
          }}
        >
          <i>Reimbursement history will appear here…</i>
        </Paper>

        <AddCostModal
          open={addOpen}
          onClose={() => setAddOpen(false)}
          vehicleId={id}
          onAdded={loadData}
        />
      </Box>
    </Box>
  );
};

export default CostPage;
