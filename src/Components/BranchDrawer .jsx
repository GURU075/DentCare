import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

// Import your branch-related API calls
import { getAllBranches, createBranch, updateBranch } from '../api';

const BranchDrawer = ({ open, onClose }) => {
  // All fetched branches
  const [branches, setBranches] = useState([]);

  // Whether we’re adding a new branch or editing an existing branch:
  // mode can be 'none', 'create', or 'edit'.
  const [mode, setMode] = useState('none');

  // The branch we’re currently editing
  const [editingBranch, setEditingBranch] = useState(null);

  // Local form for branch fields
  const [branchForm, setBranchForm] = useState({
    name: '',
    address: '',
    phone: '',
  });

  // -------------------- Load branches when the drawer opens --------------------
  useEffect(() => {
    if (open) {
      fetchBranches();
    }
  }, [open]);

  const fetchBranches = async () => {
    try {
      const data = await getAllBranches();
      // If your API returns { data: [ ... ] }, do data.data instead
      setBranches(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching branches:', error);
      setBranches([]);
    }
  };

  // -------------------- Show the "Add Branch" form --------------------
  const handleAddBranchClick = () => {
    setMode('create');
    setEditingBranch(null);
    setBranchForm({ name: '', address: '', phone: '' });
  };

  // -------------------- Show the "Edit Branch" form --------------------
  const handleEditBranchClick = (branch) => {
    setMode('edit');
    setEditingBranch(branch);
    setBranchForm({
      name: branch.name || '',
      address: branch.address || '',
      phone: branch.phone || '',
    });
  };

  // -------------------- Handle form field changes --------------------
  const handleFormChange = (field) => (e) => {
    setBranchForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // -------------------- Save the new or updated branch --------------------
  const handleSave = async () => {
    try {
      if (mode === 'create') {
        // Create a new branch
        const created = await createBranch(branchForm);
        // Insert into local list
        setBranches((prev) => [...prev, created]);
      } else if (mode === 'edit' && editingBranch) {
        // Update existing
        const updated = await updateBranch(editingBranch._id, branchForm);
        // Reflect changes in local state
        setBranches((prev) =>
          prev.map((b) => (b._id === editingBranch._id ? updated : b))
        );
      }
      // Reset
      setMode('none');
      setEditingBranch(null);
      setBranchForm({ name: '', address: '', phone: '' });
    } catch (error) {
      console.error('Error saving branch:', error);
    }
  };

  // -------------------- Cancel form --------------------
  const handleCancel = () => {
    setMode('none');
    setEditingBranch(null);
    setBranchForm({ name: '', address: '', phone: '' });
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: '40%',
          padding: '20px',
          backgroundColor: '#fff',
        },
      }}
    >
      <Box>
        <Typography variant="h5" gutterBottom>
          Manage Branches
        </Typography>

        {/* LIST OF EXISTING BRANCHES */}
        <Typography variant="h6" sx={{ mt: 2 }}>
          Existing Branches:
        </Typography>
        {branches.length ? (
          <List>
            {branches.map((branch) => (
              <ListItem
                key={branch._id}
                secondaryAction={
                  <Button
                    variant="outlined"
                    onClick={() => handleEditBranchClick(branch)}
                  >
                    Edit
                  </Button>
                }
              >
                <ListItemText
                  primary={branch.name}
                  secondary={`${branch.address} | ${branch.phone}`}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>No branches found.</Typography>
        )}

        {/* ACTION BUTTONS */}
        <Box mt={2}>
          <Button variant="contained" onClick={handleAddBranchClick}>
            Add Branch
          </Button>
        </Box>

        {/* CONDITIONAL FORM FOR CREATE OR EDIT */}
        {mode !== 'none' && (
          <Box
            mt={3}
            p={2}
            sx={{ border: '1px solid #ccc', borderRadius: 2 }}
          >
            <Typography variant="h6" gutterBottom>
              {mode === 'create'
                ? 'Add New Branch'
                : `Edit Branch: ${editingBranch?.name}`}
            </Typography>
            <TextField
              label="Branch Name"
              fullWidth
              margin="normal"
              value={branchForm.name}
              onChange={handleFormChange('name')}
            />
            <TextField
              label="Address"
              fullWidth
              margin="normal"
              value={branchForm.address}
              onChange={handleFormChange('address')}
            />
            <TextField
              label="Phone"
              fullWidth
              margin="normal"
              value={branchForm.phone}
              onChange={handleFormChange('phone')}
            />

            <Box mt={2} display="flex" justifyContent="space-between">
              <Button onClick={handleCancel}>Cancel</Button>
              <Button variant="contained" onClick={handleSave}>
                Save
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default BranchDrawer;
