const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;
const DIRECTORY = path.join(__dirname, "uploads");

app.use(cors());
app.use(express.static("public")); // Serve frontend
app.use(express.static("uploads")); // Serve files

// Function to get directories (years/semesters)
function getDirectories(source) {
    return fs.readdirSync(source, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
}

// API to get available years
app.get("/years", (req, res) => {
    try {
        const years = getDirectories(DIRECTORY);
        res.json(years);
    } catch (err) {
        res.status(500).json({ error: "Error fetching years" });
    }
});

// API to get semesters for a selected year
app.get("/semesters/:year", (req, res) => {
    const yearPath = path.join(DIRECTORY, req.params.year);
    try {
        const semesters = getDirectories(yearPath);
        res.json(semesters);
    } catch (err) {
        res.status(500).json({ error: "Error fetching semesters" });
    }
});

// API to get Excel files for a selected year and semester
app.get("/files/:year/:semester", (req, res) => {
    const folderPath = path.join(DIRECTORY, req.params.year, req.params.semester);
    try {
        const files = fs.readdirSync(folderPath)
            .filter(file => file.endsWith(".xlsx") || file.endsWith(".xls"))
            .map(file => `${req.params.year}/${req.params.semester}/${file}`);
        res.json(files);
    } catch (err) {
        res.status(500).json({ error: "Error fetching files" });
    }
});

// Start server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
