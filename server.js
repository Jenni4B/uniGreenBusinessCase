import express from 'express'; // ES6 module import
import session from 'express-session'; // For session management

import adminLoginRoute from './routes/adminRoute.js';
import facultyLoginRouter from './routes/facultyRoute.js';
import studentLoginRouter from './routes/studentRoute.js';
import addAnnouncementRouter from './routes/annoucementAdd.js';


const app = express();
const PORT = 3000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Middleware
app.use(express.json()); // Parses JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data

// Session Middleware
app.use(session({
    secret: 'randomkey',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set secure: true for HTTPS
}));


app.use(express.static('public'));

// Routes to the main page and login page
app.get('/', (req, res) => res.render('dashboard')); // Root route
app.get('/studentlogin', (req, res) => res.render('./loginpages/studentloginpage')); // Student login page
app.get('/facultylogin', (req, res) => res.render('./loginpages/facultyloginpage')); // Faculty login page
app.get('/adminlogin', (req, res) => res.render('./loginpages/adminloginpage')); // Admin login page

// Actually attempting to log in here
app.use("/adminLogin", adminLoginRoute);
app.use("/facultyLogin", facultyLoginRouter);
app.use("/studentLogin", studentLoginRouter);

// Annoucement creation for the admin
app.use("/addAnnoucement", addAnnouncementRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
