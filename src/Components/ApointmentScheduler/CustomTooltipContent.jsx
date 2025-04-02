import React, { useState } from 'react';
import { editAppointment } from '../../api'; // Ensure this API is implemented

const CustomTooltipContent = ({ appointmentData, ...restProps }) => {
  const [status, setStatus] = useState(appointmentData.status || 'UPCOMING');

  const handleStatusUpdate = async () => {
    try {
      const updatedStatus = status === 'COMPLETED' ? 'UPCOMING' : 'COMPLETED';
      await editAppointment(appointmentData.id, { status: updatedStatus });
      setStatus(updatedStatus);
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h5>Appointment Details</h5>
      <p>
        <strong>Notes:</strong> {appointmentData.notes}
      </p>
      <p>
        <strong>Status:</strong> {status}
      </p>
      <button
        onClick={handleStatusUpdate}
        style={{
          marginTop: '10px',
          padding: '8px 12px',
          backgroundColor: status === 'COMPLETED' ? '#f44336' : '#4caf50',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Mark as {status === 'COMPLETED' ? 'Upcoming' : 'Completed'}
      </button>
    </div>
  );
};

export default CustomTooltipContent;