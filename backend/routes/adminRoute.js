import express from "express"

import { addDoctor,loginAdmin,getAllDoctors,appointmentsAdmin,appointmentCancel,getAdminDashboardData} from "../controllers/adminController.js"
import upload from "../middlewares/multer.js"
import authAdmin from "../middlewares/authAdmin.js";
import { changeAvailability } from "../controllers/doctorController.js";
const admitRouter=express.Router();

admitRouter.post("/add-doctor",authAdmin,upload.single("image"),addDoctor);
admitRouter.post("/login",loginAdmin)
admitRouter.get("/doctor-list",authAdmin,getAllDoctors)
admitRouter.post("/change-availability",authAdmin,changeAvailability)
admitRouter.get("/appointments",authAdmin,appointmentsAdmin)
admitRouter.post("/appointment-cancel",authAdmin,appointmentCancel)
admitRouter.get("/dashboard-data",authAdmin,getAdminDashboardData)
export default admitRouter