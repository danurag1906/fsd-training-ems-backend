import Employee from "../models/employee.models.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    const { name, password } = req.body;
    // console.log("name", name);
    // console.log("passowrd", password);
    const employee = await Employee.findOne({ name });
    // console.log(employee, "employee");
    if (employee) {
      return res.status(400).json({
        success: false,
        message: "Employee already exists. Use another employee name",
      });
    }

    //hashing the password before saving
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // console.log(hashedPassword, "hahsed password");

    const newEmployee = await Employee.create({
      name,
      password: hashedPassword,
    });

    // console.log(newEmployee, "new employye");

    const { password: pass, createdAt, updatedAt, ...rest } = newEmployee._doc;

    return res.status(200).json({
      success: true,
      message: "New Employee Created",
      employee: rest,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const signin = async (req, res) => {
  try {
    const { name, password } = req.body;
    const employee = await Employee.findOne({ name });
    //if employee not found, it doesnt exits
    if (!employee) {
      return res.status(400).json({
        success: false,
        message: "Employee does not exist",
      });
    }

    const isMatch = bcryptjs.compareSync(password, employee.password);
    //if passowrd is incorrect, break the funciton call
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect Credentials",
      });
    }

    const token = jwt.sign({ id: employee._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    const { password: pass, createdAt, updatedAt, ...rest } = employee._doc;

    return res
      .cookie("access_token", token, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 1000 * 60 * 15, //max age 15 minutes
      })
      .status(200)
      .json({
        success: true,
        message: "Login Successful",
        employee: rest,
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const signout = async (req, res) => {
  try {
    return res
      .clearCookie("access_token", {
        sameSite: "None",
        secure: true,
        expires: new Date(0),
      })
      .status(200)
      .json({
        success: true,
        message: "Logout Successful",
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const profile = async (req, res) => {
  try {
    const user = req.user;
    const employeeDetails = await Employee.findById(user.id).select(
      "-password"
    );

    return res.status(200).json({
      success: true,
      employeeDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const { employeeId, name, department, DOB } = req.body;

    const employee = await Employee.findOne({ employeeid: employeeId });

    if (employee) {
      return res.status(400).json({
        success: false,
        message: "Employee Id already exists. Use another employee Id",
      });
    }

    const newEmployee = await Employee.create({
      employeeid: employeeId,
      name,
      department,
      dob: DOB,
    });
    return res.status(200).json({
      success: true,
      message: "New Employee Created",
      newEmployee,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getEmployees = async (req, res) => {
  try {
    let employees;
    let sortFactor;
    const { department } = req.query;
    const { asc } = req.query;
    sortFactor = asc === "true" ? 1 : -1;

    const projection = { password: 0, createdAt: 0, updatedAt: 0 }; //fields to exclude

    if (department && department.length > 0) {
      employees = await Employee.find(
        { department: department },
        projection
      ).sort({
        employeeid: sortFactor,
      });
    } else {
      employees = await Employee.find({}, projection).sort({
        employeeid: sortFactor,
      });
    }

    return res.status(200).json({
      success: true,
      employees,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findById({ _id: id });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const { password, ...rest } = employee._doc;
    return res.status(200).json({
      success: true,
      employee: rest,
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: error.message,
    });
  }
};

export const getEmployeeByName = async (req, res) => {
  try {
    const { name } = req.body;
    const employee = await Employee.findOne({ name });
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const { password, ...rest } = employee._doc;

    return res.status(200).json({
      success: true,
      employee: rest,
    });
  } catch (error) {
    return res.staus(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, department, isactive, employementtype } = req.body;

    // const isactiveValue = isactive === "true" ? true : false;

    const updatedEmployee = await Employee.findByIdAndUpdate(
      { _id: id },
      {
        name,
        department,
        isactive: isactive,
        employementtype: employementtype,
      },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const {
      password: pass,
      createdAt,
      updatedAt,
      ...rest
    } = updatedEmployee._doc;

    return res.status(200).json({
      success: true,
      message: "Employee Updated",
      updatedEmployee: rest,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateEmployeeByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, isactive, employementtype } = req.body.formData;
    // console.log(name, isactive, employementtype);
    const employee = await Employee.findById({ _id: id });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // console.log("employee", employee);

    employee.isactive = isactive;
    employee.employementtype = employementtype;
    employee.name = name;
    await employee.save();

    const { password, createdAt, updatedAt, ...rest } = employee._doc;

    // console.log("employee", employee);

    return res.status(200).json({
      success: true,
      message: "Employee Updated",
      updatedEmployee: rest,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findById({ _id: id });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    if (employee.isactive) {
      return res.status(404).json({
        success: false,
        message: "Employee is active. Cannot be deleted!",
      });
    }

    await Employee.findByIdAndDelete({ _id: id });

    return res.status(200).json({
      success: true,
      message: "Employee Deleted",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const { formData } = req.body;
    // console.log(formData, "formData");
    // console.log(formData.name, "name");
    // console.log(formData.department, "department");
    // console.log(formData.dob, "dob");

    const employee = await Employee.findById({ _id: id });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    employee.name = formData.name;
    employee.department = formData.department;
    employee.dob = formData.dob;

    await employee.save();

    const { password: pass, createdAt, updatedAt, ...rest } = employee._doc;

    return res.status(200).json({
      success: true,
      message: "Employee Updated",
      rest,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
