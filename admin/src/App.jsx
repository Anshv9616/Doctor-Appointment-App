import React, { useContext } from 'react'
import Login from './pages/Login'
  import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
import { AdminContext } from './context/AdminContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Routes,Route } from 'react-router-dom';
import Dashboard from "../src/pages/Admin/Dashboard"
import AllAppointments from "../src/pages/Admin/AllAppointments"
import AddDoctors from "../src/pages/Admin/AddDoctors"
import DoctorList from "../src/pages/Admin/DoctorsList"
import { DoctorContext } from './context/DoctorContext';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorAppointment from './pages/Doctor/DoctorAppointment';
import DoctorProfile from './pages/Doctor/DoctorProfile';
const App = () => {

  const {admin_token}=useContext(AdminContext)
  const {doctor_token}=useContext(DoctorContext)
  return admin_token || doctor_token ? (
        <div className='bg-[#F8F9FD]'>
        <ToastContainer/>
        <Navbar/>
        <div className='flex items-start'>
           <Sidebar />

           <Routes>
            <Route path="/" element={<></>}/>
              <Route path="/admin-dashboard" element={<Dashboard/>}/>
                <Route path="/all-appointments" element={<AllAppointments/>}/>
                  <Route path="/add-doctor" element={<AddDoctors/>}/>
                 <Route path="/doctor-list" element={<DoctorList/>}/>
                 //doctor routes

                  <Route path="/doctor-dashboard" element={<DoctorDashboard/>}/>
                  <Route path="/doctor-appointments" element={<DoctorAppointment/>}/>
                   <Route path="/doctor-profile" element={<DoctorProfile/>}/>
           
        
           </Routes>

        </div>
        </div>
  ):(
     <>
      <Login/>
      <ToastContainer/>
     </>
  )
}

export default App