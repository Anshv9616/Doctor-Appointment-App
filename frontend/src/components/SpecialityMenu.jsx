import React from 'react'
import {specialityData} from "../assets/assets_frontend/assets"
import { Link } from 'react-router-dom'
const SpecialityMenu = () => {
  
  return (
    <div id="speciality" className='flex flex-col gap-4 items-center py-16 text-gray-800'>
      <h1 className='font-[500] text-4xl text-[#1F2937]'>Find by Speciality</h1>
       <h3 className='font-[400] text-sm text-center sm:1/3  text-[#4B5563]'>Simply browse through our extensive list of trusted doctors, schedule <br /> your appointment hassle-free</h3>
       <div className='flex gap-4 sm:justify-center pt-5 w-full overflow-scroll'>
           {specialityData.map((item,index)=>(
               <Link onClick={()=>scrollTo(0,0)} className="flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500"key={index} to={`/doctors/${item.speciality}`}>
                 <img src={item.image} alt=""  className='w-16 sm:w-24 mb-2'/>
                 <p className='text-sm'>{item.speciality} </p>
               </Link>
           ))}
       </div>
    </div>
  )
}

export default SpecialityMenu;