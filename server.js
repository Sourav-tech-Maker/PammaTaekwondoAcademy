require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const session = require('express-session');
const path = require('path');
app.set('views', path.join(__dirname, 'views'));
// Ensure the 'views' directory exists and contains your EJS files
// If you don't have a 'views' directory, create it and add your EJS files there
// For example, create 'views/login.ejs' for the login p



const app = express(); // <-- define app first!
app.use(express.urlencoded({ extended: true })); // <-- then use app.use
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Session setup for login
app.use(session({
  secret: 'taekwondo_secret',
  resave: false,
  saveUninitialized: true
}));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/taekwondo', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Student schema
const studentSchema = new mongoose.Schema({
  userid: String,
  name: String,
  email: String,
  // ...other fields...
  lastAttendanceDate: { type: String, default: "" },
  attendance: {
    type: Map,
    of: String,
    default: {}
  }
});
const Student = mongoose.model('Student', studentSchema);

// Belt Test schema (add this below Student schema)
const beltTestSchema = new mongoose.Schema({
  userid: String,
  name: String,
  address: String,
  mobile: String,
  email: String,
  currentbelt: String,
  dob: String,
  emergency: String,
  selfdeclaration: Boolean,
  date: { type: Date, default: Date.now }
});
const BeltTest = mongoose.model('BeltTest', beltTestSchema);

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Home
app.get('/', (req, res) => {
  res.render('index');
});

// ========== STUDENT LOGIN & ATTENDANCE ==========

// Login page
app.get('/login', (req, res) => {
  res.render('login', { error: null });
});
app.get('/test', (req, res) => {
  res.render('login', { error: "Test error" });
});

// Handle login (by user ID AND email)
app.post('/login', async (req, res) => {
  const { userid, email } = req.body;
  const student = await Student.findOne({ userid, email });
  if (!student) {
    return res.render('login', { error: "Invalid User ID or Email. Please use the same details as registration." });
  }
  req.session.studentId = student._id;
  res.redirect('/student-attendance');
});

// Student attendance page
app.get('/student-attendance', async (req, res) => {
  if (!req.session.studentId) return res.redirect('/login');
  const student = await Student.findById(req.session.studentId);
  res.render('student_attendance', { student, message: null });
});

// Handle student attendance marking
app.post('/student-attendance', async (req, res) => {
  if (!req.session.studentId) return res.redirect('/login');
  const student = await Student.findById(req.session.studentId);
  const today = new Date().toISOString().slice(0, 10);

  // Only block if already marked for today
  if (student.lastAttendanceDate === today) {
    return res.render('student_attendance', { student, message: "Attendance already marked for today." });
  }

  // Get attendance type from form
  const attendanceType = req.body.attendanceType === "Present" ? "Present" : "Absent";
  student.attended = attendanceType === "Present";
  student.lastAttendanceDate = today;
  student.attendance.set(today, attendanceType);
  await student.save();

  res.render('student_attendance', { student, message: "Attendance marked successfully!" });
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// ========== ADMIN FEATURES ==========

// Helper: Mark absent for students who didn't mark present today
async function markAbsentForToday() {
  const today = new Date().toISOString().slice(0, 10);
  const students = await Student.find();
  for (let student of students) {
    // If not marked for today, set as Absent
    if (!student.attendance.has(today)) {
      student.attendance.set(today, "Absent");
      await student.save();
    }
  }
}

// Attendance Tracker (Admin)
app.get('/attendance', async (req, res) => {
  await markAbsentForToday(); // <-- Add this line

  // Get all registered students
  const students = await Student.find();

  // Get current month and year
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed

  // Get number of days in current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Prepare users array for EJS
  const users = students.map(s => {
    const attendanceArr = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      attendanceArr.push(s.attendance.get(dateStr) || "Absent");
    }
    return {
      name: s.name,
      attendance: attendanceArr
    };
  });

  res.render('user 1-month-data', { users, daysInMonth });
});

app.post('/attendance', async (req, res) => {
  const attendedIds = req.body.attended || [];
  const students = await Student.find();
  const today = new Date().toISOString().slice(0, 10);
x``
  for (let s of students) {
    const isPresent = Array.isArray(attendedIds)
      ? attendedIds.includes(s._id.toString())
      : attendedIds === s._id.toString();

    s.attended = isPresent;
    if (isPresent) {
      s.lastAttendanceDate = today;
      s.attendance.set(today, "Present"); // <-- Save as Present for today
    } else {
      s.attendance.set(today, "Absent");  // <-- Save as Absent for today
    }
    await s.save();
  }
  res.redirect('/attendance');
});

// Notifications (Admin)
app.get('/notifications', async (req, res) => {
  const filter = req.query.filter || "all";
  let students = await Student.find();

  if (filter === "dues") {
    students = students.filter(s => s.dues > 0);
  } else if (filter === "lowattendance") {
    // Example: less than 75% present in current month
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    students = students.filter(s => {
      let presentCount = 0;
      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        if (s.attendance && s.attendance.get(dateStr) === "Present") presentCount++;
      }
      return (presentCount / daysInMonth) < 0.75;
    });
  }
  res.render('notifications', { students, message: null, filter });
});

app.post('/notifications', async (req, res) => {
  const { subject, message } = req.body;
  let recipients = req.body.recipients || [];
  if (!Array.isArray(recipients)) recipients = [recipients];
  const emails = (await Student.find({ _id: { $in: recipients } })).map(s => s.email);

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: emails,
      subject,
      text: message
    });
    const students = await Student.find();
    res.render('notifications', { students, message: "Emails sent successfully!" });
  } catch (err) {
    console.log(err); // <-- This will show the real error in your terminal!
    const students = await Student.find();
    res.render('notifications', { students, message: "Error sending emails." });
  }
});

// Payment Dues Alert (Admin)
app.get('/payments', async (req, res) => {
  const dueStudents = await Student.find({ dues: { $gt: 0 } });
  res.render('payments', { dueStudents, message: null });
});

app.post('/payments/alert', async (req, res) => {
  const dueStudents = await Student.find({ dues: { $gt: 0 } });
  for (let s of dueStudents) {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: s.email,
      subject: "Payment Due Alert",
      text: `Dear ${s.name},\n\nYou have an outstanding payment of Rs.${s.dues}. Please pay at the earliest.\n\nThank you!`
    });
  }
  const updatedDueStudents = await Student.find({ dues: { $gt: 0 } });
  res.render('payments', { dueStudents: updatedDueStudents, message: "Payment alerts sent!" });
});

// Add student (for demo/testing)
app.get('/add-student', (req, res) => {
  res.send(`<form method="POST">
    User ID: <input name="userid" required><br>
    Name: <input name="name" required><br>
    Email: <input name="email" required><br>
    Dues: <input name="dues" type="number" value="0"><br>
    <button type="submit">Add Student</button>
    <form method="POST" action="/belt-test-form">
  </form>`);
});

app.post('/add-student', async (req, res) => {
  const student = await Student.create({
    userid: req.body.userid,
    name: req.body.name,
    email: req.body.email,
    dues: req.body.dues || 0,
    lastAttendanceDate: "", // or leave it undefined
    attendance: {}
  });
  res.redirect('/attendance');
});

// Belt test registration form (for students)
app.get('/belt-test', (req, res) => {
  res.render('belt_test_form', { error: null });
});

app.post('/belt-test-form', async (req, res) => {
  console.log('Form data:', req.body); // This should show your form data in the terminal!
  try {
    await BeltTest.create({
      userid: req.body.userid,
      name: req.body.name,
      address: req.body.address,
      mobile: req.body.mobile,
      email: req.body.email,
      currentbelt: req.body.currentbelt,
      dob: req.body.dob,
      emergency: req.body.emergency,
      selfdeclaration: req.body.selfdeclaration === true || req.body.selfdeclaration === 'on'
    });
    // For AJAX:
    if (req.headers['content-type'] && req.headers['content-type'].includes('application/json')) {
      return res.json({ success: true });
    }
    // For standard form POST:
    res.render('belt_test_success');
  } catch (err) {
    console.log('Error:', err);
    if (req.headers['content-type'] && req.headers['content-type'].includes('application/json')) {
      return res.json({ success: false, error: "Error submitting registration." });
    }
    res.render('belt_test_form', { error: "Error submitting registration." });
  }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));