const JWT = require("jsonwebtoken");
const Users = require("../models/userModel");

// protected Routes through token
const requireSignIn = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      // console.log("Token not provided in headers");
      return res.status(401).json({
        success: false,
        message: "JWT must be provided in the Authorization header",
      });
    }

    // console.log("Token received:", token);

    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded token:", decoded);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired JWT",
    });
  }
};

// admin access
const isAdmin = async (req, res, next) => {
  try {
    const user = await Users.findById(req.user._id);

    if (!user || user.role !== 1) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access",
      });
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      success: false,
      error,
      message: "Error in admin middleware",
    });
  }
};

exports.requireSignIn = requireSignIn;
exports.isAdmin = isAdmin;
