import React, { useContext, useEffect } from 'react';
import { DoctorContext } from '../../context/DoctorContext';

const DoctorDashboard = () => {
  const { dashData, doctorDashboard, doctor_token } = useContext(DoctorContext);

  useEffect(() => {
    if (doctor_token) {
      doctorDashboard?.();
    }
  }, [doctor_token]);

  if (!dashData) {
    return <div style={loaderStyle}>Loading your insights...</div>;
  }

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h2 style={{ margin: 0, fontSize: '24px', color: '#1a202c' }}>Dashboard Overview</h2>
        <p style={{ color: '#718096', marginTop: '4px' }}>Welcome back, here is what's happening today.</p>
      </header>

      {/* Summary Cards */}
      <div style={statsGridStyle}>
        <StatCard title="Total Earnings" value={`₹${dashData.totalEarnings}`} icon="💰" color="#4C51BF" />
        <StatCard title="Appointments" value={dashData.totalAppointments} icon="📅" color="#38A169" />
        <StatCard title="Total Patients" value={dashData.totalPatients} icon="👥" color="#DD6B20" />
      </div>

      {/* Latest Appointments Section */}
      <div style={tableContainerStyle}>
        <h3 style={{ padding: '20px', margin: 0, borderBottom: '1px solid #edf2f7' }}>Latest Appointments</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr style={{ backgroundColor: '#f7fafc' }}>
                <th style={thStyle}>Patient</th>
                <th style={thStyle}>Date & Time</th>
                <th style={thStyle}>Amount</th>
                <th style={thStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {dashData.latestAppointments.map((appt, idx) => (
                <tr key={idx} style={trStyle}>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img 
                        src={appt.userData?.image} 
                        alt="" 
                        style={avatarStyle} 
                      />
                      <div>
                        <div style={{ fontWeight: '600', color: '#2d3748' }}>{appt.userData?.name}</div>
                        <div style={{ fontSize: '12px', color: '#a0aec0' }}>{appt.userData?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ color: '#4a5568' }}>{appt.slotDate}</div>
                    <div style={{ fontSize: '12px', color: '#718096' }}>{appt.slotTime}</div>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ fontWeight: '600' }}>₹{appt.amount}</span>
                  </td>
                  <td style={tdStyle}>
                    <StatusBadge 
                      cancelled={appt.cancelled} 
                      completed={appt.isCompleted} 
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Sub-components for cleaner code
const StatCard = ({ title, value, icon, color }) => (
  <div style={cardStyle}>
    <div style={{ ...iconCircle, backgroundColor: `${color}15`, color: color }}>{icon}</div>
    <div>
      <p style={{ margin: 0, fontSize: '14px', color: '#718096', fontWeight: '500' }}>{title}</p>
      <h3 style={{ margin: '4px 0 0 0', fontSize: '22px', color: '#2d3748' }}>{value}</h3>
    </div>
  </div>
);

const StatusBadge = ({ cancelled, completed }) => {
  let styles = {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    display: 'inline-block'
  };

  if (cancelled) {
    styles = { ...styles, backgroundColor: '#FFF5F5', color: '#C53030' };
    return <span style={styles}>Cancelled</span>;
  }
  if (completed) {
    styles = { ...styles, backgroundColor: '#F0FFF4', color: '#2F855A' };
    return <span style={styles}>Completed</span>;
  }
  styles = { ...styles, backgroundColor: '#EBF8FF', color: '#2B6CB0' };
  return <span style={styles}>Pending</span>;
};

// --- Styles ---
const containerStyle = {
  padding: "30px",
  backgroundColor: "#f8fafc",
  minHeight: "100vh",
  fontFamily: "'Inter', system-ui, sans-serif"
};

const headerStyle = {
  marginBottom: "30px"
};

const statsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "24px",
  marginBottom: "40px"
};

const cardStyle = {
  background: "#fff",
  padding: "24px",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  gap: "20px",
  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.06)"
};

const iconCircle = {
  width: "48px",
  height: "48px",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "20px"
};

const tableContainerStyle = {
  background: "#fff",
  borderRadius: "12px",
  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
  border: "1px solid #edf2f7"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  textAlign: "left"
};

const thStyle = {
  padding: "16px 20px",
  fontSize: "13px",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: "#718096",
  fontWeight: "600"
};

const tdStyle = {
  padding: "16px 20px",
  borderTop: "1px solid #edf2f7",
  fontSize: "14px",
  verticalAlign: "middle"
};

const trStyle = {
  transition: "background 0.2s"
};

const avatarStyle = {
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  objectFit: "cover",
  border: "2px solid #edf2f7"
};

const loaderStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  color: "#718096",
  fontSize: "18px"
};

export default DoctorDashboard;