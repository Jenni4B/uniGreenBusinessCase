import express from 'express'; // es6 module import
const app = express();
const PORT = 3000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Define the root route to render your EJS file
app.get('/', (req, res) => res.render('homepage')); // root route
app.get('/login', (req, res) => res.render('login')); // render login page

// Login Logic/Authentication
// 

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
