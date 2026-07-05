import React from 'react'
import {specialityData} from "../assets/assets_frontend/assets"
import { Link } from 'react-router-dom'

const SpecialityMenu = () => {
  return (
    <div id="speciality" className='flex flex-col gap-5 items-center py-20 px-4'>
      <h1 className='text-4xl font-bold text-gray-900 dark:text-slate-100 tracking-tight text-center'>Find by Speciality</h1>
      <p className='text-sm text-center text-gray-600 dark:text-slate-400 max-w-2xl leading-relaxed'>
        Simply browse through our extensive list of trusted doctors, schedule <br className="hidden sm:block" /> your appointment hassle-free.
      </p>
      
      <div className='flex gap-6 sm:justify-center pt-8 w-full overflow-x-scroll hide-scrollbar px-4 sm:px-0 pb-4'>
        {specialityData.map((item,index)=>(
          <Link 
            onClick={()=>scrollTo(0,0)} 
            className="flex flex-col items-center text-xs cursor-pointer flex-shrink-0 group" 
            key={index} 
            to={`/doctors/${item.speciality}`}
          >
            <div className='w-24 h-24 sm:w-28 sm:h-28 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-full flex justify-center items-center shadow-lg group-hover:shadow-2xl transition-all duration-500 mb-4 border border-white/40 dark:border-slate-700 group-hover:-translate-y-2 group-hover:border-primary/50 relative overflow-hidden'>
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <img src={item.image} alt="" className='w-14 sm:w-16 relative z-10 transition-transform duration-500 group-hover:scale-110'/>
            </div>
            <p className='text-[13px] font-bold text-gray-700 dark:text-slate-300 group-hover:text-primary dark:group-hover:text-primary-light transition-colors uppercase tracking-wider'>{item.speciality}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default SpecialityMenu;