const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'registrations.json');
const BELT_TEST_FILE = path.join(__dirname, 'belt-test-registrations.json');

app.use(cors());
app.use(bodyParser.json());

// Ensure the data files exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, '[]');
}
if (!fs.existsSync(BELT_TEST_FILE)) {
  fs.writeFileSync(BELT_TEST_FILE, '[]');
}

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mahalaxmipatternworks2007@gmail.com',
    pass: 'aaia noab izpa nofd'
  }
});

// POST: Add new belt test registration (prevent duplicate user ID)
app.post('/api/belt-test-register', async (req, res) => {
  try {
    const {
      userid,
      name,
      address,
      mobile,
      email,
      currentbelt,
      dob,
      emergency,
      selfdeclaration
    } = req.body;

    // Validate required fields
    if (!userid || !name || !email) {
      return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }

    let beltTestRegistrations = JSON.parse(fs.readFileSync(BELT_TEST_FILE));
    // Prevent duplicate userid
    if (beltTestRegistrations.some(r => r.userid === userid)) {
      return res.status(400).json({ success: false, message: 'User ID already exists' });
    }

    const newRegistration = {
      userid,
      name,
      address,
      mobile,
      email,
      currentbelt,
      dob,
      emergency,
      selfdeclaration
    };

    beltTestRegistrations.push(newRegistration);
    fs.writeFileSync(BELT_TEST_FILE, JSON.stringify(beltTestRegistrations, null, 2));
    res.json({ success: true });
  } catch (err) {
    console.error('Belt test registration error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET: Fetch all belt test registrations
app.get('/api/belt-test-registrations', (req, res) => {
  const registrations = JSON.parse(fs.readFileSync(BELT_TEST_FILE));
  res.json(registrations);
});

// PUT: Edit belt test registration by user ID
app.put('/api/belt-test-registrations/:userid', (req, res) => {
  const userid = req.params.userid;
  let registrations = JSON.parse(fs.readFileSync(BELT_TEST_FILE));
  const idx = registrations.findIndex(r => r.userid === userid);
  if (idx !== -1) {
    // Prevent changing to an existing user ID
    if (
      req.body.userid !== userid &&
      registrations.some(r => r.userid === req.body.userid)
    ) {
      return res.status(400).json({ success: false, message: 'User ID already exists' });
    }
    registrations[idx] = req.body;
    fs.writeFileSync(BELT_TEST_FILE, JSON.stringify(registrations, null, 2));
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false, message: 'User not found' });
  }
});

// DELETE: Remove belt test registration by user ID
app.delete('/api/belt-test-registrations/:userid', (req, res) => {
  const userid = req.params.userid;
  let registrations = JSON.parse(fs.readFileSync(BELT_TEST_FILE));
  const newRegs = registrations.filter(r => r.userid !== userid);
  if (newRegs.length !== registrations.length) {
    fs.writeFileSync(BELT_TEST_FILE, JSON.stringify(newRegs, null, 2));
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false, message: 'User not found' });
  }
});

// POST: Website registration (for register.html) with email notification, unique userid and password
app.post('/api/register', async (req, res) => {
  const { name, email, phone, program } = req.body;
  let data = JSON.parse(fs.readFileSync(DATA_FILE));

  // Prevent duplicate email
  if (data.some(r => r.email === email)) {
    return res.status(400).json({ success: false, message: 'Email already registered' });
  }

  // Generate unique 8-digit userid
  let userid;
  do {
    userid = Math.floor(10000000 + Math.random() * 90000000).toString();
  } while (data.some(r => r.userid === userid));

  // Generate unique 8-character password
  const password = crypto.randomBytes(6).toString('base64').slice(0, 8);

  // Save registration
  const newUser = { userid, name, email, phone, program, password, date: new Date().toISOString() };
  data.push(newUser);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

  // Send email notification
  try {
    await transporter.sendMail({
      from: '"Pamma\'s Taekwondo Academy" <mahalaxmipatternworks2007@gmail.com>',
      to: email,
      subject: 'Registration Successful - Pamma\'s Taekwondo Academy',
      html: `
        <h2>Hi ${name},</h2>
        <p>Thank you for registering for <b>${program}</b> at Pamma's Taekwondo Academy.</p>
        <p>Your registration is successful!</p>
        <p><b>User ID:</b> ${userid}<br>
        <b>Password:</b> ${password}</p>
        <p>We have received your registration details.<br>
        We will contact you soon at <b>${phone}</b> if needed.</p>
        <p>Regards,<br>Pamma's Taekwondo Academy</p>
      `
    });
    res.json({ success: true, userid, password });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ success: false, message: 'Registration saved, but email failed to send.' });
  }
});

// GET: Fetch all website registrations (optional, for admin)
app.get('/api/registrations', (req, res) => {
  const registrations = JSON.parse(fs.readFileSync(DATA_FILE));
  res.json(registrations);
});

// PUT: Edit website registration by user ID (optional)
app.put('/api/registrations/:userid', (req, res) => {
  const userid = req.params.userid;
  let registrations = JSON.parse(fs.readFileSync(DATA_FILE));
  const idx = registrations.findIndex(r => r.userid === userid);
  if (idx !== -1) {
    // Prevent changing to an existing user ID
    if (
      req.body.userid !== userid &&
      registrations.some(r => r.userid === req.body.userid)
    ) {
      return res.status(400).json({ success: false, message: 'User ID already exists' });
    }
    registrations[idx] = req.body;
    fs.writeFileSync(DATA_FILE, JSON.stringify(registrations, null, 2));
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false, message: 'User not found' });
  }
});

// DELETE: Remove website registration by user ID (optional)
app.delete('/api/registrations/:userid', (req, res) => {
  const userid = req.params.userid;
  let registrations = JSON.parse(fs.readFileSync(DATA_FILE));
  const newRegs = registrations.filter(r => r.userid !== userid);
  if (newRegs.length !== registrations.length) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(newRegs, null, 2));
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false, message: 'User not found' });
  }
});

app.get('/', (req, res) => {
  res.send('Backend is running! Use the API endpoints.');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});