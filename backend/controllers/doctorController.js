
import doctorModel from "../models/doctor.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
const changeAvailability=async(req,res)=>{
       try{

         const {docId}=req.body;
         const docData=await doctorModel.findById(docId);

         await doctorModel.findByIdAndUpdate(docId,{available:!docData.available})
        
           res.json({
                success:true,
                Message:"Availability changed "
            })
       }
       catch(err){
            console.log(err)
            res.json({
                success:false,
                Message:err.message
            })
       }
}


const getAllDoctorsList=async(req,res)=>{
        try{

           const doctors=await doctorModel.find({}).select(["-password","-email"])
           res.json({success:true,
               doctors
         } )
           
        }
        catch(err){

             console.log(err);
             res.json({
                 success:false,
                 message:err.message
             })
            
        }
}

//api fro doctor login

const doctorLogin=async(req,res)=>{
      try{
          const {email,password}=req.body;
            const doctor=await doctorModel.findOne({email
});
            if(!doctor){
                return res.json({
                    success:false,
                    message:"Invalid credentials"
                })
            }

            const isMatch=await bcrypt.compare(password,doctor.password);
            if(!isMatch){
                return res.json({
                    success:false,
                    message:"Invalid credentials"   
                })
            }

             const doctor_token=await jwt.sign({id:doctor._id},process.env.JWT_SECRET,{expiresIn:"3d"});
            res.json({
                success:true,
                message:"Login successful",

                doctor,doctor_token

            })
      } 
        catch(err){
            console.log(err);
            res.json({
                success:false,
                message:err.message
            })
        }
}


const getAllApointments=async(req,res)=>{
        try{
            const doctorId=req.doctor_id.id;
            console.log(doctorId);
            const appointments=await appointmentModel.find({docId: doctorId})
            res.json({
                success:true,
                appointments
            })
        }
        catch(err){
            console.log(err);
            res.json({
                success:false,
                message:err.message
            })
        }   
}


//api to mark appointment as completed

const markAppointmentCompleted=async(req,res)=>{
        try{
            const {appointmentId}=req.body;
            await appointmentModel.findByIdAndUpdate(appointmentId,{isCompleted:true});
            res.json({
                success:true,
                message:"Appointment marked as completed"
            })
        }
        catch(err){
            console.log(err);
            res.json({
                success:false,
                message:err.message
            })
        }
}

const markAppointmentCancelled=async(req,res)=>{
        try{
            const {appointmentId}=req.body;
            await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true});
            res.json({
                success:true,
                message:"Appointment cancelled successfully"
            })
        }
        catch(err){
            console.log(err);
            res.json({
                success:false,
                message:err.message
            })
        }
}


const doctorDashboard=async(req,res)=>{
        try{
          const  doctorId=req.doctor_id.id;
            const appointments=await appointmentModel.find({docId:doctorId});
           let earnings=0;
           appointments.forEach(appointment=>{
                if(appointment.isCompleted || appointment.payment){
                    earnings+=appointment.amount;
                }
              }) 
              
              let patients=[];
              appointments.map((item)=>{
                if(!patients.includes(item.userId)){
                    patients.push(item.userId)
                }
              })

              const doctorDashboardData={
                totalEarnings:earnings,
                totalAppointments:appointments.length,
                totalPatients:patients.length,
                latestAppointments:appointments.slice(0,5).reverse() 
              }

            res.json({
                success:true,
                doctorDashboardData,
                earnings
            })
        }   
        catch(err){ 
            console.log(err);
            res.json({
                success:false,
                message:err.message 


            })        }
}


const doctorProfile=async(req,res)=>{
      try{
         const docId=req.doctor_id.id;
         console.log("doctor_id",docId)
         const profileData=await doctorModel.findById(docId).select('-password')

         res.json({
            success:true,
            profileData
         })
      }
      catch(err){
        console.log(err)
        res.json({
            success:false,
            message:err.message
        })

      }
}

const updateDoctorProfile=async(req,res)=>{
       
      
     try{

        const {docId,fees,address,available}=req.body
        await doctorModel.findByIdAndUpdate(docId,{fees,address,available})
        res.json({success:true,
            message:"profile updated"
        })

     }
     catch(err){
        console.log(err)
        res.json({
            success:false,
            message:err.message
        })

     }
}


export{changeAvailability,getAllDoctorsList,doctorLogin,getAllApointments,markAppointmentCompleted,markAppointmentCancelled,doctorDashboard,doctorProfile,updateDoctorProfile};

