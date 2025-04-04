import React, { useState, useEffect } from 'react';
import { AppointmentForm } from '@devexpress/dx-react-scheduler-material-ui';
import {
  Box,
  TextField,
  List,
  ListItem,
  ListItemText,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { getAllPatients, getAllBranches } from '../../api';

export const BasicLayout = ({
  onFieldChange,
  appointmentData,
  ...restProps
}) => {

  const defaultTitles = ["RCT", "Filling", "Cleaning", "Cap Measurement", "Cap Fixing", "Ortho"];
  const handleTitleChange = (e) => {
    onFieldChange({ title: e.target.value });
  };
  // -------------------- Patient live search --------------------
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // -------------------- Branch dropdown --------------------
  const [branches, setBranches] = useState([]);

  // Fetch branches once when the form opens
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const branchData = await getAllBranches();
        if (Array.isArray(branchData)) {
          setBranches(branchData);
        } else if (branchData && Array.isArray(branchData.data)) {
          setBranches(branchData.data);
        } else {
          console.error('getAllBranches returned a non-array:', branchData);
          setBranches([]);
        }
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    };
    fetchBranches();
  }, []);

  // -------------------- Patient search handlers --------------------
  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (!value) {
      setSearchResults([]);
      return;
    }
    try {
      const matchingPatients = await getAllPatients(value);
      setSearchResults(matchingPatients);
    } catch (error) {
      console.error('Error searching patients:', error);
    }
  };

  const handleSearchSelect = (patient) => {
    onFieldChange({ patientId: patient._id });
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
        handleSearchSelect(allPatients[0]);
      }
    } catch (error) {
      console.error('Error on search button click:', error);
    }
  };

  // -------------------- Branch dropdown handler --------------------
  const handleBranchChange = (e) => {
    onFieldChange({ branchId: e.target.value });
  };

  // Avoid passing an out-of-range value to MUI Select
  const branchValue = branches.find((b) => b._id === appointmentData.branchId)
    ? appointmentData.branchId
    : '';

  // -------------------- Render a fully custom layout --------------------
  return (
    <div style={{ padding: 16 }}>
        <Box sx={{ position: 'relative', mt: 2 , mb: 2}}>
        <TextField
          label="Search Patient..."
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {searchResults.length > 0 && (
          <List
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              bgcolor: 'white',
              border: '1px solid #ccc',
              maxHeight: 200,
              overflowY: 'auto',
              zIndex: 4,
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
         {appointmentData.patientId && (
        <Typography sx={{ mt: 1 }}>
          <strong>Selected Patient ID:</strong> {appointmentData.patientId}
        </Typography>
      )}
        </Box>
 
      {/* Start Date/Time */}

      <FormControl fullWidth margin="normal" sx={{ position: 'relative', mt: 2 , mb: 4}}>
        <InputLabel id="title-label">Select Title</InputLabel>
        <Select
          labelId="title-label"
          value={appointmentData.title || ""}
          onChange={handleTitleChange}
        >
          {defaultTitles.map((titleOption) => (
            <MenuItem key={titleOption} value={titleOption}>
              {titleOption}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box display="flex" gap={2}>
        <Box>
          <AppointmentForm.Label text="Start Date" type="dateTime" />
          <AppointmentForm.DateEditor
            value={appointmentData.startDate}
            onValueChange={(val) => onFieldChange({ startDate: val })}
          />
        </Box>
        <Box>
          <AppointmentForm.Label text="End Date" type="dateTime" />
          <AppointmentForm.DateEditor
            value={appointmentData.endDate}
            onValueChange={(val) => onFieldChange({ endDate: val })}
          />
        </Box>
      </Box>

     
       {/* Details (title) */}
       {/* <Box mt={2}>
        <AppointmentForm.Label text="Title" type="title" />
        <AppointmentForm.TextEditor
          type="title"
          placeholder="Enter title here....."
          value={appointmentData.title || ''}
          onValueChange={(val) => onFieldChange({ title: val })}
        />
      </Box> */}
      

      {/* More Information (notes) */}
      {/* <Box mt={2}>
        <AppointmentForm.Label text="More Information" type="notes" />
        <AppointmentForm.TextEditor
          type="multilineTextEditor"
          placeholder="Enter additional notes..."
          value={appointmentData.notes || ''}
          onValueChange={(val) => onFieldChange({ notes: val })}
        />
      </Box> */}

     

      {/* Patient search */}
      <Box sx={{ position: 'relative', mt: 2 }}>
        
      </Box>
      {/* <Button
        variant="contained"
        onClick={handleSearchButtonClick}
        sx={{ mt: 1 }}
      >
        Search Patient
      </Button> */}
     

      {/* Branch dropdown */}
      <FormControl fullWidth margin="normal">
        <InputLabel id="branch-label">Select Branch</InputLabel>
        <Select
          labelId="branch-label"
          value={branchValue}
          label="Select Branch"
          onChange={handleBranchChange}
        >
          {branches.map((branch) => (
            <MenuItem key={branch._id} value={branch._id}>
              {branch.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {appointmentData.branchId && (
        <Typography sx={{ mt: 1 }}>
          <strong>Selected Branch ID:</strong> {appointmentData.branchId}
        </Typography>
      )}
    </div>
  );
};
