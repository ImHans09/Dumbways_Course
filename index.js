import express from 'express';
import { submitProject, projects } from './assets/js/projects.js';

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
app.get('/projects', (req, res) => {
  const data = {
    title: 'Projects Page',
    formHeadline: 'Add new project',
    catalogHeadline: 'My Projects',
    projects: projects
  };

  res.render('projects', data);
});

// Route for processing add new project input
app.post('/add-project', (req, res) => {
  submitProject(req.body);

  res.redirect('projects');
});

// Route to Contact Page
app.get('/contact', (req, res) => {
  const data = {
    title: 'Contact Page',
    formHeadline: 'Get in touch'
  };

  res.render('contact', data)
});

// Route to Detail Project Page
app.get('/detail-project/:id', (req, res) => {
  const project = projects.find((project) => project.id === Number(req.params.id));

  res.render('detail_project', { project });
});

// Run the application
app.listen(port, () => {
  console.log(`Application is listening at http://localhost:${port}`);
});