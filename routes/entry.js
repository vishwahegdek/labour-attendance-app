const express = require('express')
const router = express.Router()

const { saveEmployeeData, updateEmployeeRecords ,getEmployeesDataByDate,getEmployeesDataByIdAndDateRange,loadEmployeeData} = require('../database/mongo');



router.get('/entry-route', async (req, res) => {
  try {
    const selectedDate = req.query.date;
    const data = await getEmployeesDataByDate(selectedDate);

    res.render('entry', { employees: data });
  } catch (error) {
    console.error('Error in entry route:', error.message);
    // Handle the error and send an appropriate response
    res.status(500).send('Internal Server Error');
  }
});

router.post('/update',(req,res) =>{
  const newRecords = req.body;
  updateEmployeeRecords(newRecords)
});

router.post('/submitemp',async (req,res) =>{
  const newEmployee = req.body;
  await saveEmployeeData(newEmployee);
});

// Route handler to render the form

router.get('/findemp', async (req, res) => {
  try {
    const data = await loadEmployeeData();
    res.render('employeeForm', { employees: data });
  } catch (error) {
    console.error('Error in entry route:', error.message);
    // Handle the error and send an appropriate response
    res.status(500).send('Internal Server Error');
  }
});

// Route handler to handle the form submission
router.post('/getEmployeeData', async (req, res) => {
  const { id, startDate, endDate } = req.body;

  try {
    const employeeData = await getEmployeesDataByIdAndDateRange(id, startDate, endDate);
    res.render('employeeData', { employeeData });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Internal Server Error');
  }
});



module.exports = router;