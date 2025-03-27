import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  FaCalendarAlt,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaNotesMedical,
  FaStethoscope,
  FaBriefcaseMedical,
  FaFileInvoiceDollar,
} from 'react-icons/fa';

// 1) Import your API function:
import { getAllPatients } from '../../api'; // Adjust the import path as needed
import Demo from './demo'; // This is your AppointmentScheduler (renamed "Demo") or any other component

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // ---- Handle typing into search box ----
  const handleInputChange = async (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value) {
      try {
        // 2) Call your backend to fetch matching patients
        const results = await getAllPatients(value);
        setSearchResults(results);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  // ---- Handle picking a patient from the dropdown ----
  const handlePatientSelect = (patient) => {
    setSearchTerm(patient.name);
    setSearchResults([]);
    setSelectedPatient(patient);
  };

  return (
    <>

      {/* SELECTED PATIENT DETAILS */}
      {selectedPatient && (
        <div className="mt-3 p-4 border rounded">
          <h4>Patient Details</h4>
          <hr />
          <div className="row">
            <div className="col-md-6">
              <p>
                <FaUser className="me-2" /> <strong>Name:</strong>{' '}
                {selectedPatient.name}
              </p>
              <p>
                <FaCalendarAlt className="me-2" />{' '}
                <strong>Date of Birth:</strong>{' '}
                {selectedPatient.dob || 'N/A'}
              </p>
              <p>
                <FaPhone className="me-2" /> <strong>Phone:</strong>{' '}
                {selectedPatient.phone || selectedPatient.phone_no || 'N/A'}
              </p>
              <p>
                <FaMapMarkerAlt className="me-2" /> <strong>Address:</strong>{' '}
                {selectedPatient.address || 'N/A'}
              </p>
              <p>
                <FaStethoscope className="me-2" />{' '}
                <strong>Medical Conditions:</strong>{' '}
                {selectedPatient.medicalConditions?.length
                  ? selectedPatient.medicalConditions.join(', ')
                  : 'None'}
              </p>
              <p>
                <FaBriefcaseMedical className="me-2" /> <strong>Allergies:</strong>{' '}
                {selectedPatient.allergies?.length
                  ? selectedPatient.allergies.join(', ')
                  : 'None'}
              </p>
              <p>
                <FaNotesMedical className="me-2" /> <strong>Medications:</strong>{' '}
                {selectedPatient.medications?.length
                  ? selectedPatient.medications.join(', ')
                  : 'None'}
              </p>
            </div>
            <div className="col-md-6">
              <p>
                <FaCalendarAlt className="me-2" /> <strong>Last Visit:</strong>{' '}
                {selectedPatient.lastVisit || 'N/A'}
              </p>
              <p>
                <FaFileInvoiceDollar className="me-2" />{' '}
                <strong>Outstanding Balance:</strong> $
                {selectedPatient.outstandingBalance
                  ? selectedPatient.outstandingBalance.toFixed(2)
                  : '0.00'}
              </p>
              <h5>Past Appointments:</h5>
              {selectedPatient.pastAppointments?.length ? (
                <ul className="list-unstyled">
                  {selectedPatient.pastAppointments.map((appointment, index) => (
                    <li key={index}>
                      {appointment.date}: {appointment.treatment} - {appointment.notes}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No past appointments.</p>
              )}

              <h5>Upcoming Appointments:</h5>
              {selectedPatient.upcomingAppointments?.length ? (
                <ul className="list-unstyled">
                  {selectedPatient.upcomingAppointments.map((appointment, index) => (
                    <li key={index}>
                      {appointment.date}: {appointment.treatment}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No upcoming appointments.</p>
              )}
            </div>
          </div>
          <hr />
          <p>
            <FaNotesMedical className="me-2" />
            <strong>Notes:</strong> {selectedPatient.notes || 'N/A'}
          </p>
        </div>
      )}

      {/* The "Demo" (Scheduler) component below */}
      <Demo />
    </>
  );
};

export default SearchBar;
