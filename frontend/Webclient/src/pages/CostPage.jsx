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
import ReimburseModal from '../components/modals/ReimbursementModal';
import ReimbursementHistoryModal from '../components/modals/ReimbursementHistoryModal';

const CostPage = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [costs, setCosts] = useState([]);
  const [partners, setPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState('All');
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);

  const [reimburseOpen, setReimburseOpen] = useState(false);
  const [selectedCost, setSelectedCost] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyOpen, setHistoryOpen] = useState(false);

  const navigate = useNavigate();

  const loadHistory = async () => {
    try {
      const res = await api.get(`/Cost/history/vehicle/${id}`);
      setHistory(res.data);
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

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
      await loadHistory();
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

  const handleUndoReimburseOne = async (costId) => {
    try {
      await api.post(`/Cost/unreimburse/${costId}`);
      loadData();
    } catch (error) {
      console.error('Failed to undo reimbursement:', error);
    }
  };

  const handleUndoReimburseAll = async () => {
    try {
      await api.post(
        `/Cost/unreimburse/user/${selectedUser}/vehicle/${vehicleId}`
      );
      loadData();
    } catch (error) {
      console.error('Failed to undo all reimbursements:', error);
    }
  };

  const handleReimburseOne = async (cost) => {
    try {
      await api.post(`/Cost/reimburse/${cost.id}`);

      setReimburseOpen(false);
      loadData();
    } catch (err) {
      console.error('Failed to reimburse cost:', err);
    }
  };

  const handleReimburseAll = async (username) => {
    try {
      await api.post(`/Cost/reimburse/user/${username}/vehicle/${id}`);

      const total = costs
        .filter((c) => c.paidByUserName === username)
        .reduce((sum, c) => sum + c.amount, 0);

      setReimburseOpen(false);
      loadData();
    } catch (err) {
      console.error('Failed to reimburse all costs:', err);
    }
  };

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
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => handleUndoReimburseOne(c.id)}
                        >
                          Undo
                        </Button>
                      ) : (
                        <Button
                          size="small"
                          variant="contained"
                          color="warning"
                          onClick={() => {
                            setSelectedCost(c);
                            setReimburseOpen(true);
                          }}
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

        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button variant="outlined" onClick={() => setHistoryOpen(true)}>
            View Full History
          </Button>
        </Box>

        <Paper
          sx={{
            p: 2,
            background: '#f9f9f9',
            border: '1px solid #ddd',
            color: '#333',
          }}
        >
          {!Array.isArray(history) || history.length === 0 ? (
            <Typography>No reimbursements yet…</Typography>
          ) : (
            history.map((h) => (
              <Paper
                key={h.id}
                sx={{
                  p: 2,
                  mb: 1,
                  background: '#fff',
                  border: '1px solid #ddd',
                }}
              >
                <Typography>
                  <strong>{h.user}</strong>
                  {h.action === 'reimburse'
                    ? ' reimbursed '
                    : ' undid reimbursement of '}
                  <strong>£{h.amount}</strong>

                  {h.cost && h.cost.name && (
                    <>
                      {' '}
                      for <strong>{h.cost.name}</strong>
                    </>
                  )}
                </Typography>

                <Typography variant="body2" color="gray">
                  {new Date(h.timestamp).toLocaleString()}
                </Typography>
              </Paper>
            ))
          )}
        </Paper>

        <AddCostModal
          open={addOpen}
          onClose={() => setAddOpen(false)}
          vehicleId={id}
          onAdded={loadData}
        />

        <ReimburseModal
          open={reimburseOpen}
          onClose={() => setReimburseOpen(false)}
          cost={selectedCost}
          onReimburseOne={handleReimburseOne}
          onReimburseAll={handleReimburseAll}
        />

        <ReimbursementHistoryModal
          open={historyOpen}
          onClose={() => setHistoryOpen(false)}
          history={history}
        />
      </Box>
    </Box>
  );
};

export default CostPage;
