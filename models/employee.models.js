import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  employeeid: {
    type: String,
    required: true,
    unique: true,
  },
  department: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  isactive: {
    type: Boolean,
    default: true,
  },
  employementtype: {
    type: String,
    required: true,
    default: "fulltime",
    enum: ["fulltime", "parttime", "contract"],
  },
});

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;
