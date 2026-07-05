import React from 'react'
import { assets } from '../assets/assets_frontend/assets'
import{useNavigate} from "react-router-dom"

const Banner = () => {
    const navigate=useNavigate();
  return (
    <div className='flex bg-gradient-to-br from-primary via-indigo-600 to-purple-600 rounded-[2.5rem] px-6 sm:px-14 lg:px-16 my-24 md:mx-10 shadow-2xl shadow-primary/20 overflow-hidden relative'>
      <div className="absolute inset-0 bg-white/5 mix-blend-overlay"></div>
      
      {/* Left */}
      <div className='flex-1 py-10 sm:py-14 md:py-20 lg:py-24 relative z-10'>
          <div className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight'>
              <p>Book Appointment</p>
              <p className='mt-2 text-white/90'>With 100+ Trusted Doctors</p>
          </div>

          <button 
            className='bg-white/95 backdrop-blur-sm text-primary font-bold text-sm uppercase tracking-wider px-10 py-4 rounded-full mt-8 hover:bg-white hover:scale-105 hover:shadow-xl hover:shadow-white/20 transition-all duration-300 cursor-pointer' 
            onClick={()=>{navigate("/login"); scrollTo(0,0);}}
          >
            Create account
          </button>
      </div>
      
      {/* Right */}
      <div className='hidden md:block md:w-1/2 lg:w-[400px] relative'>
          <img className='w-full absolute bottom-0 right-0 max-w-md transition-transform duration-700 hover:scale-105 origin-bottom' src={assets.appointment_img} alt="Appointment" />
      </div>

    </div>
  )
}

export default Banner