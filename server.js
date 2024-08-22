const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Симуляция базы данных пользователей
const users = {
    "aqa": "AQA123",
    "test": "test123",
    "admin": "admin"
};

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

   
    if (!username && !password) {
        return res.json({ status: "success", message: "Logged in successfully" });
    }

    if (users[username]) {
        if (users[username] === password) {
            res.json({ status: "success", message: "Logged in successfully" });
        } else {
      
            res.status(401).json({ status: "error", message: "Incorrect password" });
        }
    } else {
        res.status(404).json({ status: "error", message: "User not found" });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/welcome', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'welcome.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});