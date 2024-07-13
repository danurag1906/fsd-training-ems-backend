import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid"; // Install uuid package for generating unique IDs

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  employeeid: {
    type: String,
    unique: true,
    default: uuidv4, // Auto-generate unique ID if not provided
  },
  department: {
    type: String,
    enum: ["IT", "HR", "Finance", "Sales", "Marketing", "Others"],
    default: "Others",
  },
  dob: {
    type: Date,
  },
  isactive: {
    type: Boolean,
    default: true,
  },
  employementtype: {
    type: String,
    default: "fulltime",
    enum: ["fulltime", "parttime", "contract"],
  },
  role: {
    type: String,
    default: "normal",
    enum: ["superadmin", "admin", "normal"],
  },
});

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;
