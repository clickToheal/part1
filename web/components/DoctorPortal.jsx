import React, { useState } from 'react';

const DoctorPortal = () => {
  const [appointments, setAppointments] = useState([
    { id: 1, patient: 'John Doe', status: 'pending', date: '2025-03-20', reason: 'Checkup' },
    { id: 2, patient: 'Jane Smith', status: 'scheduled', date: '2025-03-21', reason: 'Follow-up' }
  ]);
  const [pastRecords, setPastRecords] = useState([
    { patient: 'John Doe', visitDate: '2025-02-10', notes: 'Mild fever, prescribed medication' },
    { patient: 'Jane Smith', visitDate: '2025-01-15', notes: 'Routine checkup, all good' }
  ]);

  const updateAppointmentStatus = (id, newStatus) => {
    setAppointments(prev => prev.map(appt => appt.id === id ? { ...appt, status: newStatus } : appt));
  };

  return (
    <div style={styles.container}>
      <h2>Doctor Portal</h2>
      
      <div style={styles.section}>
        <h3>Upcoming Appointments</h3>
        {appointments.filter(appt => appt.status === 'pending').length === 0 && <p>No pending appointments.</p>}
        {appointments.filter(appt => appt.status === 'pending').map(appt => (
          <div key={appt.id} style={styles.card}>
            <p><strong>Patient:</strong> {appt.patient}</p>
            <p><strong>Date:</strong> {appt.date}</p>
            <p><strong>Reason:</strong> {appt.reason}</p>
            <button onClick={() => updateAppointmentStatus(appt.id, 'scheduled')} style={styles.button}>Approve</button>
            <button onClick={() => updateAppointmentStatus(appt.id, 'rejected')} style={styles.rejectButton}>Reject</button>
          </div>
        ))}
      </div>
      
      <div style={styles.section}>
        <h3>Scheduled Appointments</h3>
        {appointments.filter(appt => appt.status === 'scheduled').length === 0 && <p>No scheduled appointments.</p>}
        {appointments.filter(appt => appt.status === 'scheduled').map(appt => (
          <div key={appt.id} style={styles.card}>
            <p><strong>Patient:</strong> {appt.patient}</p>
            <p><strong>Date:</strong> {appt.date}</p>
            <p><strong>Reason:</strong> {appt.reason}</p>
          </div>
        ))}
      </div>
      
      <div style={styles.section}>
        <h3>Past Patient Records</h3>
        {pastRecords.length === 0 && <p>No past records found.</p>}
        {pastRecords.map((record, index) => (
          <div key={index} style={styles.card}>
            <p><strong>Patient:</strong> {record.patient}</p>
            <p><strong>Visit Date:</strong> {record.visitDate}</p>
            <p><strong>Notes:</strong> {record.notes}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '600px', margin: '20px auto', padding: '20px', fontFamily: 'Arial, sans-serif' },
  section: { marginBottom: '20px' },
  card: { padding: '10px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '10px' },
  button: { padding: '8px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', marginRight: '5px' },
  rejectButton: { padding: '8px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px' }
};

export default DoctorPortal;
