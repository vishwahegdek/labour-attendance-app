const mongoose = require("mongoose");

mongoose.connect('mongodb+srv://vishwahegdek:F0FJA6aOz7HtLdKi@cluster0.dj4mlzp.mongodb.net/?retryWrites=true&w=majority');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const Employee = require("./Schema.js");


async function loadEmployeeData() {
  try {
    const employees = await Employee.find();
    return employees;
  } catch (error) {
    console.error('Error loading employee data:', error.message);
    throw error; // You might want to handle or log the error appropriately
  }
}



async function saveEmployeeData(newEmployee) {
  try {
    // Check if the name already exists in the database
    const existingEmployee = await Employee.findOne({ name: newEmployee.name });

    if (existingEmployee) {
      console.error('Employee with the same name already exists. Please choose a different name.');
      return;
    }

    // Generate a unique ID for the new employee
    const lastEmployee = await Employee.findOne().sort({ id: -1 }).limit(1);
    let newId = 1;

    if (lastEmployee) {
      newId = parseInt(lastEmployee.id) + 1;
    }

    // Assign the generated ID to the new employee
    newEmployee.id = newId.toString();

    // Save the new employee to the database
    const savedEmployee = await Employee.create(newEmployee);

    console.log('Employee data saved successfully:', savedEmployee);
  } catch (error) {
    console.error('Error saving employee data:', error.message);
  }
}


async function updateEmployeeRecords(inputData) {
  try {
    const newRecords = transformInputData(inputData);
    console.log(newRecords);

    // Update the records for each employee based on the provided newRecords
    newRecords.forEach(async (record) => {
      try {
        // First, pull existing records with the same date
        await Employee.updateOne(
          { id: record.id },
          { $pull: { records: { date: record.record.date } } }
        );

        // Then, add the new record to the records array
        await Employee.updateOne(
          { id: record.id },
          { $addToSet: { records: record.record } }
        );
      } catch (error) {
        console.error(`Error updating records for employee with id ${record.id}:`, error.message);
      }
    });

    console.log('Employee records updated successfully');
  } catch (error) {
    console.error('Error updating employee records:', error.message);
  }
}


function transformInputData(inputData) {
  const transformedData = [];

  // Extract the date from the input data
  const date = inputData.date;

  // Iterate over the keys of inputData and group them by employee ID
  const groupedData = {};
  Object.keys(inputData).forEach((key) => {
    if (key !== 'date') {
      const [field, id] = key.split('_'); // Split the key into field (attendance/amount) and ID
      if (!groupedData[id]) {
        groupedData[id] = {};
      }
      groupedData[id][field] = inputData[key];
    }
  });

  // Convert the grouped data into the desired format
  Object.keys(groupedData).forEach((id) => {
    const record = {
      id: id, // Ensure that the id is a string for consistency with MongoDB
      record: {
        date,
        attendance: groupedData[id].attendance,
        amount: groupedData[id].amount,
      },
    };
    transformedData.push(record);
  });

  return transformedData;
}



async function getEmployeesDataByDate(date) {
  try {
    const employees = await Employee.find();

    const employeesData = employees.map((employee) => {
      const records = employee.records || [];
      const record = records.find((rec) => rec.date === date) || {};
      return {
        id: employee.id,
        name: employee.name,
        record: record || { date, attendance: null, amount: null },
        date,
      };
    });

    return employeesData;

  } catch (error) {
    console.error('Error getting employee data by date:', error.message);
    throw error; // Re-throw the error to propagate it further if needed
  }
}


async function getEmployeesDataByIdAndDateRange(id, startDate, endDate) {
  try {
    const employees = await Employee.find({ id: id });

    if (employees.length === 0) {
      console.log(`No employee found with id ${id}`);
      return [];
    }

    const result = employees.map((employee) => {
      const records = employee.records || [];
      const filteredRecords = records.filter((rec) => {
        const recordDate = new Date(rec.date);
        return recordDate >= new Date(startDate) && recordDate <= new Date(endDate);
      });

      return {
        id: employee.id,
        name: employee.name,
        records: filteredRecords,
        salary: employee.salary,
      };
    });

    return result;
  } catch (error) {
    console.error('Error getting employee data by id and date range:', error.message);
    throw error; // Re-throw the error to propagate it further if needed
  }
}


module.exports = { saveEmployeeData,updateEmployeeRecords,getEmployeesDataByDate,getEmployeesDataByIdAndDateRange,loadEmployeeData}

