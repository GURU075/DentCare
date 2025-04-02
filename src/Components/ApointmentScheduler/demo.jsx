import React, { useState, useEffect, useCallback, memo } from 'react';
import Paper from '@mui/material/Paper';
import {
  ViewState,
  EditingState,
  IntegratedEditing,
} from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  WeekView,
  Appointments,
  AppointmentForm,
  AppointmentTooltip,
  DragDropProvider,
  Toolbar,
  DateNavigator,
  TodayButton,
  ConfirmationDialog,
} from '@devexpress/dx-react-scheduler-material-ui';

import {
  getAppointments,     // fetch appts for a given date
  createAppointment,    // create a new appt
  editAppointment,      // update an existing appt
  getAppointmentById,
  deleteAppointmentById   
} from '../../api';

// Import your custom BasicLayout for the AppointmentForm
import { BasicLayout } from './BasicLayout';

// import { CustomTooltipContent} from './CustomTooltipContent';

// -- A small helper to get today's date in YYYY-MM-DD
const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// const CustomAppointment = memo(({ children, style, ...restProps }) => {
//   const { data } = restProps;
//   const patientName = data?.patientId?.name || data?.patient_id?.name || '(No patient)';
//   const branchName = data?.branchId?.name || data?.branch_id?.name || '(No branch)';

//   return (
//     <div
//       style={{
//         ...style,
//         backgroundColor: '#4caf50',
//         color: '#fff',
//         borderRadius: '8px',
//         padding: '8px',
//         height: '100%',
//         overflow: 'hidden'
//       }}
//       {...restProps}
//     >
//       <strong>{data?.title || 'Appointment'}</strong>
//       <p style={{ margin: 0, fontSize: '12px' }}>Patient: {patientName}</p>
//       <p style={{ margin: 0, fontSize: '12px' }}>Branch: {branchName}</p>
//       {children}
//     </div>
//   );
// });
// -------------------- (A) Custom Tooltip Content --------------------
const CustomTooltipContent = ({ appointmentData, ...restProps }) => {
  const [fullDetail, setFullDetail] = useState(null);

  useEffect(() => {
    if (!appointmentData?.id) return;
    const fetchDetail = async () => {
      try {
        const detail = await getAppointmentById(appointmentData.id);
        setFullDetail(detail.data); // e.g. { _id, notes, patient_id: {...}, branch_id: {...}, ... }
      } catch (error) {
        console.error('Error fetching appointment detail:', error);
      }
    };
    fetchDetail();
  }, [appointmentData?.id]);

   const handleStatusUpdate = async () => {
      try {
        const updatedStatus = fullDetail.status === 'COMPLETED' ? 'UPCOMING' : 'COMPLETED';
        await editAppointment(appointmentData.id, { status: updatedStatus });
        setStatus(updatedStatus);
      } catch (error) {
        console.error('Error updating appointment status:', error);
      }
    };

  // While we don't have the full detail yet, just show a loading state
  if (!fullDetail) {
    return (
      <div style={{ padding: 16 }}>
        <p>Loading appointment details...</p>
      </div>
    );
  }

  // If your server populates "patient_id" and "branch_id" with { name } or something similar,
  // you can display them as below. Adjust field names as needed:
  const patientName = fullDetail.patient_id?.name || '(No patient)';
  const branchName = fullDetail.branch_id?.name || '(No branch)';

  return (
    <div style={{ padding: 16 }}>
      <h5>Appointment Details</h5>
      <p>
        <strong>Notes:</strong> {fullDetail.notes}
      </p>
      <p>
        <strong>Patient:</strong> {patientName}
      </p>
      <p>
        <strong>Branch:</strong> {branchName}
      </p>
      <p >
      <strong>Status:</strong> {fullDetail.status}
      </p>
      <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end', // Align the button to the row end
        marginTop: '10px',
      }}
    >
      <button
        onClick={handleStatusUpdate}
        style={{
          marginTop: '10px',
          padding: '8px 12px',
          backgroundColor: fullDetail.status === 'COMPLETED' ? '#f44336' : '#4caf50',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
        
      >
        Mark as {fullDetail.status === 'COMPLETED' ? 'Upcoming' : 'Completed'}
      </button>
      </div>
    </div>
  );
};

// -------------------- (B) Main Scheduler Component --------------------
const Demo = () => {
  const [data, setData] = useState([]);
  const [currentDate, setCurrentDate] = useState(getTodayDateString());

  // For new appointments in DevExpress
  const [addedAppointment, setAddedAppointment] = useState({});
  const [isAppointmentBeingCreated, setIsAppointmentBeingCreated] = useState(false);

  const fetchData1 = async () => {
    try {
      const response = await getAppointments(currentDate);
      const appointmentsFromServer = response.data;
  
      const mappedData = appointmentsFromServer.map((appt) => ({
        id: appt._id,
        title: appt.notes || 'Appointment',
        startDate: appt.start_time,
        endDate: appt.end_time,

        patientId: appt.patient_id,
        branchId: appt.branch_id,
      }));
      setData(mappedData);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  // -------------------- 1) Load appointments for currentDate --------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAppointments(currentDate);
        // If your API returns { data: [...] }, do response.data
        const appointmentsFromServer = response.data;

        const mappedData = appointmentsFromServer.map((appt) => ({
          id: appt._id,
          title: appt.notes || 'Appointment',
          startDate: appt.start_time,
          endDate: appt.end_time,
          patientId: appt.patient_id,
          branchId: appt.branch_id,
        }));
        setData(mappedData);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };
    fetchData();
  }, [currentDate]);

  // -------------------- 2) Handle DevExpress create/edit/delete commits --------------------
  const onCommitChanges = useCallback(
    async ({ added, changed, deleted }) => {
      // ----- (A) CREATE
      if (added) {
        try {
          const newAppt = {
            patient_id: added.patientId,
            branch_id: added.branchId,
            start_time: added.startDate,
            end_time: added.endDate,
            status: 'UPCOMING',
            notes: added.title || 'New Appointment',
          };
          const created = await createAppointment(newAppt);

          setData((prevData) => [
            ...prevData,
            {
              id: created._id,
              title: created.notes,
              startDate: created.start_time,
              endDate: created.end_time,
              patientId: created.patient_id,
              branchId: created.branch_id,
            },
          ]);
        } catch (error) {
          console.error('Error creating appointment:', error);
        }
      }

      // ----- (B) EDIT
      if (changed) {
        const changedId = Object.keys(changed)[0];
        const newFields = changed[changedId];

        try {
          const existing = data.find((d) => d.id === changedId);
          if (!existing) return;

          // Merge existing fields with new
          const updateData = {
            start_time: newFields.startDate || existing.startDate,
            end_time: newFields.endDate || existing.endDate,
            notes: newFields.title || existing.title,
            patient_id: newFields.patientId || existing.patientId,
            branch_id: newFields.branchId || existing.branchId,
          };

          const updated = await editAppointment(changedId, updateData);
          console.log('Updated appointment:', updated);
          const response =  await getAppointments(currentDate);
          const appointmentsFromServer = response.data;

        const mappedData = appointmentsFromServer.map((appt) => ({
          id: appt._id,
          title: appt.notes || 'Appointment',
          startDate: appt.start_time,
          endDate: appt.end_time,
          patientId: appt.patient_id,
          branchId: appt.branch_id,
        }));
        setData(mappedData);

          useEffect(()=>
            setIsAppointmentBeingCreated(false),[]
          );

            // Reflect changes in local state
          setData((prevData) =>
            prevData.map((appointment) =>
              appointment.id.toString() === changedId.toString()
                ? {
                    ...appointment,
                    title: updated.notes,
                    startDate: updated.start_time,
                    endDate: updated.end_time,
                    patientId: updated.patient_id,
                    branchId: updated.branch_id,
                  }
                : appointment
            )
          );
          
          // await fetchData1();
          // window.location.reload();
        } catch (error) {
          console.error('Error editing appointment:', error);
        }
      }

      // ----- (C) DELETE
      if (deleted !== undefined) {
        try {
          // Call the delete API
          await deleteAppointmentById(deleted);
  
          // Update local state
          setData((prevData) =>
            prevData.filter((appointment) => appointment.id !== deleted)
          );
        } catch (error) {
          console.error('Error deleting appointment:', error);
        }
      }

      setIsAppointmentBeingCreated(false);
    },
    [data]
  );

  // For creating new appointments
  const onAddedAppointmentChange = useCallback((appointment) => {
    setAddedAppointment(appointment);
    setIsAppointmentBeingCreated(true);
  }, []);

  // Allow double-click scheduling
  const TimeTableCell = useCallback(
    memo(({ onDoubleClick, ...restProps }) => (
      <WeekView.TimeTableCell {...restProps} onDoubleClick={onDoubleClick} />
    )),
    []
  );

  // Keep DevExpress default for the Save/Delete
  const CommandButton = useCallback(
    ({ id, ...restProps }) => (
      <AppointmentForm.CommandButton id={id} {...restProps} />
    ),
    []
  );

  // For drag/resize
  const allowDrag = useCallback(() => true, []);
  const allowResize = useCallback(() => true, []);

  // Changing the displayed date
  const handleCurrentDateChange = (date) => {
    setCurrentDate(date);
  };

  return (
    <Paper>
      <Scheduler data={data} height={600}>
        <ViewState
          currentDate={currentDate}
          onCurrentDateChange={handleCurrentDateChange}
        />
        <EditingState
          onCommitChanges={onCommitChanges}
          addedAppointment={addedAppointment}
          onAddedAppointmentChange={onAddedAppointmentChange}
        />
        <IntegratedEditing />

        <WeekView
          startDayHour={9}
          endDayHour={19}
          timeTableCellComponent={TimeTableCell}
        />
        <Toolbar />
        <DateNavigator />
        <TodayButton />
        {/* <Appointments appointmentComponent={CustomAppointment} /> */}
        <Appointments />

        {/* 
          (C) We replace the default tooltip content
          with our CustomTooltipContent so we can show
          the patient & branch name from getAppointmentById 
        */}
        <AppointmentTooltip
          showOpenButton
          showDeleteButton
          contentComponent={CustomTooltipContent}
        />

        <ConfirmationDialog />

        {/* 
          (D) Use our custom BasicLayout for the form
          so we can pick patient/branch when creating/editing
        */}
        <AppointmentForm
          basicLayoutComponent={BasicLayout}
          commandButtonComponent={CommandButton}
        />

        <DragDropProvider allowDrag={allowDrag} allowResize={allowResize} />
      </Scheduler>
    </Paper>
  );
};

export default Demo;
