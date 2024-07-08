import express from "express";
import {
  createEmployee,
  deleteEmployee,
  getEmployeeById,
  getEmployeeByName,
  getEmployees,
  updateEmployee,
} from "../controllers/employee.controllers.js";

const router = express.Router();

router.post("/createEmployee", createEmployee);
router.post("/fetchAllEmployees", getEmployees);
router.get("/fetchAllEmployees", getEmployees);
router.get("/fetchEmployeeById/:id", getEmployeeById);
router.post("/fetchEmployeeByName", getEmployeeByName);
router.patch("/updateEmployee/:id", updateEmployee);
router.delete("/deleteEmployee/:id", deleteEmployee);

export default router;
