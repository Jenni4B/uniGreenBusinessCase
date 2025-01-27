import express from 'express'; // ES6 module import
import { ensureGuest, ensureAuthenticated } from './middleware/ensureGuest.js';
import authRoutes from "./routes/authRoutes.js";

const app = express();
const PORT = 3000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Middleware
app.use(express.json()); // Parses JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data

// Routes
app.get('/', (req, res) => res.render('homepage')); // Root route
app.get('/studentlogin', (req, res) => res.render('studentlogin')); // Student login page
app.get('/facultylogin', (req, res) => res.render('facultylogin')); // Faculty login page
app.get('/adminlogin', (req, res) => res.render('adminlogin')); // Admin login page

// Authentication routes
app.use("/auth", authRoutes);

// Dashboard route (ensure user is authenticated and not a guest)
app.use('/dashboard', ensureAuthenticated, ensureGuest);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
