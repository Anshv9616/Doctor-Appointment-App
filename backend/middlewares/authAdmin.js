import jwt from "jsonwebtoken";

const authAdmin = async (req, res, next) => {
  try {
    const token = req.headers.admin_token || req.headers.authorization?.split(" ")[1];
   

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, please login again",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
    if (decoded.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({
        success: false,
        message: "Invalid admin token",
      });
    }

    req.admin = decoded;
    next();
  } catch (err) {
    console.log("Auth error:", err);
    return res.status(403).json({
      success: false,
      message: "Invalid or expired admin token",
    });
  }
};

export default authAdmin;
