import  express from "express"
import { registerUser,loginUser ,getUser,updateProfile,bookAppointment,listAppointment,cancelAppointment,paymentRazorpay,verifyPayment} from "../controllers/userController.js";
import { authenUser} from "../middlewares/authUser.js"
import upload from "../middlewares/multer.js";

const userRouter=express.Router();


userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser)
userRouter.get("/get-profile",authenUser,getUser)
userRouter.post("/update-profile",authenUser,upload.single("image"),updateProfile)
userRouter.post("/book-appointment",authenUser,bookAppointment)
userRouter.post("/list-appointment",authenUser,listAppointment)
userRouter.post("/cancel-appointment",authenUser,cancelAppointment);
userRouter.post("/payment-razorpay",authenUser,paymentRazorpay);
userRouter.post("/verify-payment",authenUser,verifyPayment);

export default userRouter
