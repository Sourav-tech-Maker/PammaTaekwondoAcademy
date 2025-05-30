// This file contains JavaScript functionality for the student dashboard.
// It handles user interactions, updates the UI based on student progress,
// and manages data related to belt tracking, training history, and goals.

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginContainer = document.getElementById('login-container');
    const dashboardContainer = document.getElementById('dashboard-container');
    const studentName = document.getElementById('student-name');
    const logoutBtn = document.getElementById('logout-btn');
    const modeToggle = document.getElementById('mode-toggle');
    const body = document.body;
    const beltProgress = document.getElementById('belt-progress');
    const trainingHistory = document.getElementById('training-history');
    const tomorrowGoals = document.getElementById('tomorrow-goals-list');
    const goals = document.getElementById('goals-list');

    // Load students from localStorage or use default
    let students = [];
    const defaultStudents = [
        {
            username: 'Sourav',
            password: 'Sourav@Pass123',
            belt: 'Green',
            beltIndex: 2, // 0: White, 1: Yellow, 2: Green, 3: Blue, 4: Red, 5;Black etc.
            trainingSessions: [
                { date: '2023-10-01', duration: '1 hour', notes: 'Focused on sparring techniques.' },
                { date: '2023-10-05', duration: '1.5 hours', notes: 'Practiced forms and self-defense.' },
                { date: '2024-02-12', duration: '1.5 hours', notes: 'Practiced forms and Sparring .' },
                { date: '2025-02-05', duration: '1.5 hours', notes: 'self-defense and UpperBody.' },
                { date: '2025-02-05', duration: '1.5 hours', notes: 'self-defense and LowerBody.' },
                { date: '2025-03-05', duration: '1.5 hours', notes: 'Sparring and core.' },
            ],

            TomorrowGoals: [
                { goal: 'self-defense' },
                { goal: 'Improve sparring skills' },
                { goal: 'Improve Kicking drills' },
            ],

            goals: [
                { goal: 'Achieve Blue Belt', deadline: '2025-10-15', progress: '50%' },
                { goal: 'Improve sparring skills', deadline: '2025-06-28', progress: '40%' },
            ],
        },
        {
            username: 'Sammer',
            password: 'Sammer123',
            belt: 'Green',
            beltIndex: 1,
            trainingSessions: [
                { date: '2023-09-15', duration: '1 hour', notes: 'Kicking drills.' },
                { date: '2025-02-05', duration: '1.5 hours', notes: 'self-defense and UpperBody.' },
                { date: '2025-02-05', duration: '1.5 hours', notes: 'self-defense and LowerBody.' },
                { date: '2025-03-05', duration: '1.5 hours', notes: 'Sparring and core.' },
            ],
            
            TomorrowGoals: [
                { goal: 'self-defense' },
                { goal: 'Improve sparring skills' },
            ],
            goals: [
                { goal: 'Achieve Green Belt', deadline: '2024-03-01', progress: '20%' },
            ],
        },
        // Add more students as needed
    ];
    if (localStorage.getItem('students')) {
        students = JSON.parse(localStorage.getItem('students'));
    } else {
        students = defaultStudents;
        localStorage.setItem('students', JSON.stringify(students));
    }

    let currentStudent = null;

    // Function to update belt progress display
    function updateBeltProgress() {
        beltProgress.innerHTML = `Current Belt: ${currentStudent.belt}`;
        const belts = document.querySelectorAll('.belt');
        belts.forEach((belt, idx) => {
            belt.classList.remove('active', 'current-belt');
            if (idx <= currentStudent.beltIndex) {
                belt.classList.add('active');
            }
            if (idx === currentStudent.beltIndex) {
                belt.classList.add('current-belt');
            }
        });
    }

    function displayTomorrowGoals() {
        if (currentStudent.TomorrowGoals && currentStudent.TomorrowGoals.length > 0) {
            tomorrowGoals.innerHTML = currentStudent.TomorrowGoals.map(goal =>
                `<li>${goal.goal}</li>`
            ).join('');
        } else {
            tomorrowGoals.innerHTML = '<li>No goals set for tomorrow.</li>';
        }
    }

    // Function to display training history
    function displayTrainingHistory() {
        trainingHistory.innerHTML = currentStudent.trainingSessions.map(session =>
            `<li>${session.date}: ${session.duration} - ${session.notes}</li>`
        ).join('');
    }

    // Function to display goals
    function displayGoals() {
        goals.innerHTML = currentStudent.goals.map(goal =>
            `<li>${goal.goal} (Due: ${goal.deadline}) - Progress: ${goal.progress}</li>`
        ).join('');
    }

    // Login event
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const userId = document.getElementById('userid').value.trim();
        const password = document.getElementById('password').value;

        // Find student
        const student = students.find(s => s.username === userId);

        if (!student) {
            alert('User not found.');
            return;
        }
        if (student.password !== password) {
            alert('Incorrect password.');
            return;
        }

        currentStudent = student;
        studentName.textContent = userId;
        loginContainer.style.display = 'none';
        dashboardContainer.style.display = 'block';

        updateBeltProgress();
        displayTrainingHistory();
        displayGoals();
        displayTomorrowGoals();
    });

    logoutBtn.addEventListener('click', function () {
        dashboardContainer.style.display = 'none';
        loginContainer.style.display = 'block';
        loginForm.reset();
        document.querySelectorAll('.belt').forEach(b => b.classList.remove('active'));
        currentStudent = null;
    });

    // Light/Dark mode toggle
    modeToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        modeToggle.textContent = body.classList.contains('light-mode') ? '🌞' : '🌙';
    });

    // Toggle between login and signup forms
    document.getElementById('show-signup-btn').onclick = function() {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('signup-container').style.display = 'block';
    };
    document.getElementById('show-login-btn').onclick = function() {
        document.getElementById('signup-container').style.display = 'none';
        document.getElementById('login-container').style.display = 'block';
    };

    // Handle sign up form submission
    const signupForm = document.getElementById('signup-form');
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('signup-username').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const userId = document.getElementById('signup-userid').value.trim();
        const password = document.getElementById('signup-password').value;

        // Check if user already exists
        if (students.some(s => s.username === userId)) {
            alert('User ID already exists. Please choose another.');
            return;
        }

        // Create new student object
        const newStudent = {
            username: userId,
            password: password,
            belt: 'White',
            beltIndex: 0,
            trainingSessions: [],
            TomorrowGoals: [],
            goals: []
        };

        students.push(newStudent);
        localStorage.setItem('students', JSON.stringify(students)); // Save to localStorage

        alert('Account created successfully! Please log in.');
        signupForm.reset();
        document.getElementById('signup-container').style.display = 'none';
        document.getElementById('login-container').style.display = 'block';
    });
});