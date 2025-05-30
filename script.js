document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('mode-toggle');
    const body = document.body;
    const header = document.querySelector('.header');

    // Auto-detect system theme on first visit
    if (!localStorage.getItem('theme')) {
        if (window.matchMedia('(prefers-color-scheme: light)').matches) {
            body.classList.add('light-mode');
            toggle.textContent = '🌞';
            localStorage.setItem('theme', 'light');
        }
    }

    // Set initial mode from localStorage
    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-mode');
        toggle.textContent = '🌞';
    }

    // Toggle dark/light mode
    toggle.addEventListener('click', function() {
        body.classList.toggle('light-mode');
        if (body.classList.contains('light-mode')) {
            toggle.textContent = '🌞';
            localStorage.setItem('theme', 'light');
        } else {
            toggle.textContent = '🌙';
            localStorage.setItem('theme', 'dark');
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Ripple effect for buttons
    document.querySelectorAll('.cta-btn, .register-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const circle = document.createElement('span');
            circle.className = 'ripple';
            circle.style.left = `${e.offsetX}px`;
            circle.style.top = `${e.offsetY}px`;
            this.appendChild(circle);
            setTimeout(() => circle.remove(), 600);
        });
    });

    // Sticky header on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 40) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });

    // --- Chatbot functionality START ---
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotForm = document.getElementById('chatbot-form');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotMessages = document.getElementById('chatbot-messages');

    // Show greeting when opened
    let greeted = false;
    chatbotToggle.onclick = () => {
        chatbotWindow.style.display = 'block';
        if (!greeted) {
            addBotMessage("👋 Hi! I'm Pamma Bot. Ask me anything about our academy, classes, fees, or registration.");
            greeted = true;
        }
    };
    chatbotClose.onclick = () => chatbotWindow.style.display = 'none';

    function addBotMessage(text) {
        chatbotMessages.innerHTML += `<div class="bot">${text}</div>`;
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    function addUserMessage(text) {
        chatbotMessages.innerHTML += `<div class="user">${text}</div>`;
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    function addTyping() {
        chatbotMessages.innerHTML += `<div class="bot typing" id="typing-indicator">Pamma Bot is typing...</div>`;
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    function removeTyping() {
        const typing = document.getElementById('typing-indicator');
        if (typing) typing.remove();
    }

    function botReply(userMsg) {
        userMsg = userMsg.toLowerCase();
        if (userMsg.includes('hello') || userMsg.includes('hi')) {
            return "Hello! How can I help you with Taekwondo today?";
        }
        if (userMsg.includes('register')) {
            return "You can register by clicking the <b>Register Now</b> button above or <a href='./RegisterNow/register.html' target='_blank'>here</a>!";
        }
        if (userMsg.includes('timing') || userMsg.includes('time') || userMsg.includes('schedule')) {
            return "Our classes run from <b>5pm to 8pm, Monday to Saturday</b>. Would you like to know about specific age groups?";
        }
        if (userMsg.includes('location') || userMsg.includes('where')) {
            return "We are located at <b>Main Street, Your City</b>. Need Address?";
        }

        if (userMsg.includes('Address') || userMsg.includes('yes need')) {
            return "you can also visit this direction <b> Shri ram complex, 24-25, near Durga property, Block L-Extension, Uttam Nagar, Bhagwati Garden, New delhi, New Delhi, Delhi, 110059</b> for more details. go to our contact page for more details.";
        }

        if (userMsg.includes('fee') || userMsg.includes('fees') || userMsg.includes('cost') || userMsg.includes('price')) {
            return "Our monthly fee is <b>₹1200</b>. Discounts are available for siblings and annual payments!";   
        }

        if (userMsg.includes('fee') || userMsg.includes('fees') || userMsg.includes('cost') || userMsg.includes('price')) {
            return "Our annual fee is <b>₹14,400</b>. Discounts are available for siblings and annual payments!";
        }

        if (userMsg.includes('coach') || userMsg.includes('instructor') || userMsg.includes('teacher')) {
            return "Our head instructor is <b>Master Pamma</b>, a certified black belt with 15+ years of experience.";
        }
        if (userMsg.includes('age') || userMsg.includes('kids') || userMsg.includes('children')) {
            return "We welcome students from <b>age 5 and above</b>. We have special batches for kids, teens, and adults.";
        }
        if (userMsg.includes('contact') || userMsg.includes('phone') || userMsg.includes('call')) {
            return "You can contact us at <b>+91-9876543210</b> or email <b>pamma.taekwondo@email.com</b>.";
        }
        if (userMsg.includes('belt') || userMsg.includes('grading')) {
            return "We conduct belt grading exams every 4 months. Ask us about the next schedule!";
        }
        if (userMsg.includes('trial') || userMsg.includes('demo')) {
            return "Yes! We offer a <b>free trial class for 2-3 days</b>. Would you like to book one?";
        }
        if (userMsg.includes('thank')) {
            return "You're welcome! 😊 Anything else you'd like to know?";
        }
        return "Sorry, I didn't understand that. Please ask about <b>registration, timings, fees, instructors, or contact</b>. Or <a href='mailto:pamma.taekwondo@email.com'>email us</a>!";
    }

    chatbotForm.onsubmit = function(e) {
        e.preventDefault();
        const userText = chatbotInput.value.trim();
        if (!userText) return;
        addUserMessage(userText);
        chatbotInput.value = '';
        addTyping();
        setTimeout(() => {
            removeTyping();
            addBotMessage(botReply(userText));
        }, 700);
    };
    // --- Chatbot functionality END ---
});

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('workout-form');
    const result = document.getElementById('workout-result');
    // Show a default workout suggestion on page load
    if (result) {
        result.innerHTML = `
            <h3>Today's Suggested Routine</h3>
            <ul>
                <li>5 min warm-up (jumping jacks)</li>
                <li>15 squats</li>
                <li>10 push-ups</li>
                <li>15 front kicks (each leg)</li>
                <li>15 punches (each arm)</li>
                <li>5 min stretching</li>
            </ul>
            <p style="margin-top:0.7em;font-size:0.98em;opacity:0.85;">Select your fitness level above for a personalized routine!</p>
        `;
    }
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const level = document.getElementById('fitness-level').value;
            let workout = '';
            if (level === 'beginner') {
                workout = `
                    <h3>Beginner Routine</h3>
                    <ul>
                        <li>5 min warm-up (jumping jacks)</li>
                        <li>10 squats</li>
                        <li>10 push-ups (knee if needed)</li>
                        <li>10 front kicks (each leg)</li>
                        <li>10 punches (each arm)</li>
                        <li>5 min stretching</li>
                    </ul>
                `;
            } else if (level === 'intermediate') {
                workout = `
                    <h3>Intermediate Routine</h3>
                    <ul>
                        <li>10 min warm-up (jog in place)</li>
                        <li>20 squats</li>
                        <li>15 push-ups</li>
                        <li>20 front kicks (each leg)</li>
                        <li>20 punches (each arm)</li>
                        <li>10 burpees</li>
                        <li>10 min stretching</li>
                    </ul>
                `;
            } else if (level === 'advanced') {
                workout = `
                    <h3>Advanced Routine</h3>
                    <ul>
                        <li>15 min warm-up (shadow sparring)</li>
                        <li>30 squats</li>
                        <li>25 push-ups</li>
                        <li>30 front kicks (each leg)</li>
                        <li>30 punches (each arm)</li>
                        <li>20 burpees</li>
                        <li>15 min stretching</li>
                    </ul>
                `;
            } else {
                workout = '<p>Please select a fitness level.</p>';
            }
            result.innerHTML = workout;
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // AR Drill Simulation - Redesigned
    const arBtn = document.getElementById('start-ar-drill');
    const restartBtn = document.getElementById('restart-ar-drill');
    const opponent = document.getElementById('opponent');
    const arInstructions = document.getElementById('ar-instructions');
    if (arBtn && opponent && arInstructions && restartBtn) {
        // More complex, professional moves
        const moves = [
            { text: "Dodge Left!", left: "15%" },
            { text: "Dodge Right!", left: "75%" },
            { text: "Block High!", left: "50%" },
            { text: "Kick Low!", left: "30%" },
            { text: "Punch!", left: "60%" },
            { text: "Step Back!", left: "50%" },
            { text: "Spin Hook Kick!", left: "80%" },
            { text: "Jump Back Kick!", left: "20%" },
            { text: "Slide In & Jab!", left: "55%" },
            { text: "Double Roundhouse!", left: "70%" },
            { text: "Axe Kick!", left: "45%" },
            { text: "Counter Side Kick!", left: "35%" },
            { text: "Feint & Attack!", left: "60%" },
            { text: "Rapid Combo!", left: "50%" },
            { text: "Backstep + Counter!", left: "25%" },
            { text: "Triple Kick Combo!", left: "65%" },
            { text: "Fake & Spin!", left: "40%" },
            { text: "Jumping Axe Kick!", left: "60%" },
            { text: "Slide Back & Block!", left: "50%" }
        ];
        let drillActive = false;
        let moveIndex = 0;
        let drillTimer = null;
        let sequence = [];

        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        function showInstruction(text) {
            arInstructions.classList.remove('visible');
            setTimeout(() => {
                arInstructions.textContent = text;
                arInstructions.classList.add('visible');
            }, 120);
        }

        function nextMove() {
            if (!drillActive || moveIndex >= sequence.length) {
                showInstruction("🔥 Drill complete! Amazing work!");
                opponent.style.left = "50%";
                opponent.textContent = "🏆";
                drillActive = false;
                restartBtn.style.display = "block";
                arBtn.style.display = "none";
                return;
            }
            const move = sequence[moveIndex];
            opponent.style.left = move.left;
            opponent.classList.remove('bounce');
            void opponent.offsetWidth;
            opponent.classList.add('bounce');
            showInstruction(move.text);
            moveIndex++;
            drillTimer = setTimeout(nextMove, Math.max(800, 1500 - moveIndex * 60));
        }

        function startDrill() {
            drillActive = true;
            moveIndex = 0;
            restartBtn.style.display = "none";
            arBtn.style.display = "none";
            sequence = shuffle([...moves]).slice(0, Math.floor(Math.random() * 6) + 10);
            showInstruction("Get ready for PRO drill...");
            opponent.textContent = "🥋";
            opponent.style.left = "50%";
            setTimeout(nextMove, 1200);
        }

        arBtn.onclick = function() {
            if (drillActive) return;
            startDrill();
        };
        restartBtn.onclick = function() {
            if (drillActive) return;
            startDrill();
        };
    }
});

document.addEventListener('DOMContentLoaded', function() {
  // Fitbit Integration
  const fitbitBtn = document.getElementById('fitbit-connect');
  const fitbitStatus = document.getElementById('fitbit-status');
  const fitbitData = document.getElementById('fitbit-data');
  const fitbitRefreshBtn = document.getElementById('fitbit-refresh');
  const fitbitDisconnectBtn = document.getElementById('fitbit-disconnect');
  let fitbitAccessToken = null;

  function displayFitbitData(data) {
    // Sleep summary
    let sleepSummary = "No sleep data found.";
    let hours = 0, mins = 0;
    if (data.sleep && data.sleep.summary && data.sleep.summary.totalMinutesAsleep) {
      hours = Math.floor(data.sleep.summary.totalMinutesAsleep / 60);
      mins = data.sleep.summary.totalMinutesAsleep % 60;
      sleepSummary = `${hours}h ${mins}m`;
    }
    // Activity summary
    let steps = data.activity?.summary?.steps ?? "No data";
    let calories = data.activity?.summary?.caloriesOut ?? "No data";
    // Recovery tip
    let tip = "";
    if (hours < 7) {
      tip = "Try to get at least 7 hours of sleep for optimal recovery!";
    } else if (steps < 5000) {
      tip = "A short walk can help with active recovery today.";
    } else {
      tip = "Great job! Keep up your healthy habits.";
    }
    fitbitData.innerHTML = `
      <h4>Sleep (last night):</h4>
      <div>${sleepSummary}</div>
      <h4>Steps (today):</h4>
      <div>${steps}</div>
      <h4>Calories Burned (today):</h4>
      <div>${calories}</div>
      <div class="fitbit-tip" style="margin-top:1em;">${tip}</div>
      <div id="fitbit-gpt-advice" style="margin-top:1em; color:#00c6ff; font-weight:bold;">Loading AI advice...</div>
    `;

    // Fetch ChatGPT advice
    fetch('http://localhost:3001/api/fitbit/advice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sleep: data.sleep?.summary ?? {},
        activity: data.activity?.summary ?? {}
      })
    })
    .then(res => res.json())
    .then(result => {
      document.getElementById('fitbit-gpt-advice').textContent = result.advice || "No advice available.";
    })
    .catch(() => {
      document.getElementById('fitbit-gpt-advice').textContent = "AI advice unavailable.";
    });
  }

  function fetchFitbitData() {
    if (!fitbitAccessToken) return;
    fitbitStatus.textContent = "Fetching latest data...";
    fetch('http://localhost:3001/api/fitbit/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ access_token: fitbitAccessToken })
    })
    .then(res => res.json())
    .then(data => {
      fitbitStatus.textContent = "Fitbit Connected!";
      displayFitbitData(data);
      fitbitRefreshBtn.style.display = "inline-block";
      fitbitDisconnectBtn.style.display = "inline-block";
    })
    .catch(() => {
      fitbitStatus.textContent = "Failed to fetch Fitbit data.";
      fitbitData.innerHTML = "";
    });
  }

  if (fitbitBtn) {
    fitbitBtn.onclick = () => {
      // Open Fitbit OAuth in popup
      const popup = window.open('http://localhost:3001/api/fitbit/auth', 'fitbitAuth', 'width=500,height=700');
      window.addEventListener('message', function handler(event) {
        if (event.data.access_token) {
          fitbitAccessToken = event.data.access_token;
          fitbitStatus.textContent = "Fitbit Connected!";
          fitbitBtn.style.display = "none";
          fetchFitbitData();
        }
        window.removeEventListener('message', handler);
      });
    };
  }

  if (fitbitRefreshBtn) {
    fitbitRefreshBtn.onclick = fetchFitbitData;
  }

  if (fitbitDisconnectBtn) {
    fitbitDisconnectBtn.onclick = () => {
      fitbitAccessToken = null;
      fitbitStatus.textContent = "";
      fitbitData.innerHTML = "";
      fitbitBtn.style.display = "inline-block";
      fitbitRefreshBtn.style.display = "none";
      fitbitDisconnectBtn.style.display = "none";
    };
  }
});

document.addEventListener("DOMContentLoaded", function() {
    // Modal elements
    const joinBtn = document.getElementById('join-now-btn');
    const regModal = document.getElementById('register-modal');
    const pricingModal = document.getElementById('pricing-modal');
    const closeReg = document.getElementById('close-register');
    const closePricing = document.getElementById('close-pricing');
    const regForm = document.getElementById('register-form');

    // Helper: check registration
    function isRegistered() {
        return localStorage.getItem('pamma_registered') === 'yes';
    }

    // Show pricing modal
    function showPricing() {
        const pricingModal = document.getElementById('pricing-modal');
        pricingModal.style.display = 'flex';
        pricingModal.classList.add('show');
    }

    // Show registration modal
    function showRegister() {
        regModal.style.display = 'flex';
    }

    // Join Now button click
    if (joinBtn) {
        joinBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (isRegistered()) {
                showPricing();
            } else {
                showRegister();
            }
        });
    }

    // Registration form submit
    if (regForm) {
        regForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // You can add more validation here
            localStorage.setItem('pamma_registered', 'yes');
            regModal.style.display = 'none';
            showPricing();
        });
    }

    // Close modals
    if (closeReg) closeReg.onclick = () => regModal.style.display = 'none';
    if (closePricing) closePricing.onclick = () => pricingModal.style.display = 'none';

    // Close modal on outside click
    window.onclick = function(event) {
        if (event.target === regModal) regModal.style.display = 'none';
        if (event.target === pricingModal) pricingModal.style.display = 'none';
    };
});