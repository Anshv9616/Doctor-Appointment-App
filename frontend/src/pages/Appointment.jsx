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
    <div>
      
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
         <img src={docInfo.image} alt="" className='bg-blue-400 w-full sm:max-w-72 rounded-lg'/>
        </div>

        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0 '>
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>{docInfo.name} <img src={assets.verified_icon} alt="" className='w-5' /></p>
          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
             <p>{docInfo.degree} - {docInfo.speciality}</p>

             <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
          </div>

           <div>
              <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>About <img src={assets.info_icon} alt="" /></p>
              <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
           </div>

             <p className='text-gray-500 font-medium mt-4'>
               Appointment Fee: <span className='text-gray-600'>${docInfo.fees}</span>
             </p>

        </div>
      </div>

      {/* booking slots */}

      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>

        <p>Booking sots</p>
        <div className='flex gap-3 overflow-x-scroll w-full items-center mt-4'>
          {docSlots.length && docSlots.map((item,index)=>(
             <div key={index} onClick={()=>setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex===index ?"bg-blue-600 text-white ":"border  border-gray-400"}`}>
                <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                <p>{item[0] && item[0].datetime.getDate()}</p>

             </div>
          ))}
        </div>

        <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
          {docSlots.length && docSlots[slotIndex].map((item,index)=>(
               <p onClick={()=>setSlotTime(item.time)} key={index} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time===slotTime ? "bg-blue-500 text-white":"text-gray-400 border border-gray-300"}`}>
                  {
                     item.time
                  }
               </p>
          ))}
        </div>
        <button onClick={bookAppointment} className='bg-blue-500 text-white text-sm font-lg px-14 py-3 rounded-full my-6'>Book an Appointment</button>

      </div>

      <RelatedDoctors docId={docId} speciality={docInfo.speciality}/>


    </div>
  )
}

export default Appointment