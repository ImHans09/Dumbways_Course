import express from 'express';
import flash from 'connect-flash';
import session from 'express-session';
import controller from './controller/controller.js';
import { upload } from './utils/utility.js';

// Initialize Express application
const app = express();

// Initialize Port
const port = 3000;

// Set view engine
app.set('view engine', 'hbs');

// Serve static files
app.use(express.static('assets'));

// Encode request body content (body-parser)
app.use(express.urlencoded({ extended: false }));

// Create session
app.use(session({ 
  secret: 'secretKey', 
  resave: false, 
  saveUninitialized: true, 
  cookie: { secure: false, maxAge: 3600000 } 
}));

// Use flash for alert messaging
app.use(flash());

// Route to About Page
app.get('/', controller.getAboutPage);

// Route to Projects Page
app.get('/projects', controller.getProjectsPage);

// Route for processing add new project input
app.post('/add-project', upload.single('projectImage'), controller.addProject);

// Route for deleting project
app.post('/delete-project/:id', controller.deleteProject);

// Route to Detail Project Page
app.get('/detail-project/:id', controller.getDetailProjectPage);

// Route to Contact Page
app.get('/contact', controller.getContactPage);

// Route for sending message
app.post('/send-message', controller.sendUserMessage);

// Route to Register Page
app.get('/register', controller.getRegisterPage);

// Route for registering user account
app.post('/register-account', controller.registerUserAccount);

// Route to Login Page
app.get('/login', controller.getLoginPage);

// Route for logging user account in
app.post('/login-account', controller.loginUserAccount);

// Route for logging user account out
app.get('/logout-account', controller.logoutUserAccount);

// Run the application
app.listen(port, () => {
  console.log(`Application is listening at http://localhost:${port}`);
});