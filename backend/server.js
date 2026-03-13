import express from "express"


import cors from "cors"
import "dotenv/config"
import connectDB from "./config/Db.js";
import connectCloudinary from "./config/cloudinary.js";
import admitRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoutes.js"
import userRouter from "./routes/userRoute.js";
const app =express();

const port=process.env.PORT || 4000
connectDB();
connectCloudinary();

app.use(express.json());

app.use(cors({
  origin: ['http://localhost:5174', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));




app.use("/api/admin",admitRouter)
app.use("/api/doctor",doctorRouter)
app.use("/api/user",userRouter);
app.get("/",(req,res)=>{
    res.send("API WORKING ")
})

app.listen(port,()=>console.log("server started",port))


