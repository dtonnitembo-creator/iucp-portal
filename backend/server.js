const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/iucp')
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// 🧩 Schemas
const UserSchema = new mongoose.Schema({
    name: String,
    university: String,
    email: String
});

const ProjectSchema = new mongoose.Schema({
    title: String,
    description: String,
    members: [String]
});

const User = mongoose.model('User', UserSchema);
const Project = mongoose.model('Project', ProjectSchema);

// 🔹 ROUTES

// Register User
app.post('/register', async (req, res) => {
    const user = new User(req.body);
    await user.save();
    res.json(user);
});

// Get Users
app.get('/users', async (req, res) => {
    const users = await User.find();
    res.json(users);
});

// Create Project
app.post('/projects', async (req, res) => {
    const project = new Project(req.body);
    await project.save();
    res.json(project);
});

// Get Projects
app.get('/projects', async (req, res) => {
    const projects = await Project.find();
    res.json(projects);
});
// Delete Projects
app.delete('/projects/:id', async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.json({ message: "Project deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Seed dummy data (for demo)
app.get('/seed', async (req, res) => {
    await User.deleteMany({});
    await Project.deleteMany({});

    const users = await User.insertMany([
        { name: "Alice", university: "University of Zimbabwe", email: "alice@uz.ac.zw" },
        { name: "Brian", university: "NUST", email: "brian@nust.ac.zw" },
        { name: "Chipo", university: "Midlands State University", email: "chipo@msu.ac.zw" }
    ]);

    const projects = await Project.insertMany([
        { title: "AI Research", description: "Cross-university AI collaboration", members: ["Alice", "Brian"] },
        { title: "Blockchain Voting", description: "Secure voting system", members: ["Chipo"] }
    ]);

    res.json({ users, projects });
});

// 🚀 Start Server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

