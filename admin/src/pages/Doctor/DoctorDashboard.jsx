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
    return (
      <div className="flex justify-center items-center h-screen text-slate-500 dark:text-slate-400 text-lg">
        Loading your insights...
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 bg-slate-50 dark:bg-slate-950 min-h-screen font-sans">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 m-0">
          Dashboard Overview
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Welcome back, here is what's happening today.
        </p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <StatCard title="Total Earnings" value={`₹${dashData.totalEarnings}`} icon="💰" colorClass="text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30" />
        <StatCard title="Appointments" value={dashData.totalAppointments} icon="📅" colorClass="text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30" />
        <StatCard title="Total Patients" value={dashData.totalPatients} icon="👥" colorClass="text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30" />
      </div>

      {/* Latest Appointments Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <h3 className="px-6 py-5 m-0 text-lg font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
          Latest Appointments
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {dashData.latestAppointments.map((appt, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img 
                        src={appt.userData?.image} 
                        alt="" 
                        className="w-10 h-10 rounded-full object-cover border-2 border-slate-100 dark:border-slate-700" 
                      />
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{appt.userData?.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{appt.userData?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-slate-700 dark:text-slate-300">{appt.slotDate}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{appt.slotTime}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">₹{appt.amount}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
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
const StatCard = ({ title, value, icon, colorClass }) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl flex items-center gap-5 shadow-sm border border-slate-200 dark:border-slate-700">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${colorClass}`}>
      {icon}
    </div>
    <div>
      <p className="m-0 text-sm text-slate-500 dark:text-slate-400 font-medium">{title}</p>
      <h3 className="m-0 mt-1 text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</h3>
    </div>
  </div>
);

const StatusBadge = ({ cancelled, completed }) => {
  if (cancelled) {
    return <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400">Cancelled</span>;
  }
  if (completed) {
    return <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400">Completed</span>;
  }
  return <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">Pending</span>;
};

export default DoctorDashboard;