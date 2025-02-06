import express from 'express'; // ES6 module import
import session from 'express-session'; // session management
import authRoute from './routes/authRoute.js';
import announcementRouter from './routes/annoucementAdd.js';

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

// Actually attempting to log in here
app.use("/auth", authRoute);
// Routes to the main page and login page
app.get('/', (req, res) => res.render('homepage')); 
app.get('/studentlogin', (req, res) => res.render('./loginpages/studentloginpage')); 
app.get('/facultylogin', (req, res) => res.render('./loginpages/facultyloginpage')); 
app.get('/adminlogin', (req, res) => res.render('./loginpages/adminloginpage')); 

// Announcement creation for the admin
app.use("/", announcementRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
