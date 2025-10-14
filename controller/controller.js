import bcrypt from 'bcrypt';
import isEmail from 'validator/lib/isEmail.js';
import { unlink } from 'fs';
import { pool } from '../database.js';
import { submitProject } from '../utils/projects.js';
import { validatePhoneNumber, truncateString } from '../utils/register.js';

function getAboutPage(req, res) {
  try {
    const userLastName = req.session.user?.lastName || '';
    const truncatedLastName = truncateString(userLastName, 16);
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
  } catch (error) {
    console.error('ERROR: ', error);
    res.send(500).send('Internal Server Error.');
  }
}

async function getProjectsPage(req, res) {
  try {
    const userLastName = req.session.user?.lastName || '';
    const truncatedLastName = truncateString(userLastName, 16);
    const query = {
      name: 'fetch-all-projects',
      text: 'SELECT id, name, year, duration_day, description, image_name, technologies FROM projects'
    };
    const projects = await pool.query(query);

    if (projects.rowCount > 0) {
      projects.rows.forEach((item) => { item.technologies = item.technologies.join(', ') });
    }

    const data = {
      title: 'My Previous Projects',
      formHeadline: 'Add new project',
      catalogHeadline: 'My Projects',
      projects: projects.rows,
      userLastName: truncatedLastName
    };
  
    res.render('projects', data);
  } catch (error) {
    console.error('ERROR: ', error);
    res.status(500).send('Internal Server Error');
  }
}

async function addProject(req, res) {
  try {
    const project = submitProject(req.body, req.file);
    const query = {
      name: 'insert-new-project',
      text: 'INSERT INTO projects (name, year, start_date, end_date, duration_day, description, image_name, technologies) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      values: [project.name, project.year, project.startDate, project.endDate, project.duration, project.description, project.imagePath, project.technologies]
    };

    await pool.query(query);

    res.redirect('projects');
  } catch (error) {
    console.error('ERROR: ', error);
    res.status(400).send('Bad Request');
  }
}

async function deleteProject(req, res) {
  try {
    const fetchProjectImageNameQuery = {
      name: 'fetch-project-image-name',
      text: 'SELECT image_name FROM projects WHERE id = $1',
      values: [req.params.id]
    };
    const project = await pool.query(fetchProjectImageNameQuery);

    unlink(`assets/uploads/project_images/${project.rows[0].image_name}`, (error) => {
      if (error) {
        console.error('ERROR: ', error);
        return;
      }
    });

    const deleteProjectQuery = {
      name: 'delete-project',
      text: 'DELETE FROM projects WHERE id = $1',
      values: [req.params.id]
    };
    await pool.query(deleteProjectQuery);

    res.redirect('/projects');
  } catch (error) {
    console.error('ERROR: ', error);
    res.status(400).send('Bad Request');
  }
}

async function getDetailProjectPage(req, res) {
  try {
    const userLastName = req.session.user?.lastName || '';
    
    if (!userLastName) {
      return res.redirect('/login');
    }

    const query = {
      name: 'fetch-detail-project',
      text: "SELECT id, name, year, to_char(start_date, 'YYYY-MM-DD') AS start_date, to_char(end_date, 'YYYY-MM-DD') AS end_date, duration_day, description, image_name, technologies FROM projects WHERE id = $1",
      values: [req.params.id]
    };
    const projects = await pool.query(query);

    if (projects.rowCount === 0) {
      return res.redirect('/projects');
    }

    projects.rows.forEach((item) => { item.technologies = item.technologies.join(', ')});

    const truncatedLastName = truncateString(userLastName, 16);

    res.render('detail_project', { data: projects.rows[0], userLastName: truncatedLastName });
  } catch (error) {
    console.error('ERROR: ', error);
    res.status(400).send('Bad Request');
  }
}

function getContactPage(req, res) {
  try {
    const userLastName = req.session.user?.lastName || '';
    const truncatedLastName = truncateString(userLastName, 16);
    const data = {
      title: 'Contact Me',
      formHeadline: 'Get in touch',
      userLastName: truncatedLastName
    };

    res.render('contact', data);
  } catch (error) {
    console.error('ERROR: ', error);
    res.send(500).send('Internal Server Error.');
  }
}

function sendUserMessage(req, res) {
  try {
    const messageData = req.body;
    console.log(`Name: ${messageData.username}\nEmail: ${messageData.email}\nPhone Number: ${messageData.phoneNumber}\nSubject: ${messageData.subject}\nMessage: ${messageData.message}`);

    res.redirect('contact');
  } catch (error) {
    console.error('ERROR: ', error);
    res.status(400).send('Bad Request');
  }
}

function getRegisterPage(req, res) {
  try {
    const data = {
      title: 'Register Your Account',
      formHeadline: 'Create an account'
    };
    const alertMessage = req.flash('alertMessage')[0] || '';

    res.render('register', { data: data, alertMessage: alertMessage });
  } catch (error) {
    console.error('ERROR: ', error);
    res.status(500).send('Internal Server Error');
  }
}

async function registerUserAccount(req, res) {
  try {
    const { firstName, lastName, email, phoneNumber, password, verifyPassword } = req.body;

    if (!isEmail(email)) {
      req.flash('alertMessage', 'Please use a valid email');
      return res.redirect('register');
    }
    
    const fetchUserEmailQuery = {
      name: 'fetch-user-email',
      text: 'SELECT email FROM users WHERE email = $1',
      values: [email]
    };
    const registeredEmails = await pool.query(fetchUserEmailQuery);

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

    const hashedPassword = await bcrypt.hash(password, 10);
    const insertUserQuery = {
      name: 'insert-user',
      text: 'INSERT INTO users (first_name, last_name, email, phone_number, password) VALUES ($1, $2, $3, $4, $5)',
      values: [firstName, lastName, email, phoneNumber, hashedPassword]
    };

    await pool.query(insertUserQuery);

    req.flash('successMessage', 'Account is created');
    res.redirect('login');
  } catch (error) {
    console.error('ERROR: ', error);
    res.status(400).send('Bad Request');
  }
}

function getLoginPage(req, res) {
  try {
    const data = {
      title: 'Login to Your Account',
      formHeadline: 'Login to your account'
    };
    const successMessage = req.flash('successMessage')[0] || '';
    const alertMessage = req.flash('alertMessage')[0] || '';

    res.render('login', { data: data, successMessage: successMessage, alertMessage: alertMessage });
  } catch (error) {
    console.error('ERROR: ', error);
    res.status(500).send('Internal Server Error');
  }
}

async function loginUserAccount(req, res) {
  try {
    const { email, password } = req.body;

    if (!isEmail(email)) {
      req.flash('alertMessage', 'Email is invalid');
      return res.redirect('login');
    }

    const query = {
      name: 'fetch-user-data',
      text: 'SELECT last_name, email, password FROM users WHERE email = $1',
      values: [email]
    };
    const registeredAccounts = await pool.query(query);

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
  } catch (error) {
    console.error('ERROR: ', error);
    res.status(400).send('Bad Request');
  }
}

function logoutUserAccount(req, res) {
  try {
    req.session.destroy((error) => {
      if (error) {
        console.error('ERROR: ', error);
      }

      res.redirect('/');
    });
  } catch (error) {
    console.error('ERROR: ', error);
    res.status(400).send('Bad Request');
  }
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