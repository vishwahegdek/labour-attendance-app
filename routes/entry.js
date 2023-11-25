const express = require('express')
const router = express.Router()

const { removeEmployee, addRemovedEmployee,saveEmployeeData, updateEmployeeRecords ,getEmployeesDataByDate,getEmployeesDataByIdAndDateRange,loadEmployeeData,updateEmployeeDetails} = require('../database/mongo');



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

router.post('/update',async (req,res) =>{
  const newRecords = req.body;
  await updateEmployeeRecords(newRecords)

  // Set the content type to HTML
  res.setHeader('Content-Type', 'text/html');
  // Send a message
  res.write('Form submitted successfully. Redirecting...');
  // Redirect using client-side JavaScript after a delay (e.g., 2 seconds)
  res.write(`
    <script>
      setTimeout(function() {
        window.location.href = '/';
      }, 2000);
    </script>
  `);

  // End the response
  res.end();
});

// Route handler to render the form

router.get('/newjoin',async (req,res) => {
  try {
    const data = await loadEmployeeData();
    res.render('newemp', { employees: data });
  } catch (error) {
    console.error('Error in entry route:', error.message);
    // Handle the error and send an appropriate response
    res.status(500).send('Internal Server Error');
  }
});


router.post('/addemp',async (req,res) =>{
  const newEmployee = req.body;
  await saveEmployeeData(newEmployee);
  res.redirect('newjoin')
});

router.post('/submitemp',async (req,res) =>{
  console.log(req.body)
  const employeesData = req.body;
  await updateEmployeeDetails(employeesData)

  // Set the content type to HTML
  res.setHeader('Content-Type', 'text/html');
  // Send a message
  res.write('Form submitted successfully. Redirecting...');
  // Redirect using client-side JavaScript after a delay (e.g., 2 seconds)
  res.write(`
    <script>
      setTimeout(function() {
        window.location.href = '/newjoin';
      }, 2000);
    </script>
  `);

  // End the response
  res.end();
});


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