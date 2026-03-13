import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const AdminContext=createContext();

const AdminContextProvider=(props)=>{
     
       const [admin_token,setAdminToken]=useState(localStorage.getItem("admin_token")?localStorage.getItem("admin_token"):"")
       const backendUrl=import.meta.env.VITE_BACKEND_URL;
const[doctors,setDoctors]=useState([]);
     const [appointments,setAppointments]=useState([])
     const[dashData,setDashData]=useState(false)

        const getAllDoctors=async()=>{
              try{
            const {data} =   await axios.get(backendUrl + "/api/admin/doctor-list", {
  headers: { admin_token }
});


                 if(data.success){
                     setDoctors(data.doctors)
                     
                 }
                 else{
                      toast.success(data.message)
                 }
              }
              catch(err){
                  toast.error(err.message)
              }
        }
      const changeAvailability = async (docId) => {
  try {
    const { data } = await axios.post(
      `${backendUrl}/api/admin/change-availability`,
      { docId },
      {
        headers: { Authorization: `Bearer ${admin_token}` },
      }
    );

    if (data.success) {

      getAllDoctors()
      toast.success("Availability Changed");
    } else {
      toast.error("Failed to update availability");
    }
  } catch (err) {
    toast.error(err.response?.data?.message || err.message);
  }
};

    
    const getAllAppointments=async()=>{
      try{
        const {data}=await axios.get(backendUrl+"/api/admin/appointments",{
          headers:{admin_token}
        })
        if(data.success){
          setAppointments( data.appointments)
        } 
        else{
          toast.error(data.message)
        } 
      }
      catch(err){
        console.log(err);
        toast.error(err.message)
      } 
    }

    const cancelAppointment=async(appointmentId)=>{
      try{
        const {data}=await axios.post(backendUrl+"/api/admin/appointment-cancel",{appointmentId},{
          headers:{admin_token}
        })
        if(data.success){ 
          getAllAppointments()
          toast.success("Appointment Cancelled Successfully")
        } 
        else{
          toast.error(data.message)
        }   
      }
      catch(err){
        console.log(err);
        toast.error(err.message)
      }
    }

    const getAdminDashboardData=async()=>{
      try{
        const {data}=await axios.get(backendUrl+"/api/admin/dashboard-data",{
          headers:{admin_token}
        })
        if(data.success){
          setDashData(data)
        }
        else{
          toast.error(data.message)

      } 
    }

      catch(err){
        console.log(err);
        toast.error(err.message)
      }
    }
      const value={

        admin_token,setAdminToken,
        backendUrl,
        doctors,
        getAllDoctors,
        changeAvailability,
        appointments,
        getAllAppointments,
        setAppointments,
        cancelAppointment,
        dashData,
        getAdminDashboardData
          
      }
      return (
          <AdminContext.Provider value={value}>
            {props.children}
          </AdminContext.Provider>
      )
}

export default AdminContextProvider