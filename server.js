import express from 'express'; // es6 module import
const app = express();
const PORT = 3000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Define the root route to render your EJS file
app.get('/', (req, res) => res.render('homepage')); // root route
app.get('/studentlogin', (req, res) => res.render('studentlogin')); // render login page
app.get('/facultylogin', (req, res) => res.render('facultylogin'));
app.get('/adminlogin', (req, res) => res.render('adminlogin'));


// Login Logic/Authentication
// 

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
