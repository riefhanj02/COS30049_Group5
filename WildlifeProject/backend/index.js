// Import necessary modules
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const app = express();
const PORT = process.env.PORT || 3000;

require('dotenv').config();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// AES Encryption Config
const aesKey = Buffer.from(process.env.AES_KEY, 'hex');
const aesIV = Buffer.from(process.env.AES_IV, 'hex');

// Database Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    process.exit(1); // Exit if database connection fails
  }
  console.log('Connected to MySQL');
});

// Multer Config for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads/profile_pictures';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const isValidType = allowedTypes.test(file.mimetype);
    if (isValidType) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, JPG, and PNG are allowed.'));
    }
  },
});

// Encryption Functions
function encrypt(text) {
  try {
    const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, aesIV);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  } catch (err) {
    console.error('Encryption error:', err.message);
    return null;
  }
}

function decrypt(encryptedText) {
  try {
    const decipher = crypto.createDecipheriv('aes-256-cbc', aesKey, aesIV);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    console.error('Decryption error:', err.message);
    return 'Decryption Failed';
  }
}

// Routes

// Health Check
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

// Get All User Profiles
app.get('/userprofile', (req, res) => {
  const sql = 'SELECT * FROM userprofile';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching user profiles:', err.message);
      return res.status(500).json({ error: 'Failed to fetch user profiles' });
    }
    res.json(results);
  });
});

// Admin Dashboard CRUD Operations

// Get All Admin Users
app.get('/admin/dashboard', (req, res) => {
  const sql = 'SELECT * FROM admin_dashboard';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching admin users:', err.message);
      return res.status(500).json({ error: 'Failed to fetch admin users' });
    }
    res.json(results);
  });
});

// Update Admin by ID
app.put('/admin/dashboard/:id', (req, res) => {
  const { id } = req.params;
  const { username, email, privileges } = req.body;

  const sql = `
    UPDATE admin_dashboard
    SET username = ?, email = ?, privileges = ?
    WHERE id = ?
  `;
  db.query(sql, [username, email, privileges, id], (err, result) => {
    if (err) {
      console.error('Error updating admin:', err.message);
      return res.status(500).json({ error: 'Failed to update admin' });
    }
    res.json({ message: 'Admin updated successfully' });
  });
});

// Delete Admin by ID
app.delete('/admin/dashboard/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM admin_dashboard WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting admin:', err.message);
      return res.status(500).json({ error: 'Failed to delete admin' });
    }
    res.json({ message: 'Admin deleted successfully' });
  });
});

// Get All GPS Data
app.get('/gps_data', (req, res) => {
  const sql = 'SELECT * FROM gps_data ORDER BY timestamp DESC';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching GPS data:', err.message);
      return res.status(500).json({ error: 'Failed to fetch GPS data' });
    }
    res.json(results);
  });
});

// Update GPS Data by ID
app.put('/gps_data/:id', (req, res) => {
  const { id } = req.params;
  const { latitude, longitude } = req.body;

  const sql = `
    UPDATE gps_data
    SET latitude = ?, longitude = ?
    WHERE id = ?
  `;
  db.query(sql, [latitude, longitude, id], (err, result) => {
    if (err) {
      console.error('Error updating GPS data:', err.message);
      return res.status(500).json({ error: 'Failed to update GPS data' });
    }
    res.json({ message: 'GPS data updated successfully' });
  });
});

// Get All Donations
app.get('/donations', (req, res) => {
  const sql = 'SELECT * FROM donations';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching donations:', err.message);
      return res.status(500).json({ error: 'Failed to fetch donations' });
    }
    res.json(results);
  });
});

app.post('/donations', (req, res) => {
  console.log('Donation request received:', req.body); // Add this line
  const { email, amount_myr, purpose, comments } = req.body;

  if (!email || !amount_myr || !purpose) {
    return res.status(400).json({ error: 'Email, donation amount, and purpose are required.' });
  }

  const sql = 'INSERT INTO donations (email, amount_myr, purpose, comments) VALUES (?, ?, ?, ?)';
  db.query(sql, [email, amount_myr, purpose, comments], (err, result) => {
    if (err) {
      console.error('Error processing donation:', err);
      return res.status(500).json({ error: 'Server error processing donation' });
    }

    res.status(201).json({ message: 'Donation successful', donationId: result.insertId });
  });
});


// User Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const sql = 'SELECT * FROM userprofile WHERE email = ?';
  db.query(sql, [email], async (err, result) => {
    if (err) {
      console.error('Error fetching user profile:', err.message);
      return res.status(500).json({ error: 'Server error' });
    }

    if (result.length === 0 || !(await bcrypt.compare(password, result[0].confirmed_password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.status(200).json({ user: result[0] });
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
