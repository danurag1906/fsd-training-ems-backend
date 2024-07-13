import express from "express";
import {
  createEmployee,
  deleteEmployee,
  getEmployeeById,
  getEmployeeByName,
  getEmployees,
  profile,
  signin,
  signout,
  signup,
  updateEmployee,
  updateEmployeeByAdmin,
  updateUserProfile,
} from "../controllers/employee.controllers.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/signout", signout);
router.post("/profile", verifyToken, profile);

router.post("/createEmployee", createEmployee);
// router.post("/fetchAllEmployees", getEmployees);
router.post("/fetchAllEmployees", verifyToken, getEmployees);
router.post("/fetchEmployeeById/:id", verifyToken, getEmployeeById);
router.post("/fetchEmployeeByName", verifyToken, getEmployeeByName);
router.post("/updateEmployee/:id", verifyToken, updateEmployee);
router.post("/updateEmployeeByAdmin/:id", verifyToken, updateEmployeeByAdmin);
router.post("/deleteEmployee/:id", verifyToken, deleteEmployee);

router.post("/updateUserProfile/:id", verifyToken, updateUserProfile);

export default router;
