const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files
app.use(express.static('public'));

// Serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

app.get('/simulation', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/simulation.html'));
});

app.get('/documentation', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/documentation.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/about.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 