import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom';

const RelatedDoctors = ({docId,speciality}) => {
    const{doctors}=useContext(AppContext);
    const navigate=useNavigate();
    const[relDoc,setRelDocs]=useState([]);

    useEffect(()=>{
        if(doctors.length >0&& speciality ){
            const temp=doctors.filter((doc)=>doc.speciality===speciality && doc._id!=docId)
            setRelDocs(temp);
        }
    },[doctors,speciality,docId])

  return (
   <div className='flex flex-col items-center gap-4 my-16 text-gray-900 dark:text-slate-100 md:mx-10'>
      <h1 className='text-4xl font-bold tracking-tight'>Related Doctors</h1>
      <p className='sm:w-1/3 text-center text-sm text-gray-600 dark:text-slate-400 mt-2'>
        Simply browse through our extensive list of trusted doctors.
      </p>
      
      <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 pt-10 px-4 sm:px-0'>
        {
          relDoc.slice(0, 5).map((item, index) => (
            <div 
              key={index} 
              className='group bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-3xl overflow-hidden cursor-pointer hover:-translate-y-2 hover:shadow-2xl shadow-sm transition-all duration-500' 
              onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0,0) }}
            >
              <div className="overflow-hidden relative">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className='bg-primary/5 dark:bg-slate-700 w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110' 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              
              <div className='p-5'>
                <div className={`flex items-center gap-2 text-sm font-semibold mb-2 ${item.available ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
                  <p className={`w-2.5 h-2.5 rounded-full ${item.available ? "bg-green-500" : "bg-red-500"} shadow-sm`}></p>
                  <p>{item.available ? "Available" : "Not Available"}</p>
                </div>
                <p className='font-bold text-lg tracking-tight'>{item.name}</p>
                <p className='text-[13px] font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mt-1'>{item.speciality}</p>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default RelatedDoctors