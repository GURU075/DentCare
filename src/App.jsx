// App.jsx
import React, { useState } from 'react';
import './App.css';
import DentistNavbar from './Components/DentistNavbar'; 
import DentistDashboard from './Components/ApointmentScheduler/DASHBOARD';

const App = () => {
  // "Lifted" state for the search term
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div>
      {/* Navbar at the top */}
      <DentistNavbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* The main dashboard or calendar area */}
      <DentistDashboard
        searchTerm={searchTerm}
        // you could pass setSearchTerm here too if you want
      />
      
    </div>
  );
};

export default App;
