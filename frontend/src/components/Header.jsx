import React from 'react'
import { assets } from '../assets/assets_frontend/assets'

const Header = () => {
  return (
    <div className='flex flex-col md:flex-row flex-wrap bg-gradient-to-br from-primary via-indigo-600 to-purple-600 rounded-[2.5rem] px-6 md:px-10 lg:px-20 shadow-2xl shadow-primary/20 overflow-hidden mb-16 relative'>
        <div className="absolute inset-0 bg-[url('/path/to/noise-pattern.png')] opacity-10 mix-blend-overlay"></div>
        
        {/* Left Side */}
        <div className='md:w-1/2 flex flex-col items-start justify-center gap-6 py-12 md:py-[8vw] md:mb-[-30px] relative z-10'>
            <h1 className='text-4xl md:text-5xl lg:text-6xl text-white font-bold leading-[1.1] tracking-tight'>
                Book Appointment <br />
                <span className="text-white/90">with Trusted Doctors</span>
            </h1>

            <div className='flex flex-col sm:flex-row items-center gap-4 text-white/90 text-[15px] font-medium leading-relaxed'>
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 bg-white/20 blur-xl rounded-full"></div>
                  <img src={assets.group_profiles} alt="Profiles" className='w-32 relative z-10' />
                </div>
                <p className="text-center sm:text-left">
                  Simply browse through our extensive list of trusted doctors,<br className='hidden sm:block'/>
                  schedule your appointment hassle-free.
                </p>
            </div>
            
            <a 
              href="#speciality" 
              className='flex items-center gap-3 bg-white/95 backdrop-blur-md px-10 py-4 rounded-full text-primary font-bold text-sm uppercase tracking-wider m-auto md:m-0 hover:bg-white hover:scale-105 hover:shadow-xl hover:shadow-white/20 transition-all duration-300'
            >
              Book appointment 
              <img src={assets.arrow_icon} className='w-3.5 transition-transform duration-300 group-hover:translate-x-1' alt="Arrow" />
            </a>
        </div>
        
        {/* Right Side */}
        <div className='md:w-1/2 relative'>
          <img src={assets.header_img} alt="Header" className='w-full md:absolute bottom-0 right-0 h-auto rounded-lg transition-transform duration-700 hover:scale-105 origin-bottom'/>
        </div>
    </div>
  )
}

export default Header