const project = JSON.parse(localStorage.getItem('selectedProject'));

if (project) {
  document.getElementById('projectName').innerText = project.name;
  // document.getElementById('projectDetailImage').src = project.imagePath;
  document.getElementById('projectDate').innerText = `${project.startDate} - ${project.endDate}`;
  document.getElementById('projectDuration').innerText = `${project.duration} day(s)`;
  document.getElementById('projectTechnologies').innerText = project.technologies;
  document.getElementById('projectDetailDescription').innerText = project.description;
}

console.log(JSON.stringify(project))