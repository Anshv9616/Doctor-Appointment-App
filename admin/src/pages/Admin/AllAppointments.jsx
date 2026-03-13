 import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'

const AllAppointments = () => {
  const { admin_token, appointments, getAllAppointments, cancelAppointment } = useContext(AdminContext)

  useEffect(() => {
    if (admin_token) getAllAppointments()
  }, [admin_token])

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">All Appointments</h2>
        <span className="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
          {appointments.length} Total
        </span>
      </div>
      
      <div className="grid gap-3">
        {appointments.map((appt) => {
          const { userData, docData, slotDate, slotTime, amount, cancelled } = appt
          return (
            <div 
              key={appt._id} 
              className={`border rounded-lg p-3 transition-all hover:shadow-md ${
                cancelled ? 'bg-gray-50 border-gray-300' : 'bg-white border-gray-200'
              }`}
            >
              <div className="grid grid-cols-12 gap-4 items-center">
                {/* Patient Info */}
                <div className="col-span-5 flex items-center gap-3">
                  <img
                    src={`data:image/png;base64,${userData.image}`}
                    alt={userData.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-gray-800 truncate">{userData.name}</p>
                    <p className="text-xs text-gray-500">DOB: {userData.dob}</p>
                    <p className="text-xs text-gray-600 flex items-center gap-1 mt-0.5">
                      <span className="text-blue-600">📅</span>
                      {slotDate.replace(/_/g, '/')} at {slotTime}
                    </p>
                  </div>
                </div>

                {/* Doctor Info */}
                <div className="col-span-4 text-center">
                  <p className="font-semibold text-sm text-gray-800">{docData.name}</p>
                  <p className="text-xs text-gray-500">{docData.speciality}</p>
                  <p className="text-xs font-medium text-green-600 mt-1">₹{amount}</p>
                </div>

                {/* Date & Time */}
                <div className="col-span-2 text-center">
                  <p className="text-xs text-gray-600">{slotDate.replace(/_/g, '/')}</p>
                  <p className="text-xs font-medium text-gray-800">{slotTime}</p>
                </div>

                {/* Action */}
                <div className="col-span-1 flex justify-center">
                  {cancelled ? (
                    <span className="text-xs font-medium text-red-500 bg-red-50 px-2 py-1 rounded">
                      Cancelled
                    </span>
                  ) : (
                    <button 
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-colors"
                      aria-label="Cancel appointment"
                      onClick={() => cancelAppointment(appt._id)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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