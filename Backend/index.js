import express from 'express';
import mysql from 'mysql2';
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

const salt = 10;
const app = express();
const PORT = 3300;

dotenv.config();

// Middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["POST", "GET"],
  credentials: true
}));

app.options('*', cors());  // Handle preflight requests

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

db.connect((error) => {
  if (error) return console.log('Error connecting to MYSQL!', error);
  console.log('Connected to MYSQL database well!');
});

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;  
  if (!token) return res.status(401).send('You are not authenticated');
  
  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) return res.status(403).send('Token is not valid');
    
    req.name = decoded.name;  
    next();
  });
};

app.get('/Home', verifyUser, (req, res) => {
  return res.json({ status: "Success", name: req.name });  
});

// Registration Route
app.post('/Register', (req, res) => {
  const q = 'INSERT INTO students (first_name, last_name, phone_number, email, password) VALUES (?, ?, ?, ?, ?)';

  bcrypt.hash(req.body.password.toString(), salt, (error, hash) => {
    if (error) return res.status(500).send('Error hashing the password');

    const values = [
      req.body.first_name,
      req.body.last_name,
      req.body.phone_number,
      req.body.email,
      hash
    ];

    db.query(q, values, (error) => {
      if (error) return res.status(500).send('Error: ' + error.message);
      res.status(200).send('Success!');
    });
  });
});

// Login route
app.post('/', (req, res) => {
  const q = 'SELECT * FROM students WHERE email = ?';

  db.query(q, req.body.email, (error, data) => {
    if (error) return res.status(500).send('Error: ' + error.message);
    
    if (data.length > 0) {
      bcrypt.compare(req.body.password.toString(), data[0].password, (error, response) => {
        if (error) return res.status(500).send('Password compare error');
        
        if (response) { 
          const name = data[0].first_name;  
          const token = jwt.sign({ name }, process.env.JWT_SECRET, { expiresIn: "2m" });

          res.cookie('token', token, {
            httpOnly: true,
            secure: false,    
            sameSite: 'Lax',  
          });

          res.status(200).send('Success! Token set in cookie.');
        } else {
          return res.status(400).send('Error: Invalid password');
        }
      });
    } else {
      return res.status(400).send('Error: No user found with this email.');
    }
  });
});

// Logout route
app.post('/logout', (req, res) => {
  res.clearCookie('token');  // Clear the token cookie
  res.status(200).send('Logged out successfully');
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
