import React, { useState, useEffect } from 'react';



import {
  AppBar,
  Toolbar,
  Typography,
  TextField,
  Button,
  Drawer,
  Box,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  addPatient,
  getAllPatients,
  updatePatientDetails, // <-- import the update API
} from '../api';

// import BranchDrawer from './BranchDrawer'; 

// -------------------- Editable Patient Detail Drawer --------------------
const PatientDetailDrawer = ({ open, onClose, patient }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    address: '',
    phone_no: '',
    email: '',
  });

  // When `patient` changes, reset form data and exit edit mode
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

  // Update local form state for each field
  const handleFieldChange = (fieldName) => (e) => {
    setFormData({ ...formData, [fieldName]: e.target.value });
  };

  // Save edited data to the server
  const handleSave = async () => {
    if (!patient?._id) return;
    try {
      const updated = await updatePatientDetails(patient._id, formData);
      console.log('Updated patient:', updated);
      // Optionally close the drawer or stay open. For demonstration, we keep it open:
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating patient details:', error);
    }
  };

  // Cancel editing: revert changes
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
              // -------------------- EDIT MODE --------------------
              <Box>
                <TextField
                  label="Name"
                  fullWidth
                  margin="normal"
                  value={formData.name}
                  onChange={handleFieldChange('name')}
                />
                <TextField
                  label="DOB (YYYY-MM-DD)"
                  fullWidth
                  margin="normal"
                  value={formData.dob}
                  onChange={handleFieldChange('dob')}
                />
                {/* <DatePicker
                  label="Date of Birthh"
                  value={formData.dob ? dayjs(formData.dob) : null} // Convert `dob` to a Day.js object
                  onChange={(newValue) =>
                    setFormData({ ...formData, dob: newValue ? newValue.format('YYYY-MM-DD') : '' })
                  } // Format the selected date
                  renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                /> */}
                <TextField
                  label="Address"
                  fullWidth
                  margin="normal"
                  value={formData.address}
                  onChange={handleFieldChange('address')}
                />
                <TextField
                  label="Phone"
                  fullWidth
                  margin="normal"
                  value={formData.phone_no}
                  onChange={handleFieldChange('phone_no')}
                />
                <TextField
                  label="Email"
                  fullWidth
                  margin="normal"
                  value={formData.email}
                  onChange={handleFieldChange('email')}
                />

                <Box mt={2} display="flex" justifyContent="space-between">
                  <Button onClick={handleCancel}>Cancel</Button>
                  <Button variant="contained" onClick={handleSave}>
                    Save
                  </Button>
                </Box>
              </Box>
            ) : (
              // -------------------- VIEW MODE --------------------
              <Box>
                <Typography>
                  <strong>Name:</strong> {patient.name}
                </Typography>
                <Typography>
                  <strong>DOB:</strong> {patient.dob}
                </Typography>
                <Typography>
                  <strong>Address:</strong> {patient.address}
                </Typography>
                <Typography>
                  <strong>Phone:</strong> {patient.phone_no}
                </Typography>
                <Typography>
                  <strong>Email:</strong> {patient.email}
                </Typography>
                <Box mt={2}>
                  <Button
                    variant="contained"
                    onClick={() => setIsEditing(true)}
                  >
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

// -------------------- Add New Patient Side Panel --------------------
const NewPatientDrawer = ({
  open,
  onClose,
  onAddPatient,
  name,
  dob,
  address,
  phone,
  email,
  setName,
  setDob,
  setAddress,
  setPhone,
  setEmail,
}) => (
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
        Add New Patient
      </Typography>
      <TextField
        label="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Date of Birth (YYYY-MM-DD)"
        value={dob}
        onChange={(e) => setDob(e.target.value)}
        fullWidth
        margin="normal"
      />
      {/* <DatePicker
  label="Date of Birth"
  value={formData.dob ? dayjs(formData.dob) : null} // Convert `dob` to a Day.js object
  onChange={(newValue) =>
    setFormData({ ...formData, dob: newValue ? newValue.format('YYYY-MM-DD') : '' })
  } // Format the selected date
  renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
/> */}
      <TextField
        label="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Box mt={2} display="flex" justifyContent="space-between">
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onAddPatient}>
          Save
        </Button>
      </Box>
    </Box>
  </Drawer>
);

// -------------------- Main Navbar --------------------
const DentistNavbar = () => {
  // Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false);

  // New patient drawer state
  const [isNewPatientDrawerOpen, setIsNewPatientDrawerOpen] = useState(false);

  // New patient form fields
  const [newName, setNewName] = useState('');
  const [newDob, setNewDob] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');

  // -------------------- Handle search changes --------------------
  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (!value) {
      setSearchResults([]);
      return;
    }

    try {
      // Filter patients via API call with `search` param
      const patients = await getAllPatients(value);
      setSearchResults(patients);
      console.log('Search results:', patients);
    } catch (error) {
      console.error('Error searching patients:', error);
    }
  };

  const handleSearchSelect = (patient) => {
    setSelectedPatient(patient);
    setIsSearchDrawerOpen(true);
    setSearchTerm(patient.name);
    setSearchResults([]);
  };

  const handleSearchButtonClick = async () => {
    try {
      const allPatients = await getAllPatients(searchTerm);
      const exactMatch = allPatients.find(
        (p) => p.name.toLowerCase() === searchTerm.toLowerCase()
      );
      if (exactMatch) {
        handleSearchSelect(exactMatch);
      } else if (allPatients.length) {
        // If no exact match, pick the first or some fallback
        handleSearchSelect(allPatients[0]);
      }
    } catch (error) {
      console.error('Error on search button click:', error);
    }
  };

  // -------------------- Handle new patient creation --------------------
  const handleAddPatient = async () => {
    try {
      const newPatient = {
        name: newName,
        dob: newDob,
        address: newAddress,
        phone_no: newPhone,
        email: newEmail,
      };
      const created = await addPatient(newPatient);
      console.log('New patient added:', created);

      // Clear the form
      setNewName('');
      setNewDob('');
      setNewAddress('');
      setNewPhone('');
      setNewEmail('');
      setIsNewPatientDrawerOpen(false);

      // Optionally refresh the search or some other action
    } catch (error) {
      console.error('Error adding patient:', error);
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <AppBar position="static" sx={{ backgroundColor: '#2196f3' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Kankariya Dental          </Typography>
          <Box sx={{ position: 'relative', mr: 2 }}>
            <TextField
              size="small"
              variant="outlined"
              placeholder="Search patient name..."
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{ backgroundColor: '#fff', borderRadius: 1 }}
            />
            {searchResults.length > 0 && (
              <List
                sx={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  color: '#2196f3',
                  bgcolor: 'white',
                  zIndex: 4,
                  border: '1px solid #ccc',
                  maxHeight: 200,
                  overflowY: 'auto',
                }}
              >
                {searchResults.map((patient) => (
                  <ListItem
                    button
                    key={patient._id}
                    onClick={() => handleSearchSelect(patient)}
                  >
                    <ListItemText primary={patient.name} />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
          <Button
            variant="contained"
            onClick={handleSearchButtonClick}
            sx={{ mr: 2 }}
          >
            Search
          </Button>
          <Button
            variant="contained"
            onClick={() => setIsNewPatientDrawerOpen(true)}
          >
            New Patient
          </Button>
        </Toolbar>
      </AppBar>

      {/* Patient Detail (editable) */}
      <PatientDetailDrawer
        open={isSearchDrawerOpen}
        onClose={() => setIsSearchDrawerOpen(false)}
        patient={selectedPatient}
      />

      {/* New Patient Drawer */}
      <NewPatientDrawer
        open={isNewPatientDrawerOpen}
        onClose={() => setIsNewPatientDrawerOpen(false)}
        onAddPatient={handleAddPatient}
        name={newName}
        dob={newDob}
        address={newAddress}
        phone={newPhone}
        email={newEmail}
        setName={setNewName}
        setDob={setNewDob}
        setAddress={setNewAddress}
        setPhone={setNewPhone}
        setEmail={setNewEmail}
      />
    </>
  );
};

export default DentistNavbar;
