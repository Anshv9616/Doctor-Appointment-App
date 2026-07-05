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
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/50'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800/50'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50'
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50'
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen px-4 py-6">
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/50 dark:bg-slate-800/50 rounded-3xl h-36"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 relative">
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2 tracking-tight">My Appointments</h1>
          <p className="text-sm text-gray-600 dark:text-slate-400">Manage your upcoming and past appointments</p>
        </div>

        {/* No Appointments */}
        {appointments.length === 0 ? (
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-slate-700/50 p-10 text-center">
            <div className="w-20 h-20 bg-primary/10 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-10 h-10 text-primary dark:text-primary-light" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-2">No Appointments Yet</h3>
            <p className="text-gray-600 dark:text-slate-400">Book your first appointment to get started.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {appointments.map((item, index) => (
              <div
                key={index}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden border border-white/40 dark:border-slate-700/50"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Doctor Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.docData?.image || '/default-doctor.png'}
                        alt={item.docData?.name || 'Doctor'}
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shadow-sm bg-primary/5 dark:bg-slate-700"
                      />
                    </div>

                    {/* Doctor Info */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-slate-100 tracking-tight">
                            {item.docData?.name || 'Unknown Doctor'}
                          </h3>
                          {item.status && (
                            <span
                              className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${getStatusColor(item.status)}`}
                            >
                              {item.status}
                            </span>
                          )}
                        </div>
                        <p className="text-primary dark:text-primary-light font-bold text-sm tracking-wide uppercase">
                          {item.docData?.speciality || 'General'}
                        </p>
                      </div>

                      {/* Address, Date, Time */}
                      <div className="grid sm:grid-cols-2 gap-4 mt-2">
                        {/* Address */}
                        <div className="flex items-start gap-2.5">
                          <MapPin className="w-5 h-5 text-gray-400 dark:text-slate-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1">Address</p>
                            <p className="text-sm text-gray-600 dark:text-slate-400">{item.docData?.address?.line1}</p>
                            {item.docData?.address?.line2 && (
                              <p className="text-sm text-gray-600 dark:text-slate-400 mt-0.5">{item.docData.address.line2}</p>
                            )}
                          </div>
                        </div>

                        {/* Date & Time */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2.5">
                            <Calendar className="w-5 h-5 text-gray-400 dark:text-slate-500" />
                            <div>
                              <p className="text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider">Date</p>
                              <p className="text-sm font-medium text-gray-800 dark:text-slate-200">{formatDate(item.slotDate)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <Clock className="w-5 h-5 text-gray-400 dark:text-slate-500" />
                            <div>
                              <p className="text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider">Time</p>
                              <p className="text-sm font-medium text-gray-800 dark:text-slate-200">{item.slotTime}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex lg:flex-col gap-3 lg:justify-center lg:min-w-[140px]">
                    { !item.cancelled && !item.payment && <button className="flex-1 lg:flex-none bg-gradient-to-br from-primary to-indigo-500 text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all duration-300 font-bold text-sm flex items-center justify-center gap-2 border-none cursor-pointer" onClick={()=>AppointmentRazorpay(item._id)}>
                        <CreditCard className="w-4 h-4" />
                        Pay Online
                      </button>
                    }

                    {  !item.cancelled && <button
                        className="flex-1 lg:flex-none bg-white/50 dark:bg-slate-800/50 text-red-600 dark:text-red-400 border-[1.5px] border-red-200 dark:border-red-900/50 px-5 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-300 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
                        onClick={() => cancelAppointment(item._id)}
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    }
      
                     
                      {item?.cancelled && (
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50 px-4 py-2.5 rounded-xl text-xs font-bold text-center">
                          Cancelled
                        </div>
                      )}

                      { !item?.cancelled  && item?.payment && (
                        <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800/50 px-4 py-2.5 rounded-xl text-xs font-bold text-center">
                          Paid
                        </div>
                      )}

                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50/50 dark:bg-slate-900/30 px-6 py-3 border-t border-gray-100 dark:border-slate-700">
                  <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                    Appointment ID:{' '}
                    <span className="font-mono font-bold text-gray-800 dark:text-slate-200 ml-1">
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
