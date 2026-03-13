import React, { useContext, useState, useEffect, } from 'react'
import { AppContext } from "../context/AppContext"
import axios from 'axios'
import { API_ROUTES } from '../utils/routes'
import { toast } from 'react-toastify'
import { Calendar, Clock, MapPin, CreditCard, X } from 'lucide-react'
import { useNavigate} from 'react-router-dom'
const MyAppointment = () => {
  const { token,getAllDoctors } = useContext(AppContext)
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate=useNavigate()

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const parts = dateString.split('_')
    if (parts.length === 3) {
      const [day, month, year] = parts
      const date = new Date(year, month - 1, day)
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }
    return dateString
  }

  // Fetch user appointments
  const getUserAppointments = async () => {
    try {
      setLoading(true)
      const { data } = await axios.post(API_ROUTES.GET_APPOINTMENTS, {}, {
        headers: { token }
      })

      if (data.success) {
        setAppointments(data.appointments.reverse())
      } else {
        toast.error('Failed to load appointments')
      }
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'Error fetching appointments')
    } finally {
      setLoading(false)
    }
  }

  // Cancel appointment
  const cancelAppointment = async (appointmentId) => {
    try {
      setLoading(true)
      const { data } = await axios.post(API_ROUTES.CANCEL_APPOINTMENT, { appointmentId }, {
        headers: { token }
      })

      if (data.success) {
        toast.success('Appointment cancelled successfully')
        getUserAppointments()
        getAllDoctors()
        
      } else {
        toast.error('Failed to cancel appointment')
      }
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'Error cancelling appointment')
    } finally {
      setLoading(false)
    }
  }

  const initPay=(order)=>{
     const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Appointment App',
      description: 'Appointment Payment', 
      order_id: order.id,
      receipt:order.receipt,
      
      handler: async (response) =>{
           try {
             const{data}=await axios.post(API_ROUTES.VERIFY_PAYMENT,{
               razorpay_order_id: response.razorpay_order_id,
              
              },{
                headers:{token}
              })

              if(data.success){
                 toast.success('Payment verified successfully')
                getUserAppointments()
                navigate("/my-appointment")
              }else{
                toast.error('Payment verification failed')
           }
  } 

            catch(err){
              console.error(err)
              toast.error(err.message || 'Error verifying payment')
            }
      },
      theme: {
        color: '#2563EB',
      },
}
      const razorpay = new window.Razorpay(options);
      razorpay.open();
  }

  const AppointmentRazorpay=async(appointmentId)=>{
    try {
      setLoading(true)

     
      const { data } = await axios.post(API_ROUTES.PAYMENT_RAZORPAY, { appointmentId:appointmentId }, {
        headers: { token }
      })

      

      
      if (data.success) {
      initPay(data.order)
      } else {
        toast.error('payment error ')
      } 
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'Error processing payment')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    if (token) getUserAppointments()
  }, [token])

  // Status color styling
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200'
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-6">
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl h-32"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-6 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">My Appointments</h1>
          <p className="text-sm text-gray-600">Manage your upcoming and past appointments</p>
        </div>

        {/* No Appointments */}
        {appointments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No Appointments Yet</h3>
            <p className="text-sm text-gray-600">Book your first appointment to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="p-4">
                  <div className="flex flex-col lg:flex-row gap-4">
                    {/* Doctor Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.docData?.image || '/default-doctor.png'}
                        alt={item.docData?.name || 'Doctor'}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shadow-sm"
                      />
                    </div>

                    {/* Doctor Info */}
                    <div className="flex-1 space-y-2">
                      <div>
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                            {item.docData?.name || 'Unknown Doctor'}
                          </h3>
                          {item.status && (
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}
                            >
                              {item.status}
                            </span>
                          )}
                        </div>
                        <p className="text-blue-600 font-medium text-sm">
                          {item.docData?.speciality || 'General'}
                        </p>
                      </div>

                      {/* Address, Date, Time */}
                      <div className="grid sm:grid-cols-2 gap-3">
                        {/* Address */}
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-gray-700 mb-0.5">Address</p>
                            <p className="text-xs text-gray-600">{item.docData?.address?.line1}</p>
                            {item.docData?.address?.line2 && (
                              <p className="text-xs text-gray-600">{item.docData.address.line2}</p>
                            )}
                          </div>
                        </div>

                        {/* Date & Time */}
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-xs font-semibold text-gray-700">Date</p>
                              <p className="text-xs text-gray-600">{formatDate(item.slotDate)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-xs font-semibold text-gray-700">Time</p>
                              <p className="text-xs text-gray-600">{item.slotTime}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex lg:flex-col gap-2 lg:justify-center">
                    { !item.cancelled && !item.payment && <button className="flex-1 lg:flex-none bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium shadow-sm hover:shadow text-xs sm:text-sm flex items-center justify-center gap-1.5" onClick={()=>AppointmentRazorpay(item._id)}>
                        <CreditCard className="w-4 h-4" />
                        Pay Online
                      </button>
}

                    {  !item.cancelled && <button
                        className="flex-1 lg:flex-none bg-white text-red-600 border-2 border-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-all duration-300 font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5"
                        onClick={() => cancelAppointment(item._id)}
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
}
      
                     
                      {item?.cancelled && (
  <div className="bg-red-100 text-red-700 border border-red-300 px-4 py-2 rounded-md mt-4 text-sm font-medium">
    This appointment has been cancelled.
  </div>
)}

        {
         !item?.cancelled  && item?.payment && (
            <div className="bg-green-100 text-green-700 border border-green-300 px-4 py-2 rounded-md mt-4 text-sm font-medium">
            Payment Completed
          </div>
          )
        }

                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-4 py-2 border-t border-gray-100">
                  <p className="text-xs text-gray-600">
                    Appointment ID:{' '}
                    <span className="font-mono font-medium text-gray-900">
                      #{item._id?.slice(-8) || index}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyAppointment
