import bcrypt from 'bcrypt';
import express from 'express';
import flash from 'connect-flash';
import session from 'express-session';
import isEmail from 'validator/lib/isEmail.js';
import { Pool } from 'pg';
import { submitProject } from './assets/js/projects.js';
import { validatePhoneNumber, truncateString } from './assets/js/register.js';

// Create pool connection for connecting to PostgreSQL
const pool = new Pool({
  user: 'postgres',
  password: 'postgresql9',
  host: 'localhost',
  port: 5432,
  database: 'portfolio_web_db',
  max: 20,
  connectionTimeoutMillis: 0
});

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
app.use(session({ secret: 'secretKey', resave: false, saveUninitialized: true, cookie: { secure: false, maxAge: 3600000 } }));

// Use flash for alert messaging
app.use(flash());

// Route to About Page
app.get('/', (req, res) => {
  const summary = 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sunt amet, dignissimos deserunt minus facilis esse ex beatae accusamus ipsam adipisci hic distinctio tempore dolor ad aliquam inventore, dolorum, a iusto. Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam, quae labore! Totam quasi natus ab aspernatur? Assumenda quisquam dicta vero nostrum, architecto ex rerum temporibus quod, non odit ad beatae. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quidem vel ad est optio consectetur, hic impedit quam accusamus perspiciatis, suscipit, modi ducimus sint praesentium aspernatur quae quasi? Ullam, veniam blanditiis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora adipisci in molestias quisquam reprehenderit officiis, aliquam, itaque ex, voluptatum nemo repudiandae esse vel modi eligendi deserunt reiciendis excepturi sequi dolore.';
  const socials = [
    {
      url: 'https://linkedin.com/in/rayhan-permana',
      icon: 'fa-brands fa-square-linkedin'
    },
    {
      url: 'https://github.com/ImHans09',
      icon: 'fa-brands fa-square-github'
    },
    {
      url: '#',
      icon: 'fa-brands fa-square-instagram'
    },
    {
      url: '#',
      icon: 'fa-brands fa-square-x-twitter'
    }
  ];
  const userLastName = req.session.user?.lastName || '';
  const truncatedLastName = truncateString(userLastName, 16);
  const data = {
    title: 'Introduce Myself',
    headline: 'Hi! Welcome to my website',
    author: 'Muhammad Rayhan Permana',
    role: 'Fullstack Developer',
    imagePath: 'images/img_github_profile.jpg',
    summary: summary,
    socials: socials,
    userLastName: truncatedLastName
  };

  res.render('about', data);
});

// Route to Projects Page
app.get('/projects', async (req, res) => {
  const projects = await pool.query('SELECT id, name, year, duration_day, description, image_path, technologies FROM projects');
  projects.rows.forEach((item) => { item.technologies = item.technologies.join(', ') });

  const userLastName = req.session.user?.lastName || '';
  const truncatedLastName = truncateString(userLastName, 16);
  const data = {
    title: 'My Previous Projects',
    formHeadline: 'Add new project',
    catalogHeadline: 'My Projects',
    projects: projects.rows,
    userLastName: truncatedLastName
  };

  res.render('projects', data);
});

// Route for processing add new project input
app.post('/add-project', async (req, res) => {
  const project = submitProject(req.body);

  await pool.query(
    'INSERT INTO projects (name, year, start_date, end_date, duration_day, description, image_path, technologies) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
    [project.name, project.year, project.startDate, project.endDate, project.duration, project.description, project.imagePath, project.technologies]
  );

  res.redirect('projects');
});

// Route for deleting project
app.post('/delete-project/:id', async (req, res) => {
  const projectId = req.params.id;

  await pool.query('DELETE FROM projects WHERE id = $1', [projectId]);

  res.redirect('/projects');
});

// Route to Detail Project Page
app.get('/detail-project/:id', async (req, res) => {
  const projects = await pool.query(`SELECT id, name, year, to_char(start_date, 'YYYY-MM-DD') AS start_date, to_char(end_date, 'YYYY-MM-DD') AS end_date, duration_day, description, image_path, technologies FROM projects WHERE id = ${req.params.id}`);
  projects.rows.forEach((item) => { item.technologies = item.technologies.join(', ')});

  const userLastName = req.session.user?.lastName || '';

  if (!userLastName) {
    res.redirect('/login');
  }

  const truncatedLastName = truncateString(userLastName, 16);

  res.render('detail_project', { data: projects.rows[0], userLastName: truncatedLastName });
});

// Route to Contact Page
app.get('/contact', (req, res) => {
  const userLastName = req.session.user?.lastName || '';
  const truncatedLastName = truncateString(userLastName, 16);
  const data = {
    title: 'Contact Me',
    formHeadline: 'Get in touch',
    userLastName: truncatedLastName
  };

  res.render('contact', data);
});

// Route for sending message
app.post('/send-message', (req, res) => {
  const messageData = req.body;
  console.log(`Name: ${messageData.username}\nEmail: ${messageData.email}\nPhone Number: ${messageData.phoneNumber}\nSubject: ${messageData.subject}\nMessage: ${messageData.message}`);

  res.redirect('contact');
});

// Route to Register Page
app.get('/register', (req, res) => {
  const data = {
    title: 'Register Your Account',
    formHeadline: 'Create an account'
  };
  const alertMessage = req.flash('alertMessage')[0] || '';

  res.render('register', { data: data, alertMessage: alertMessage });
});

// Route for registering user account
app.post('/register-account', async (req, res) => {
  const { firstName, lastName, email, phoneNumber, password, verifyPassword } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const registeredEmails = await pool.query('SELECT email FROM users WHERE email = $1', [email]);

  if (!isEmail(email)) {
    req.flash('alertMessage', 'Please use a valid email');
    return res.redirect('register');
  }

  if (registeredEmails.rowCount > 0) {
    req.flash('alertMessage', 'This email has been already registered');
    return res.redirect('register');
  }

  if (!validatePhoneNumber(phoneNumber)) {
    req.flash('alertMessage', 'Phone number is invalid');
    return res.redirect('register');
  }

  if (password.length < 8) {
    req.flash('alertMessage', 'Password must be 8 characters or more');
    return res.redirect('register');
  }

  if (password !== verifyPassword) {
    req.flash('alertMessage', 'Failed to verify password');
    return res.redirect('register');
  }
  
  await pool.query(
    'INSERT INTO users (first_name, last_name, email, phone_number, password) VALUES ($1, $2, $3, $4, $5)',
    [firstName, lastName, email, phoneNumber, hashedPassword]
  );
  req.flash('successMessage', 'Account is created');
  
  res.redirect('login');
});

// Route to Login Page
app.get('/login', (req, res) => {
  const data = {
    title: 'Login to Your Account',
    formHeadline: 'Login to your account'
  };
  const successMessage = req.flash('successMessage')[0] || '';
  const alertMessage = req.flash('alertMessage')[0] || '';

  res.render('login', { data: data, successMessage: successMessage, alertMessage: alertMessage });
});

// Route for logging user account in
app.post('/login-account', async (req, res) => {
  const { email, password } = req.body;
  const registeredAccounts = await pool.query('SELECT last_name, email, password FROM users WHERE email = $1', [email]);

  if (registeredAccounts.rowCount === 0) {
    req.flash('alertMessage', 'There is not registered account with this email');
    return res.redirect('login');
  }

  const passwordMatched = await bcrypt.compare(password, registeredAccounts.rows[0].password);

  if (!passwordMatched) {
    req.flash('alertMessage', 'Password is incorrect');
    return res.redirect('login');
  }

  req.session.user = { 
    lastName: registeredAccounts.rows[0].last_name,
    email: registeredAccounts.rows[0].email 
  };

  res.redirect('/');
});

// Route for logging user account out
app.get('/logout-account', (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error('Error destroying session: ', error);
    }

    res.redirect('login');
  });
});

// Run the application
app.listen(port, () => {
  console.log(`Application is listening at http://localhost:${port}`);
});