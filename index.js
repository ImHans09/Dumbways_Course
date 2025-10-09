import express from 'express';
import { submitProject } from './assets/js/projects.js';
import { Pool } from 'pg';

// Create pool connection for connecting to PostgreSQL
const pool = new Pool({
  user: 'postgres',
  password: 'postgresql9',
  host: 'localhost',
  port: 5432,
  database: 'portfolio_web_db',
  max: 20,
  connectionTimeoutMillis: 0
})

// Initialize Express application
const app = express();

// Initialize Port
const port = 3000;

// Set view engine
app.set('view engine', 'hbs');

// Serve static files
app.use(express.static('assets'));

// Encoding request body content (body-parser)
app.use(express.urlencoded({ extended: false }));

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
  const data = {
    title: 'Introduce Myself',
    headline: 'Hi! Welcome to my website',
    author: 'Muhammad Rayhan Permana',
    role: 'Fullstack Developer',
    imagePath: 'images/img_github_profile.jpg',
    summary: summary,
    socials: socials
  };

  res.render('about', data);
});

// Route to Projects Page
app.get('/projects', async (req, res) => {
  const projects = await pool.query('SELECT id, name, year, duration_day, description, image_path, technologies FROM projects');
  projects.rows.forEach((item) => { item.technologies = item.technologies.join(', ') });

  const data = {
    title: 'Projects Page',
    formHeadline: 'Add new project',
    catalogHeadline: 'My Projects',
    projects: projects.rows
  };

  res.render('projects', data);
});

// Route for processing add new project input
app.post('/add-project', async (req, res) => {
  const project = submitProject(req.body);
  const query = 'INSERT INTO projects (name, year, start_date, end_date, duration_day, description, image_path, technologies) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)'
  const values = [project.name, project.year, project.startDate, project.endDate, project.duration, project.description, project.imagePath, project.technologies]

  await pool.query(query, values);

  res.redirect('projects');
});

// Route to Detail Project Page
app.get('/detail-project/:id', async (req, res) => {
  const projects = await pool.query(`SELECT id, name, year, to_char(start_date, 'YYYY-MM-DD') AS start_date, to_char(end_date, 'YYYY-MM-DD') AS end_date, duration_day, description, image_path, technologies FROM projects WHERE id = ${req.params.id}`);
  projects.rows.forEach((item) => { item.technologies = item.technologies.join(', ')});

  const data = projects.rows[0];

  res.render('detail_project', { data });
});

// Route to Contact Page
app.get('/contact', (req, res) => {
  const data = {
    title: 'Contact Page',
    formHeadline: 'Get in touch'
  };

  res.render('contact', data)
});

// Route for sending message
app.post('/send-message', (req, res) => {
  const messageData = req.body;
  console.log(`Name: ${messageData.username}\nEmail: ${messageData.email}\nPhone Number: ${messageData.phoneNumber}\nSubject: ${messageData.subject}\nMessage: ${messageData.message}`);

  res.redirect('contact');
});

// Run the application
app.listen(port, () => {
  console.log(`Application is listening at http://localhost:${port}`);
});