import jwt from "jsonwebtoken";

export const authDoctor = async (req, res, next) => {
  try {
    const { doctor_token } = req.headers;

    if (!doctor_token) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized. Login Again",
      });
    }

    const token_decode = jwt.verify(doctor_token, process.env.JWT_SECRET);
    req.doctor_id = { id: token_decode.id };
   
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({
      success: false,
      message: err.message,
    });
  }
};