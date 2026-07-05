import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'

const AllAppointments = () => {
  const { admin_token, appointments, getAllAppointments, cancelAppointment } = useContext(AdminContext)

  useEffect(() => {
    if (admin_token) getAllAppointments()
  }, [admin_token])

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 m-0">All Appointments</h1>
        <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 text-sm font-semibold px-4 py-1.5 rounded-full">
          {appointments.length} Total
        </span>
      </div>
      
      <div className="grid gap-4">
        {appointments.map((appt) => {
          const { userData, docData, slotDate, slotTime, amount, cancelled } = appt
          return (
            <div 
              key={appt._id} 
              className={`rounded-2xl p-4 transition-all hover:shadow-md border ${
                cancelled ? 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-75' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="grid grid-cols-12 gap-4 items-center">
                {/* Patient Info */}
                <div className="col-span-12 md:col-span-4 flex items-center gap-4">
                  <img
                    src={userData.image || 'https://via.placeholder.com/150'}
                    alt={userData.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-slate-100 dark:border-slate-700 flex-shrink-0 bg-slate-100 dark:bg-slate-800"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/150' }}
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-[15px] text-slate-800 dark:text-slate-200 truncate">{userData.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">DOB: {userData.dob || 'N/A'}</p>
                    <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 mt-1 bg-indigo-50 dark:bg-indigo-900/30 w-fit px-2 py-0.5 rounded-md">
                      📅 {slotDate.replace(/_/g, '/')} at {slotTime}
                    </p>
                  </div>
                </div>

                {/* Doctor Info */}
                <div className="col-span-6 md:col-span-3 text-center border-l md:border-x border-slate-200 dark:border-slate-700">
                  <p className="font-bold text-sm text-slate-800 dark:text-slate-200">{docData.name}</p>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mt-0.5">{docData.speciality}</p>
                  <p className="text-sm font-bold text-green-600 dark:text-green-400 mt-1">₹{amount}</p>
                </div>

                {/* Date & Time */}
                <div className="col-span-6 md:col-span-3 text-center md:border-r border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Date & Time</p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-1">{slotDate.replace(/_/g, '/')}</p>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">{slotTime}</p>
                </div>

                {/* Action */}
                <div className="col-span-12 md:col-span-2 flex justify-center mt-4 md:mt-0">
                  {cancelled ? (
                    <span className="text-xs font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-3 py-1.5 rounded-full">
                      Cancelled
                    </span>
                  ) : (
                    <button 
                      className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 p-2.5 rounded-full transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-800"
                      aria-label="Cancel appointment"
                      onClick={() => cancelAppointment(appt._id)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AllAppointments