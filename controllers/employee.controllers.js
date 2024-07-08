import Employee from "../models/employee.models.js";

export const createEmployee = async (req, res) => {
  try {
    const { employeeId, name, department, DOB } = req.body;
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
    const { department } = req.body;
    if (department && department.length > 0) {
      employees = await Employee.find({ department: department }).sort({
        employeeid: -1,
      });
    } else {
      employees = await Employee.find().sort({ employeeid: -1 });
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

    return res.status(200).json({
      success: true,
      employee,
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

    return res.status(200).json({
      success: true,
      employee,
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

    return res.status(200).json({
      success: true,
      message: "Employee Updated",
      updatedEmployee,
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
