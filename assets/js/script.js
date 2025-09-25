const projects = [
  {
    id: 1,
    name: "Academic Information System",
    year: "2022",
    duration: 4,
    description: "A web-based application for managing student data, class schedules, and grades. This system is designed with an easy-to-use admin dashboard.",
    image_url: "/assets/images/sample_academic_information_system.png"
  },
  {
    id: 2,
    name: "Fashion E-Commerce",
    year: "2023",
    duration: 6,
    description: "An online shopping platform specializing in fashion products with shopping cart and online payment features. Users can also track their order status in real time.",
    image_url: "/assets/images/sample_academic_information_system.png"
  },
  {
    id: 3,
    name: "To-Do List Mobile",
    year: "2021",
    duration: 2,
    description: "An Android app for recording daily activities with a simple interface. Equipped with reminders and activity categories for better organization.",
    image_url: "/assets/images/sample_academic_information_system.png"
  },
  {
    id: 4,
    name: "Smart Parking System",
    year: "2024",
    duration: 5,
    description: "An IoT-based automated parking system that displays real-time slot availability. Users can view parking information via a mobile app.",
    image_url: "/assets/images/sample_academic_information_system.png"
  },
  {
    id: 5,
    name: "Learning Management System",
    year: 2020,
    duration: 8,
    description: "An e-learning platform with online courses, interactive quizzes, and discussion forums. The system also provides digital certificates for participants.",
    image_url: "/assets/images/sample_academic_information_system.png"
  },
  {
    id: 6,
    name: "Travel Booking App",
    year: "2023",
    duration: 7,
    description: "A mobile application for booking airline tickets, hotels, and tour packages. It supports various digital payment methods for user convenience.",
    image_url: "/assets/images/sample_academic_information_system.png"
  }
];


const projectCardContainer = document.getElementById('projectCardContainer');

projects.forEach((project) => {
  const projectCard = document.createElement('div');
  projectCard.classList.add('col-12', 'col-md-6', 'col-lg-4', 'text-decoration-none');

  projectCard.innerHTML = `<div id="projectCard" class="card shadow">
            <a href="/detail_project.html">
              <img src="${project.image_url}" class="card-img-top p-2 rounded-4" alt="Photo Profile">
            </a>
            <div class="card-body d-flex flex-column gap-3">
              <div class="d-flex flex-column gap-2">
                <div class="d-flex flex-column">
                  <a href="/detail_project.html" class="card-title m-0">${project.name}</a>
                  <span>${project.year}</span>
                </div>
                <span>Duration: ${project.duration} month(s)</span>
              </div>
              <p class="card-text">${project.description}</p>
              <div class="row d-flex p-0">
                <div class="col d-grid">
                  <a href="#" class="btn btn-primary fw-medium">Edit</a>
                </div>
                <div class="col-auto d-grid">
                  <a href="#" class="btn btn-danger fw-medium">
                    <i class="fa-solid fa-trash"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>`;
  
  projectCardContainer.appendChild(projectCard);
});