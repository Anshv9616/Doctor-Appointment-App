import jwt from "jsonwebtoken";

export const authenUser = async (req, res, next) => {
  try {
     const token = req.headers.token || req.headers.authorization?.split(" ")[1];


    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized. Login Again",
      });
    }

    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: token_decode.id };
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({
      success: false,
      message: err.message,
    });
  }
};
