import express from 'express'; // ES6 module import
import session from 'express-session'; // session management
import adminLoginRoute from './routes/adminRoute.js';
import facultyLoginRouter from './routes/facultyRoute.js';
import studentLoginRouter from './routes/studentRoute.js';
import announcementRouter from './routes/annoucementAdd.js';
import Announcement from './models/annoucements.js';

const app = express();
const PORT = 3000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// middleware
app.use(session({
    secret: 'randomkey', 
    resave: false,
    saveUninitialized: true,  // Ensures a session is created even if unmodified
    cookie: { secure: false } // using HTTPS
}));

// Middleware
app.use(express.json()); // Parses JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data

app.use(express.static('public'));

// Ensure sessions are available before routing
app.use((req, res, next) => {
    console.log("Session Data:", req.session); // Debugging log
    next();
});

// Dashboard route (pass session data)
// app.get('/dashboard', async (req, res) => {
//   try {
//       const announcements = await Announcement.findAll({ order: [['created_at', 'DESC']] });
//       res.render('dashboard', { 
//           announcements,
//           admin: { email: req.session.adminEmail || "Admin" } // Pass admin session data
//       }); 
//   } catch (error) {
//       console.error('Error fetching announcements:', error);
//       res.status(500).send('Server error');
//   }
// });

// // Actually attempting to log in here
// app.use("/adminLogin", adminLoginRoute);
// app.use("/facultyLogin", facultyLoginRouter);
// app.use("/studentLogin", studentLoginRouter);

// // Routes to the main page and login page
// app.get('/', (req, res) => res.render('dashboard')); 
// app.get('/studentlogin', (req, res) => res.render('./loginpages/studentloginpage')); 
// app.get('/facultylogin', (req, res) => res.render('./loginpages/facultyloginpage')); 
// app.get('/adminlogin', (req, res) => res.render('./loginpages/adminloginpage')); 

// Announcement creation for the admin
app.use("/", announcementRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
