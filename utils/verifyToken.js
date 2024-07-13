import jwt from "jsonwebtoken";
import Employee from "../models/employee.models.js";

export const verifyToken = async (req, res, next) => {
  try {
    const { role } = req.body;

    //access the token coming from the frontend cookies
    const token = req.cookies.access_token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    //verifying the token using JWT_SECRET
    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "Forbidden",
        });
      }

      const employeeDetails = await Employee.findById(user.id).select(
        "-password"
      );

      if (employeeDetails.role !== role) {
        return res.status(401).json({
          success: false,
          message: "You dont have the permission",
        });
      }

      if (user) {
        req.user = user;
        next();
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
