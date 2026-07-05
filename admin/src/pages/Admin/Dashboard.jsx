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
      <div className="flex items-center justify-center h-64 text-slate-500 dark:text-slate-400">
        Loading dashboard...
      </div>
    );
  }

  if (error || !dashData) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500 dark:text-red-400">
        {error || 'No dashboard data available.'}
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 min-h-screen">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-8">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard icon={<Stethoscope className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />} label="Total Doctors" value={dashData.totalDoctors} bg="bg-indigo-100 dark:bg-indigo-900/30" />
        <StatCard icon={<Calendar className="w-8 h-8 text-green-600 dark:text-green-400" />} label="Total Appointments" value={dashData.totalAppointments} bg="bg-green-100 dark:bg-green-900/30" />
        <StatCard icon={<Users className="w-8 h-8 text-orange-600 dark:text-orange-400" />} label="Total Users" value={dashData.totalUser} bg="bg-orange-100 dark:bg-orange-900/30" />
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
  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex items-center space-x-4">
    <div className={`${bg} p-3 rounded-full`}>{icon}</div>
    <div>
      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{label}</p>
      <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
    </div>
  </div>
);

const AppointmentTable = ({ appointments, formatDate, handleCancel }) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 px-6 py-5 m-0 border-b border-slate-200 dark:border-slate-700">Latest Appointments</h2>
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 dark:bg-slate-900/50">
          <tr>
            {['Patient', 'Doctor', 'Date & Time', 'Amount', 'Status', 'Action'].map((head) => (
              <th key={head} className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{head}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {appointments?.map((appointment) => (
            <tr key={appointment._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <UserInfo image={appointment.userData.image } name={appointment.userData.name} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <DoctorInfo doc={appointment.docData} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <DateTimeInfo date={appointment.slotDate} time={appointment.slotTime} formatDate={formatDate} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">${appointment.amount}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge cancelled={appointment.cancelled} paid={appointment.payment} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {!appointment.cancelled && (
                  <button
                    onClick={() => handleCancel(appointment._id)}
                    className="px-3 py-1.5 text-xs font-semibold border border-red-300 text-red-600 bg-white dark:bg-slate-800 dark:border-red-800 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
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
    <img src={image} alt={name} className="w-10 h-10 rounded-full object-cover border-2 border-slate-100 dark:border-slate-700" />
    <span className="font-semibold text-slate-800 dark:text-slate-200">{name}</span>
  </div>
);

const DoctorInfo = ({ doc }) => (
  <div className="flex items-center space-x-3">
    <img src={doc.image} alt={doc.name} className="w-10 h-10 rounded-full object-cover border-2 border-slate-100 dark:border-slate-700" />
    <div>
      <p className="font-semibold text-slate-800 dark:text-slate-200">{doc.name}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">{doc.speciality}</p>
    </div>
  </div>
);

const DateTimeInfo = ({ date, time, formatDate }) => (
  <div className="flex items-center space-x-2">
    <Clock className="w-4 h-4 text-slate-400" />
    <div>
      <p className="text-sm text-slate-700 dark:text-slate-300">{formatDate(date)}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">{time}</p>
    </div>
  </div>
);

const StatusBadge = ({ cancelled, paid }) => (
  <div className="space-y-1.5">
    <span className={`inline-block px-2.5 py-0.5 text-[11px] font-semibold rounded-full ${
      cancelled ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    }`}>
      {cancelled ? 'Cancelled' : 'Active'}
    </span>
    <br />
    <span className={`inline-block px-2.5 py-0.5 text-[11px] font-semibold rounded-full ${
      paid ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
    }`}>
      {paid ? 'Paid' : 'Unpaid'}
    </span>
  </div>
);

export default Dashboard;
