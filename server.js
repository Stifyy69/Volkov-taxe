const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

const users = [{ username: 'admin', password: 'admin' }];
let cnpLogs = [];

app.get('/', (req, res) => {
    if (req.session.loggedin) {
        res.redirect('/dashboard');
    } else {
        res.render('login');
    }
});

app.post('/auth', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        req.session.loggedin = true;
        req.session.username = username;
        res.redirect('/dashboard');
    } else {
        res.send('User sau parola incorecta!');
    }
});

app.get('/dashboard', (req, res) => {
    if (req.session.loggedin) {
        res.render('dashboard', { logs: cnpLogs });
    } else {
        res.redirect('/');
    }
});

app.post('/submit-cnp', (req, res) => {
    if (req.session.loggedin) {
        const { cnp } = req.body;
        const timestamp = new Date().toLocaleString('ro-RO', { timeZone: 'Europe/Bucharest' });
        cnpLogs.push({ cnp, timestamp });
        res.redirect('/dashboard');
    } else {
        res.redirect('/');
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
