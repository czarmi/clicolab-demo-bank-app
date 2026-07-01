require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'auth-service' }));
app.use('/', authRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`CLICOLAB auth-service listening on port ${PORT}`));
