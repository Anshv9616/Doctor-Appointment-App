import express from "express"
import{getAllDoctorsList,doctorLogin,getAllApointments,markAppointmentCompleted,markAppointmentCancelled,doctorDashboard,doctorProfile,updateDoctorProfile} from "../controllers/doctorController.js"
import {authDoctor} from "../middlewares/authDoctor.js";
const doctorRouter=express.Router();

doctorRouter.post("/login",doctorLogin);
doctorRouter.get("/list",getAllDoctorsList);
doctorRouter.get("/appointments",authDoctor,getAllApointments);
doctorRouter.post("/mark-completed",authDoctor,markAppointmentCompleted);
doctorRouter.post("/cancel-appointment",authDoctor,markAppointmentCancelled);
doctorRouter.get("/dashboard",authDoctor,doctorDashboard);
doctorRouter.get("/profile",authDoctor,doctorProfile);
doctorRouter.post("/update-profile",authDoctor,updateDoctorProfile);
export default doctorRouter