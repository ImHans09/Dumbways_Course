import express from 'express';

// Initialize Express application
const app = express();

// Initialize Port
const port = 3000;

// Set view engine
app.set('view engine', 'ejs');

// Serve static files
app.use(express.static('assets'));

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
  const projects = [
    {
      id: 1,
      name: "Academic Information System",
      year: "2022",
      startDate: "2022-02-15",
      endDate: "2022-06-15",
      duration: 120,
      description: "The Academic Information System is a comprehensive web-based platform designed to streamline the management of student data, class schedules, and academic grades. It offers an intuitive admin dashboard that allows faculty and administrators to easily input, update, and retrieve essential academic records. One of its key features is the automated generation of transcripts and progress reports, which reduces administrative workload and minimizes errors. The system also integrates role-based access control, ensuring that teachers, students, and administrators have the appropriate level of access. In addition, it provides reporting tools for performance analytics, helping institutions monitor student success over time. Ultimately, this system enhances the efficiency of academic administration and improves the overall learning experience for students.",
      technologies: ["Laravel", "Vue JS"].join(', '),
      imagePath: "images/sample_academic_information_system.png"
    },
    {
      id: 2,
      name: "Fashion E-Commerce",
      year: "2023",
      startDate: "2023-03-10",
      endDate: "2023-09-06",
      duration: 180,
      description: "The Fashion E-Commerce project is an online shopping platform that focuses exclusively on clothing, accessories, and lifestyle products. It allows users to browse through thousands of items, filter results by brand or category, and add products to a shopping cart with ease. The platform integrates secure online payment gateways and supports multiple transaction methods, ensuring a smooth checkout process for customers. A real-time order tracking feature keeps buyers informed of their delivery status at every stage. Additionally, the system provides sellers with analytical tools to manage inventory and monitor sales trends effectively. With its responsive design and rich catalog, this application aims to deliver a seamless and enjoyable shopping experience to fashion enthusiasts worldwide.",
      technologies: ["React JS", "Node JS"].join(', '),
      imagePath: "images/sample_academic_information_system.png"
    },
    {
      id: 3,
      name: "To-Do List Mobile",
      year: "2021",
      startDate: "2021-07-01",
      endDate: "2021-08-30",
      duration: 60,
      description: "The To-Do List Mobile app is a lightweight yet powerful productivity tool designed to help users organize their daily tasks efficiently. It features a clean and simple interface that allows quick task creation and categorization. Users can set reminders to receive timely notifications, ensuring that important activities are never missed. The app also supports grouping tasks by categories, which helps in prioritizing academic, professional, or personal responsibilities. With offline functionality, tasks can be managed even without an internet connection, and data syncs automatically when back online. This mobile application is especially beneficial for students and professionals who need to maintain focus and maximize productivity in their daily lives.",
      technologies: ["React JS"].join(', '),
      imagePath: "images/sample_academic_information_system.png"
    },
    {
      id: 4,
      name: "Smart Parking System",
      year: "2024",
      startDate: "2024-05-20",
      endDate: "2024-10-17",
      duration: 150,
      description: "The Smart Parking System is an IoT-driven solution developed to tackle the increasing challenges of urban parking. It uses sensors installed in parking spaces to detect availability in real time and updates the system instantly. Through a connected mobile application, users can check available slots before arriving at their destination, reducing traffic congestion and saving time. The system also includes features such as digital payments and automated gate access for a fully seamless parking experience. Administrators benefit from analytics on space usage, peak hours, and maintenance requirements, which can inform future infrastructure planning. By integrating modern IoT technology, this project contributes to smarter, more sustainable cities.",
      technologies: ["Node JS", "Angular JS"].join(', '),
      imagePath: "images/sample_academic_information_system.png"
    },
    {
      id: 5,
      name: "Learning Management System",
      year: "2020",
      startDate: "2020-09-05",
      endDate: "2021-05-03",
      duration: 240,
      description: "The Learning Management System is a robust e-learning platform that empowers educators and students to engage in digital learning seamlessly. It supports course creation with multimedia resources, interactive quizzes, and assignments that can be submitted online. A built-in discussion forum encourages collaboration and peer-to-peer interaction among learners. The system tracks student progress and provides instant feedback through automated grading features. Furthermore, participants receive digital certificates upon course completion, enhancing their academic or professional portfolios. By bridging the gap between traditional learning and modern digital education, this LMS provides a flexible, scalable, and engaging environment for learners across the globe.",
      technologies: ["Django", "React JS"].join(', '),
      imagePath: "images/sample_academic_information_system.png"
    },
    {
      id: 6,
      name: "Travel Booking App",
      year: "2023",
      startDate: "2023-08-12",
      endDate: "2024-03-10",
      duration: 210,
      description: "The Travel Booking App is a comprehensive mobile solution for booking flights, hotels, and holiday packages in one place. It simplifies the travel planning process by offering personalized recommendations based on user preferences and past bookings. The app supports secure payment integrations with multiple digital wallets and bank cards, ensuring convenience and safety for users. A dynamic search and filter system enables travelers to quickly find the best deals available. The app also provides itinerary management features, allowing users to keep all booking details organized in a single view. By combining convenience, affordability, and reliability, this app helps travelers enjoy stress-free journeys from planning to arrival.",
      technologies: ["Laravel", "Vue JS"].join(', '),
      imagePath: "images/sample_academic_information_system.png"
    }
  ];
  const data = {
    title: 'Projects Page',
    formHeadline: 'Add new project',
    catalogHeadline: 'My Projects',
    projects: projects
  };

  res.render('projects', data);
});

// Route to Contact Page
app.get('/contact', (req, res) => {
  const data = {
    title: 'Contact Page',
    formHeadline: 'Get in touch'
  };

  res.render('contact', data)
});

// Run the application
app.listen(port, () => {
  console.log(`Application is listening at http://localhost:${port}`);
});