import validator from "validator";
import bcrypt from "bcrypt";
import Doctor from "../models/doctor.js";
import jwt from "jsonwebtoken"
import doctorModel from "../models/doctor.js";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/user.js"
const addDoctor = async (req, res) => {
  try {
    const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
    const imageFile = req.file;

    if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
      return res.json({ success: false, message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Enter a longer password" });
    }
   
    let availableValue;

  
if (req.body.available === "true") availableValue = true;
else if (req.body.available === "false") availableValue = false;
   
   const parsedAddress = JSON.parse(req.body.address || "{}");
 

 


  
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    
    const imageUrl = imageFile?.path;

  
    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: parsedAddress,
     ...(availableValue !== undefined && { available: availableValue }),
      date: Date.now(),
    };

    const newDoctor = new Doctor(doctorData);
    await newDoctor.save();

    res.json({ success: true, message: "Doctor added successfully" });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
};


const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
       const admin_token = jwt.sign(
  { email },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);

    
      return res.json({
        success: true,
        message: "Admin logged in successfully",
        admin_token,
      });
    } else {
      return res.json({
        success: false,
        message: "Invalid email or password",
      });
    }
  } catch (err) {
    console.log("Login error:", err);
    res.json({
      success: false,
      message: "Something went wrong during login",
    });
  }
};

const getAllDoctors=async(req,res)=>{
      try{

         const doctors=await doctorModel.find({}).select("-password")
         res.json({success:true,doctors})
      }
      catch(err){
         console.log(err);
         res.json({
            success:false,
            message:"error in fetching doctors"
         })
      }
}

//api to get all appointments of a doctor
const appointmentsAdmin=async(req,res)=>{
    try{
        
      const appointments =await appointmentModel.find({});
      res.json({success:true,appointments})

    }
    catch(err){
        console.log(err);
        res.json({success:false,message:"error in fetching appointments"})

    }
}


const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;
  
    const appointmentData = await appointmentModel.findById(appointmentId);

   

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });


    const {docId, slotDate, slotTime} = appointmentData;

    const docData = await doctorModel.findById(docId);
    let slots_booked = docData.slots_booked;
   slots_booked[slotDate] = slots_booked[slotDate].filter(time => time !== slotTime);
    
    
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });
    res.json({
      success: true,
      message: "Appointment cancelled",
    });

  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: err.message,
    });
  }
};

//api to get admin dashboard data

const getAdminDashboardData=async(req,res)=>{
  try{
    const totalDoctors=await doctorModel.countDocuments();
    const totalUser=await userModel.countDocuments();
    const totalAppointments=await appointmentModel.countDocuments();
    const appointments=await appointmentModel.find({});
   // const cancelledAppointments=await appointmentModel.countDocuments({cancelled:true});
    res.json({success:true,totalDoctors,totalAppointments,totalUser,
     latestAppointments: appointments.reverse().slice(0,5),
    })
  }
  catch(err){
    console.log(err);
    res.json({success:false,message:"error in fetching dashboard data"})
  }
}





export { addDoctor,loginAdmin,getAllDoctors,appointmentsAdmin ,appointmentCancel,getAdminDashboardData};

