import React, { useContext, useEffect, useState } from 'react';
import { Users, Calendar, Stethoscope, Clock } from 'lucide-react';
import { AdminContext } from "../../context/AdminContext.jsx"; 


const Dashboard = () => {
  const { admin_token, dashData, getAdminDashboardData, cancelAppointment } = useContext(AdminContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAdminDashboardData();
        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data.');
        setLoading(false);
      }
    };

    if (admin_token) fetchData();
  }, [admin_token]);

  const handleCancelAppointment = (id) => {
    cancelAppointment(id);
    getAdminDashboardData();
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  if (error || !dashData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">{error || 'No dashboard data available.'}</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard icon={<Stethoscope className="w-8 h-8 text-blue-600" />} label="Total Doctors" value={dashData.totalDoctors} bg="blue" />
        <StatCard icon={<Calendar className="w-8 h-8 text-green-600" />} label="Total Appointments" value={dashData.totalAppointments} bg="green" />
        <StatCard icon={<Users className="w-8 h-8 text-purple-600" />} label="Total Users" value={dashData.totalUser} bg="purple" />
      </div>

      {/* Latest Appointments */}
      <AppointmentTable
        appointments={dashData.latestAppointments}
        formatDate={formatDate}
        handleCancel={handleCancelAppointment}
      />
    </div>
  );
};

const StatCard = ({ icon, label, value, bg }) => (
  <div className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4">
    <div className={`bg-${bg}-100 p-3 rounded-full`}>{icon}</div>
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const AppointmentTable = ({ appointments, formatDate, handleCancel }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-2xl font-bold text-gray-800 mb-6">Latest Appointments</h2>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            {['Patient', 'Doctor', 'Date & Time', 'Amount', 'Status', 'Action'].map((head) => (
              <th key={head} className="px-4 py-3 text-left text-sm font-semibold text-gray-600">{head}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {appointments?.map((appointment) => (
            <tr key={appointment._id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="px-4 py-4">
                <UserInfo image={appointment.userData.image } name={appointment.userData.name} />
              </td>
              <td className="px-4 py-4">
                <DoctorInfo doc={appointment.docData} />
              </td>
              <td className="px-4 py-4">
                <DateTimeInfo date={appointment.slotDate} time={appointment.slotTime} formatDate={formatDate} />
              </td>
              <td className="px-4 py-4">
                <span className="text-sm font-semibold text-gray-800">${appointment.amount}</span>
              </td>
              <td className="px-4 py-4">
                <StatusBadge cancelled={appointment.cancelled} paid={appointment.payment} />
              </td>
              <td className="px-4 py-4">
                {!appointment.cancelled && (
                  <button
                    onClick={() => handleCancel(appointment._id)}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const UserInfo = ({ image, name }) => (
  <div className="flex items-center space-x-3">
    <img src={image} alt={name} className="w-10 h-10 rounded-full object-cover" />
    <span className="text-sm font-medium text-gray-800">{name}</span>
  </div>
);

const DoctorInfo = ({ doc }) => (
  <div className="flex items-center space-x-3">
    <img src={doc.image} alt={doc.name} className="w-10 h-10 rounded-full object-cover" />
    <div>
      <p className="text-sm font-medium text-gray-800">{doc.name}</p>
      <p className="text-xs text-gray-500">{doc.speciality}</p>
    </div>
  </div>
);

const DateTimeInfo = ({ date, time, formatDate }) => (
  <div className="flex items-center space-x-2">
    <Clock className="w-4 h-4 text-gray-400" />
    <div>
      <p className="text-sm text-gray-800">{formatDate(date)}</p>
      <p className="text-xs text-gray-500">{time}</p>
    </div>
  </div>
);

const StatusBadge = ({ cancelled, paid }) => (
  <div className="space-y-1">
    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
      cancelled ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
    }`}>
      {cancelled ? 'Cancelled' : 'Active'}
    </span>
    <br />
    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
      paid ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
    }`}>
      {paid ? 'Paid' : 'Unpaid'}
    </span>
  </div>
);

export default Dashboard;
