import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets_frontend/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_ROUTES } from '../utils/routes';
const Appointment = () => {
   const {docId}=useParams();
   const{doctors,token, getAllDoctors}=useContext(AppContext);
   const[docInfo,setDocInfo]=useState(null);
const [docSlots,setDocSlots]=useState([]);
const [slotIndex,setSlotIndex]=useState(0);
const[slotTime,setSlotTime]=useState('')
const daysOfWeek=["SUN","MON","TUE","WED","THU","FRI","SAT"]
const navigate=useNavigate()
   const fetchDocInfo=async()=>{
         const docInfo=doctors.find(doc=>doc._id==docId)
         setDocInfo(docInfo)
        // console.log(docInfo)
   }

   const getAvailableSlots=async()=>{
      setDocSlots([])
      //getting current date

      let today=new Date();

      for(let i=0;i<7;i++){
           //geting date with index
           let currDate=new Date(today);
           currDate.setDate(today.getDate()+i)

           //setting end time of the date with index

           let endTime=new Date();
           endTime.setDate(today.getDate()+i);
           endTime.setHours(21,0,0,0);

           //setting hours

          if (today.getDate() === currDate.getDate()) {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  // If current time is past 9 PM, skip today's slots
  if (currentHour >= 21) {
    continue;
  }

  currDate.setHours(currentHour >= 10 ? currentHour + 1 : 10);
  currDate.setMinutes(currentMinute > 30 ? 30 : 0);
} else {
  currDate.setHours(10);
  currDate.setMinutes(0);
}


           let timeSlots=[];

           while(currDate<endTime){
                 let formattedTime=currDate.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})

                 let day=currDate.getDate();
                 let month=currDate.getMonth()+1
                 let year=currDate.getFullYear()

                 const slotDate=day+"_"+month+"_"+year
                 const slotTime=formattedTime

                 const isSlotAvailable=docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ?false :true

                  if (isSlotAvailable){
                    timeSlots.push({
                   datetime:new Date(currDate),
                   time:formattedTime
                 })
                  }
                

                 //increment curr time by 30 minute
                 currDate.setMinutes(currDate.getMinutes()+30)
           }

           setDocSlots(prev=>([...prev,timeSlots]))

      }
   }

   const bookAppointment=async()=>{
       if(!token){
           toast.warn("Login to Book appointment")
           return navigate("/login")
           
       }

       try{
          
         const date=docSlots[slotIndex][0].datetime

         let day=date.getDate();
         let month=date.getMonth()+1;
         let year=date.getFullYear();
         
         const slotDate=day+"_"+month+"_"+year

         const {data}=await axios.post(API_ROUTES.BOOK_APPOINTMENT,{docId,slotDate,slotTime},{
             headers:{token}
         })

         if(data.success){
           toast.success("Appointment Booked Successfully")
           getAllDoctors()
           navigate("/my-appointment")
         }
         else{
             toast.error(data.message)
         }

       }
       catch(err){
         toast.error(err.message)
       }

   }

  useEffect(()=>{
       getAvailableSlots()
  },[docInfo])

   useEffect(()=>{
       fetchDocInfo()
   },[doctors,docId])

   useEffect(()=>{
      console.log(docSlots)
   })

  return docInfo && (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      
      <div className='flex flex-col sm:flex-row gap-6 relative z-10'>
        <div className="group overflow-hidden rounded-3xl shadow-xl border border-white/20 dark:border-slate-700 flex-shrink-0 relative">
         <img src={docInfo.image} alt="" className='bg-primary/10 dark:bg-slate-700 w-full sm:max-w-72 h-full object-cover transition-transform duration-700 group-hover:scale-105'/>
         <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
        </div>

        <div className='flex-1 border border-white/40 dark:border-slate-700/50 shadow-2xl backdrop-blur-2xl bg-white/80 dark:bg-slate-800/80 rounded-3xl p-8 py-7 mx-2 sm:mx-0 mt-[-80px] sm:mt-0 relative transition-all duration-300 hover:shadow-primary/5 hover:-translate-y-1'>
          <p className='flex items-center gap-2 text-3xl font-bold text-gray-900 dark:text-slate-100 tracking-tight'>{docInfo.name} <img src={assets.verified_icon} alt="" className='w-6 dark:invert' /></p>
          <div className='flex items-center gap-2 text-sm mt-2 text-gray-600 dark:text-slate-400 font-medium'>
             <p>{docInfo.degree} - {docInfo.speciality}</p>

             <button className='py-0.5 px-3 border border-gray-300 dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 text-xs rounded-full shadow-sm'>{docInfo.experience}</button>
          </div>

           <div className="mt-6">
              <p className='flex items-center gap-1 text-sm font-bold text-gray-900 dark:text-slate-200 tracking-wide uppercase'>About <img src={assets.info_icon} alt="" className="dark:invert w-4 opacity-70" /></p>
              <p className='text-sm text-gray-500 dark:text-slate-400 max-w-[700px] mt-2 leading-relaxed'>{docInfo.about}</p>
           </div>

             <p className='text-gray-500 dark:text-slate-400 font-medium mt-6 p-4 bg-primary/5 dark:bg-slate-700/30 rounded-2xl border border-primary/10 dark:border-slate-600/50 inline-block'>
               Appointment Fee: <span className='text-gray-800 dark:text-slate-200 text-lg ml-1 font-bold'>${docInfo.fees}</span>
             </p>

        </div>
      </div>

      {/* booking slots */}

      <div className='sm:ml-72 sm:pl-6 mt-8 font-medium text-gray-700 dark:text-slate-300'>

        <p className="font-bold text-lg text-gray-800 dark:text-slate-200 mb-2">Booking Slots</p>
        <div className='flex gap-3 overflow-x-scroll w-full items-center mt-4 pb-2 hide-scrollbar'>
          {docSlots.length && docSlots.map((item,index)=>(
             <div key={index} onClick={()=>setSlotIndex(index)} className={`text-center py-5 px-2 min-w-20 rounded-3xl cursor-pointer transition-all duration-300 shadow-sm border ${slotIndex===index ?"bg-gradient-to-br from-primary to-indigo-500 text-white border-transparent scale-105 shadow-primary/20":"bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:border-primary/50"}`}>
                <p className="text-xs uppercase tracking-wider mb-1 opacity-80">{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                <p className="text-xl font-bold">{item[0] && item[0].datetime.getDate()}</p>

             </div>
          ))}
        </div>

        <div className='flex items-center gap-3 w-full overflow-x-scroll mt-6 pb-2 hide-scrollbar'>
          {docSlots.length && docSlots[slotIndex].map((item,index)=>(
               <p onClick={()=>setSlotTime(item.time)} key={index} className={`text-sm font-semibold flex-shrink-0 px-6 py-2.5 rounded-full cursor-pointer transition-all duration-300 shadow-sm border ${item.time===slotTime ? "bg-primary text-white border-transparent shadow-primary/20":"bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-400 border-gray-200 dark:border-slate-700 hover:border-primary/50 hover:text-primary dark:hover:text-primary-light"}`}>
                  {
                     item.time
                  }
               </p>
          ))}
        </div>
        <button onClick={bookAppointment} className='bg-gradient-to-br from-primary to-indigo-500 hover:from-primary-dark hover:to-indigo-600 text-white text-sm font-bold uppercase tracking-wider px-14 py-4 rounded-full my-8 shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-none cursor-pointer'>Book an Appointment</button>

      </div>

      <RelatedDoctors docId={docId} speciality={docInfo.speciality}/>


    </div>
  )
}

export default Appointment