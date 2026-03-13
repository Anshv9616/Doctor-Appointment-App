import React from 'react'
import {Routes,Route} from "react-router-dom"
import Home from './pages/Home.jsx'
import MyProfile from './pages/MyProfile.jsx'
import MyAppointment from './pages/MyAppointment.jsx'
import Doctors from './pages/Doctors.jsx'
import Login from './pages/Login.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Appointment from './pages/Appointment.jsx'
import NavBar from './components/NavBar.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import { ToastContainer, toast } from "react-toastify";
const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
        <ToastContainer/>
       <NavBar></NavBar>
    
      <Routes>
        <Route>
          <Route path='/' element={<Home/>}/>
          <Route path='/my-profile' element={<MyProfile/>}/>
          <Route path='/doctors/:speciality' element={<Doctors/>}/>  
          <Route path='/doctors' element={<Doctors/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/contact' element={<Contact/>}/>
          <Route path='/my-appointment' element={<MyAppointment/>}/>
          <Route path='/appointment/:docId' element={<Appointment/>}/>
        </Route>
         
        </Routes>
           <Footer/>
    </div>
  )
}

export default App