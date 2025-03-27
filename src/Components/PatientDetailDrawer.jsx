import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
} from '@mui/material';
import { updatePatientDetails } from '../api'; // Import the update API

// -------------------- Patient Details Side Panel (Editable) --------------------
const PatientDetailDrawer = ({ open, onClose, patient }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    address: '',
    phone_no: '',
    email: '',
  });

  // When patient prop changes, reset the form data and disable edit mode.
  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name || '',
        dob: patient.dob || '',
        address: patient.address || '',
        phone_no: patient.phone_no || '',
        email: patient.email || '',
      });
      setIsEditing(false);
    }
  }, [patient]);

  // Handle input changes in the text fields.
  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  // Save the updated details via the API.
  const handleSave = async () => {
    try {
      const updated = await updatePatientDetails(patient._id, formData);
      console.log('Patient updated:', updated);
      setIsEditing(false);
      // Optionally, you can call onClose() to close the drawer after saving.
    } catch (error) {
      console.error('Error updating patient details:', error);
    }
  };

  // Cancel editing and reset the form data.
  const handleCancel = () => {
    if (patient) {
      setFormData({
        name: patient.name || '',
        dob: patient.dob || '',
        address: patient.address || '',
        phone_no: patient.phone_no || '',
        email: patient.email || '',
      });
    }
    setIsEditing(false);
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: '35%',
          padding: '20px',
          backgroundColor: '#fff',
        },
      }}
    >
      <Box>
        <Typography variant="h5" gutterBottom>
          Patient Details
        </Typography>
        {patient ? (
          <>
            {isEditing ? (
              <Box>
                <TextField
                  label="Name"
                  fullWidth
                  margin="normal"
                  value={formData.name}
                  onChange={handleChange('name')}
                />
                <TextField
                  label="DOB (YYYY-MM-DD)"
                  fullWidth
                  margin="normal"
                  value={formData.dob}
                  onChange={handleChange('dob')}
                />
                <TextField
                  label="Address"
                  fullWidth
                  margin="normal"
                  value={formData.address}
                  onChange={handleChange('address')}
                />
                <TextField
                  label="Phone"
                  fullWidth
                  margin="normal"
                  value={formData.phone_no}
                  onChange={handleChange('phone_no')}
                />
                <TextField
                  label="Email"
                  fullWidth
                  margin="normal"
                  value={formData.email}
                  onChange={handleChange('email')}
                />
                <Box mt={2} display="flex" justifyContent="space-between">
                  <Button onClick={handleCancel}>Cancel</Button>
                  <Button variant="contained" onClick={handleSave}>
                    Save
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box>
                <Typography>
                  <strong>Name:</strong> {patient.name}
                </Typography>
                <Typography>
                  <strong>DOB:</strong> {patient.dob || 'N/A'}
                </Typography>
                <Typography>
                  <strong>Address:</strong> {patient.address || 'N/A'}
                </Typography>
                <Typography>
                  <strong>Phone:</strong> {patient.phone_no || 'N/A'}
                </Typography>
                <Typography>
                  <strong>Email:</strong> {patient.email || 'N/A'}
                </Typography>
                <Box mt={2}>
                  <Button variant="contained" onClick={() => setIsEditing(true)}>
                    Edit
                  </Button>
                </Box>
              </Box>
            )}
          </>
        ) : (
          <Typography>No patient selected.</Typography>
        )}
      </Box>
    </Drawer>
  );
};

export default PatientDetailDrawer;
