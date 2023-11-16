const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE_PATH = path.join(DATA_DIR, 'employeeData.json');
const DATE_FORMAT = 'YYYY-MM-DD';

async function loadEmployeeData() {
  try {
    const data = await fs.readFile(DATA_FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If the file doesn't exist, return an empty array
    if (error.code === 'ENOENT') {
      return [];
    }
    console.error('Error loading employee data:', error.message);
    return [];
  }
}

async function saveEmployeeData(newEmployee) {
  try {
    // Load existing employee data
    const employees = await loadEmployeeData();

    // Create an array if it doesn't exist
    const employeeArray = Array.isArray(employees) ? employees : [];

    // Generate a unique ID for the new employee
    let newId = 1;
    while (employeeArray.some(employee => employee.id == newId.toString())) {
      newId++;
    }

    // Assign the generated ID to the new employee
    newEmployee.id = newId.toString();

    // Append the new employee object
    employeeArray.push(newEmployee);

    // Sort the array based on the "id" attribute
    employeeArray.sort((a, b) => a.id - b.id);

    // Save the updated array to the local file system
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(employeeArray, null, 2));

    console.log('Employee data saved successfully');
  } catch (error) {
    console.error('Error saving employee data:', error.message);
  }
}


async function updateEmployeeRecords(inputData) {
  try {
    const newRecords =transformInputData(inputData);
    console.log(newRecords);
    const employees = await loadEmployeeData();
    
    console.log(employees);
    // Update the records for each employee based on the provided newRecords
    employees.forEach((employee) => {
      const matchingRecords = newRecords.filter((emp) => emp.id == employee.id);
      console.log(matchingRecords);
      if (!employee.records) {
        employee.records = [];
      }
      if (matchingRecords.length > 0) {
        // Remove existing records with the same "date" attribute
        employee.records = employee.records.filter((rec) => !matchingRecords.some((mr) => mr.record.date === rec.date));
    
        // Append the new records
        employee.records.push(...matchingRecords.map((emp) => emp.record));
    
        // Sort the records based on the "date" attribute
        employee.records.sort((a, b) => new Date(a.date) - new Date(b.date));
      }
    });

    // Save the updated employee data to the local file system
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(employees, null, 2));

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
      id: parseInt(id),
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
    const employees = await loadEmployeeData();
    const employeesData = employees
      .filter(employee => employee.id) // Filter out objects without an 'id' attribute
      .map((employee) => {
        const records = employee.records || [];
        const record = records.find((rec) => rec.date === date) || {};
        return {
          id: employee.id,
          name: employee.name,
          record: record || { date, attendance: null, amount: null }, // Provide default values if record is undefined
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
    const employees = await loadEmployeeData();
    const filteredData = employees.filter((employee) => employee.id === id);

    if (filteredData.length === 0) {
      console.log(`No employee found with id ${id}`);
      return [];
    }

    const result = filteredData.map((employee) => {
      const records = employee.records || [];
      const filteredRecords = records.filter((rec) => {
        const recordDate = new Date(rec.date);
        return recordDate >= new Date(startDate) && recordDate <= new Date(endDate);
      });

      return {
        id: employee.id,
        name: employee.name,
        records: filteredRecords,
        salary:employee.salary
      };
    });

    return result;
  } catch (error) {
    console.error('Error getting employee data by id and date range:', error.message);
    throw error; // Re-throw the error to propagate it further if needed
  }
}






module.exports = { saveEmployeeData,updateEmployeeRecords,getEmployeesDataByDate,getEmployeesDataByIdAndDateRange,loadEmployeeData}