import userModel from "../models/user.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pkg from 'cloudinary';
const { v2: cloudinary } = pkg;
import razorpay from "razorpay";
import doctorModel from "../models/doctor.js";
import appointmentModel from "../models/appointmentModel.js";
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({ name, email, password: hashedPassword });
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({ success: true, token, message: "user registered" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.status(200).json({
      success: true,
      message: "Welcome back, user",
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.user;
    const userData = await userModel.findById(id).select("-password");
    return res.json({
      success: true,
      userData,
    });
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      message: err.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;
    const { id } = req.user;

    if (!name || !phone || !dob || !gender) {
      return res.json({
        success: false,
        message: "Data Missing",
      });
    }

    let parsedAddress;
    try {
      parsedAddress =
        typeof address === "string" ? JSON.parse(address) : address;
    } catch (e) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid address format" });
    }

    await userModel.findByIdAndUpdate(id, {
      name,
      phone,
      address: parsedAddress,
      dob,
      gender,
    });

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageURL = imageUpload.secure_url;
      await userModel.findByIdAndUpdate(id, { image: imageURL });
    }

    res.json({
      success: true,
      message: "Profile Updated",
    });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: err.message,
    });
  }
};

const bookAppointment = async (req, res) => {
  try {
    const { docId, slotDate, slotTime } = req.body;
    const { id } = req.user;
    const docData = await doctorModel.findById(docId).select("-password");

    if (!docData.available) {
      return res.json({
        success: false,
        message: "Doctor Not Available",
      });
    }

    let slots_booked = docData.slots_booked;

    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({
          success: false,
          message: "Slot not available",
        });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }

    const userData = await userModel.findById(id).select("-password");

    delete docData.slots_booked;

    const appointmentData = {
      userId: id,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
      isCompleted: false,
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    // save new slot data in doctor data
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({
      success: true,
      message: "appointment booked",
    });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: err.message,
    });
  }
};

const listAppointment = async (req, res) => {
  try {
    const { id } = req.user;
    const appointments = await appointmentModel.find({ userId: id ,
     
    });

    res.json({
      success: true,
      appointments,
    });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: err.message,
    });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const { id } = req.user;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData.userId !== id) {
      return res.json({
        success: false,
        message: "You are not authorized to cancel this appointment",
      });
    }

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

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
const paymentRazorpay = async (req,res) => {

  const{appointmentId}=req.body;
  const appointmentData=await appointmentModel.findById(appointmentId);
  if(!appointmentData || appointmentData.cancelled){
    return res.json({
      success:false,
      message:"Invalid appointment id or appointment cancelled",
    });
  }
  const options={
    amount:appointmentData.amount*100,
    currency:"INR", 
    receipt:`receipt_order_${appointmentId}`
  };

  try{
    const order=await razorpayInstance.orders.create(options);
    res.json({
      success:true,
      order,
    });
  }

  catch(err){
    console.log(err);
    res.json({
      success:false,
      message:err.message,

    });
  }
}

//api to verify payment

const verifyPayment=async(req,res)=>{
    try{

      const{razorpay_order_id}=req.body;
      const orderInfo=await razorpayInstance.orders.fetch(razorpay_order_id);
      

      if(orderInfo.status==="paid"){
       await appointmentModel.findByIdAndUpdate(orderInfo.receipt.replace("receipt_order_",""),{
        payment:true,
       
       });

        res.json({  
          success:true,
          message:"Payment verified successfully",
        });
      }
      else{
        res.json({
          success:false,
          message:"Payment failed",
        });
      }

    }
    catch(err){
      console.log(err);
      res.json({
        success:false,
        message:err.message,
      });
    }
};

export {
  registerUser,
  loginUser,
  getUser,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  paymentRazorpay,
  verifyPayment
};
