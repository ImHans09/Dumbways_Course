import bcrypt from 'bcrypt';
import isEmail from 'validator/lib/isEmail.js';
import { unlink } from 'fs';
import { pool } from '../database.js';
import { submitProject } from '../utils/projects.js';
import { validatePhoneNumber, truncateString } from '../utils/register.js';

function getAboutPage(req, res) {
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
}

async function getProjectsPage(req, res) {
  const projects = await pool.query('SELECT id, name, year, duration_day, description, image_name, technologies FROM projects');
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
}

async function addProject(req, res) {
  const project = submitProject(req.body, req.file);

  await pool.query(
    'INSERT INTO projects (name, year, start_date, end_date, duration_day, description, image_name, technologies) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
    [project.name, project.year, project.startDate, project.endDate, project.duration, project.description, project.imagePath, project.technologies]
  );

  res.redirect('projects');
}

async function deleteProject(req, res) {
  const project = await pool.query('SELECT * FROM projects WHERE id = $1', [req.params.id]);
  console.log(project.rows[0].image_name);

  unlink(`assets/uploads/project_images/${project.rows[0].image_name}`, (err) => {
    console.error('Error:', err);
  });
  await pool.query('DELETE FROM projects WHERE id = $1', [req.params.id]);

  res.redirect('/projects');
}

async function getDetailProjectPage(req, res) {
  const projects = await pool.query("SELECT id, name, year, to_char(start_date, 'YYYY-MM-DD') AS start_date, to_char(end_date, 'YYYY-MM-DD') AS end_date, duration_day, description, image_name, technologies FROM projects WHERE id = $1", [req.params.id]);
  projects.rows.forEach((item) => { item.technologies = item.technologies.join(', ')});

  const userLastName = req.session.user?.lastName || '';

  if (!userLastName) {
    return res.redirect('/login');
  }

  const truncatedLastName = truncateString(userLastName, 16);

  res.render('detail_project', { data: projects.rows[0], userLastName: truncatedLastName });
}

function getContactPage(req, res) {
  const userLastName = req.session.user?.lastName || '';
  const truncatedLastName = truncateString(userLastName, 16);
  const data = {
    title: 'Contact Me',
    formHeadline: 'Get in touch',
    userLastName: truncatedLastName
  };

  res.render('contact', data);
}

function sendUserMessage(req, res) {
  const messageData = req.body;
  console.log(`Name: ${messageData.username}\nEmail: ${messageData.email}\nPhone Number: ${messageData.phoneNumber}\nSubject: ${messageData.subject}\nMessage: ${messageData.message}`);

  res.redirect('contact');
}

function getRegisterPage(req, res) {
  const data = {
    title: 'Register Your Account',
    formHeadline: 'Create an account'
  };
  const alertMessage = req.flash('alertMessage')[0] || '';

  res.render('register', { data: data, alertMessage: alertMessage });
}

async function registerUserAccount(req, res) {
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
}

function getLoginPage(req, res) {
  const data = {
    title: 'Login to Your Account',
    formHeadline: 'Login to your account'
  };
  const successMessage = req.flash('successMessage')[0] || '';
  const alertMessage = req.flash('alertMessage')[0] || '';

  res.render('login', { data: data, successMessage: successMessage, alertMessage: alertMessage });
}

async function loginUserAccount(req, res) {
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
}

function logoutUserAccount(req, res) {
  req.session.destroy((error) => {
    if (error) {
      console.error('Error destroying session: ', error);
    }

    res.redirect('/');
  });
}

export default {
  getAboutPage,
  getProjectsPage,
  addProject,
  deleteProject,
  getDetailProjectPage,
  getContactPage,
  sendUserMessage,
  getRegisterPage,
  registerUserAccount,
  getLoginPage,
  loginUserAccount,
  logoutUserAccount 
};