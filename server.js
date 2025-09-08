const multer = require('multer');
const path = require('path');



const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Serve static files (HTML, CSS, images)
app.use(express.static('public'));

// API route to get projects
app.get('/api/projects', (req, res) => {
  fs.readFile('projects.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: "Failed to load projects" });
    } else {
      res.json(JSON.parse(data));
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

app.use(express.json()); // make sure this line exists

// Add new project
app.post('/api/add-project', (req, res) => {
  const newProject = req.body;

  fs.readFile('projects.json', 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read projects" });

    const projects = JSON.parse(data);
    projects.push(newProject);

    fs.writeFile('projects.json', JSON.stringify(projects, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Failed to save project" });
      res.json({ message: "Project added successfully" });
    });
  });
});

// Delete project by index
app.post('/api/delete-project', (req, res) => {
  const { index } = req.body;

  fs.readFile('projects.json', 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read projects" });

    const projects = JSON.parse(data);
    if (index < 0 || index >= projects.length)
      return res.status(400).json({ error: "Invalid project index" });

    projects.splice(index, 1); // remove project

    fs.writeFile('projects.json', JSON.stringify(projects, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Failed to save projects" });
      res.json({ message: "Project deleted successfully" });
    });
  });
});
app.use(express.static('public'));


const express = require('express');
const fs = require('fs');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static('public'));
app.use(express.json());

// Setup multer to store uploaded images in public/images/
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images'); // store here
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // unique name
  }
});
const upload = multer({ storage });

// API to get projects
app.get('/api/projects', (req, res) => {
  fs.readFile('projects.json', 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to load projects' });
    res.json(JSON.parse(data));
  });
});

// API to add project
app.post('/api/add-project', upload.single('image'), (req, res) => {
  const project = {
    title: req.body.title,
    description: req.body.description,
    link: req.body.link,
    image: req.file ? `images/${req.file.filename}` : ''
  };

  fs.readFile('projects.json', 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to load projects' });
    const projects = JSON.parse(data);
    projects.push(project);
    fs.writeFile('projects.json', JSON.stringify(projects, null, 2), (err) => {
      if (err) return res.status(500).json({ error: 'Failed to save project' });
      res.json({ success: true, project });
    });
  });
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
