import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { Calendar, Clock, DollarSign, User, X, CheckCircle } from 'lucide-react';

export default function DoctorAppointment() {
  const { appointments, doctor_token, getAppointements, completeAppointment, cancelAppointment } = useContext(DoctorContext);
  const [loadingId, setLoadingId] = useState(null);

  // optimistic local status map: { [appointmentId]: 'completed' | 'cancelled' }
  const [updatedStatus, setUpdatedStatus] = useState({});

  useEffect(() => {
    getAppointements?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    console.log(appointments)
  }, [doctor_token]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const [day, month, year] = dateStr.split('_');
    return `${day}/${month}/${year}`;
  };

  const handleCancel = async (appointmentId) => {
    const prev = updatedStatus[appointmentId];
    try {
      setLoadingId(appointmentId);

      // optimistic UI: mark as cancelled immediately
      setUpdatedStatus((s) => ({ ...s, [appointmentId]: 'cancelled' }));

      await cancelAppointment?.(appointmentId);

      // refetch or let parent update
      getAppointements?.();
    } catch (err) {
      console.error('Cancel error', err);
      // revert optimistic change on error
      setUpdatedStatus((s) => {
        const copy = { ...s };
        if (prev === undefined) delete copy[appointmentId];
        else copy[appointmentId] = prev;
        return copy;
      });
    } finally {
      setLoadingId(null);
    }
  };

  const handleApprove = async (appointmentId) => {
    const prev = updatedStatus[appointmentId];
    try {
      setLoadingId(appointmentId);

      // optimistic UI: mark as completed immediately
      setUpdatedStatus((s) => ({ ...s, [appointmentId]: 'completed' }));

      await completeAppointment?.(appointmentId);

      getAppointements?.();
    } catch (err) {
      console.error('Approve error', err);
      // revert optimistic change on error
      setUpdatedStatus((s) => {
        const copy = { ...s };
        if (prev === undefined) delete copy[appointmentId];
        else copy[appointmentId] = prev;
        return copy;
      });
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-slate-100">My Appointments</h1>

      {appointments && appointments.length > 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-gray-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 border-b border-gray-200 dark:border-slate-700">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-slate-300">Patient</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-slate-300">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-slate-300">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-slate-300">Time</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-slate-300">Fees</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-slate-300">Payment</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-slate-300">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                {appointments.map((appointment) => {
                  // support multiple possible fields (from your sample)
                  const isCancelled = !!appointment.cancelled || updatedStatus[appointment._id] === 'cancelled';
                  const isPaid = !!appointment.payment;
                  const isCompleted =
                    !!appointment.isCompleted ||
                    !!appointment.completed ||
                    appointment.status === 'completed' ||
                    updatedStatus[appointment._id] === 'completed';

                  const patient = appointment.userData || appointment.user || {};

                  return (
                    <tr key={appointment._id} className="hover:bg-gray-50 dark:hover:bg-slate-750 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <User className="w-5 h-5 text-primary flex-shrink-0" />
                          <span className="font-medium text-gray-800 dark:text-slate-200">{patient.name || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="text-gray-700 dark:text-slate-300">{patient.email || 'No email'}</div>
                          <div className="text-gray-500 dark:text-slate-400">{patient.phone || 'No phone'}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-700 dark:text-slate-300">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span className="text-sm">{formatDate(appointment.slotDate)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-700 dark:text-slate-300">
                          <Clock className="w-4 h-4 text-primary" />
                          <span className="text-sm">{appointment.slotTime || '-'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-700 dark:text-slate-300">
                          <DollarSign className="w-4 h-4 text-primary" />
                          <span className="text-sm font-bold">${appointment.amount ?? '0'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {isPaid ? (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            ✓ Paid
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-300">
                            Offline
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {isCancelled ? (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            Cancelled
                          </span>
                        ) : isCompleted ? (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            Completed
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            Scheduled
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-center">
                          {/* Show buttons only if NOT cancelled and NOT completed (including optimistic updates) */}
                          {!isCancelled && !isCompleted && (
                            <>
                              <button
                                onClick={() => handleApprove(appointment._id)}
                                disabled={loadingId === appointment._id}
                                className="inline-flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg text-sm font-semibold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-sm transition-all duration-150 disabled:opacity-50"
                                aria-label={`Approve appointment ${appointment._id}`}
                              >
                                <CheckCircle className="w-4 h-4" />
                                Approve
                              </button>
                              <button
                                onClick={() => handleCancel(appointment._id)}
                                disabled={loadingId === appointment._id}
                                className="inline-flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg text-sm font-semibold bg-white border border-red-300 hover:bg-red-50 text-red-600 transition-all duration-150 disabled:opacity-50"
                                aria-label={`Cancel appointment ${appointment._id}`}
                              >
                                <X className="w-4 h-4" />
                                Cancel
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-slate-500" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-slate-300 mb-2">No Appointments Yet</h3>
          <p className="text-gray-500 dark:text-slate-400">Your appointments will appear here once patients book with you.</p>
        </div>
      )}
    </div>
  );
}
