document.addEventListener('DOMContentLoaded', function () {
  // --- Dark/Light Mode ---
  const modeBtn = document.getElementById('mode-toggle');
  function updateModeBtn() {
    modeBtn.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
  }
  modeBtn.onclick = function () {
    document.body.classList.toggle('dark');
    document.documentElement.classList.toggle('dark');
    updateModeBtn();
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  };
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
    document.documentElement.classList.add('dark');
  }
  updateModeBtn();

  // --- Sticky Header ---
  const header = document.querySelector('.header');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 40) {
      header.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
    }
  });

  // --- Ripple Effect for Buttons ---
  document.querySelectorAll('.cta-btn, .register-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const circle = document.createElement('span');
      circle.className = 'ripple';
      circle.style.left = `${e.offsetX}px`;
      circle.style.top = `${e.offsetY}px`;
      this.appendChild(circle);
      setTimeout(() => circle.remove(), 600);
    });
  });

  // --- Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // --- Chatbot Functionality ---
  const chatbotToggle = document.getElementById('chatbot-toggle');
  const chatbotWindow = document.getElementById('chatbot-window');
  const chatbotClose = document.getElementById('chatbot-close');
  const chatbotForm = document.getElementById('chatbot-form');
  const chatbotInput = document.getElementById('chatbot-input');
  const chatbotMessages = document.getElementById('chatbot-messages');
  if (chatbotToggle && chatbotWindow && chatbotClose) {
    chatbotToggle.onclick = function () {
      chatbotWindow.style.display = chatbotWindow.style.display === 'block' ? 'none' : 'block';
    };
    chatbotClose.onclick = function () {
      chatbotWindow.style.display = 'none';
    };
  }
  // Simple Q&A pairs
  const faq = [
    { q: /hello|hi|hey/i, a: "Hello! How can I help you with Pamma's Taekwondo Academy?" },
    { q: /timing|schedule|class/i, a: "Our classes run Monday to Saturday, 5pm to 8pm. Contact us for the full schedule!" },
    { q: /fees|price|cost/i, a: "Kids: ₹700/month, Adults: ₹1200/month. Special discounts available for early registrations!" },
    { q: /location|where|address/i, a: "We are located at Main Street, Your City. Check our Contact Us page for the map." },
    { q: /register|enroll|join/i, a: "You can register online using the 'Register Now' button or visit us at the academy." },
    { q: /belt|test/i, a: "Belt tests are held every quarter. Registration is open now!" },
    { q: /coach|instructor|teacher/i, a: "Our instructors are certified black belts with years of teaching experience." },
    { q: /contact|phone|email/i, a: "You can contact us at info@pammataekwondo.com or call 123-456-7890." },
    { q: /uniform|dress|attire/i, a: "A white Taekwondo uniform (dobok) is required. You can purchase it at the academy." },
    { q: /age|old|young/i, a: "We accept students from age 5 and above. There is no upper age limit!" },
    { q: /trial|first class/i, a: "Your first class is free! Come and experience Taekwondo with us." },
    { q: /holiday|closed/i, a: "We are closed on Sundays and public holidays." },
    { q: /thank/i, a: "You're welcome! Let me know if you have more questions." },
    { q: /bye|goodbye|see you/i, a: "Goodbye! Hope to see you soon at Pamma's Taekwondo Academy!" },
    { q: /help|support|issue/i, a: "If you need help, please contact our support team at +91-9876543210." }
  ];
  function addMessage(text, from = 'user') {
    const msg = document.createElement('div');
    msg.textContent = text;
    msg.className = from === 'user' ? 'chatbot-user-msg' : 'chatbot-bot-msg';
    chatbotMessages.appendChild(msg);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }
  if (chatbotForm && chatbotInput && chatbotMessages) {
    chatbotForm.onsubmit = function (e) {
      e.preventDefault();
      const userQ = chatbotInput.value.trim();
      if (!userQ) return;
      addMessage(userQ, 'user');
      chatbotInput.value = '';
      // Find answer
      let answer = "Sorry, I don't have an answer for that. Please contact us for more info!";
      for (const pair of faq) {
        if (pair.q.test(userQ)) {
          answer = pair.a;
          break;
        }
      }
      setTimeout(() => addMessage(answer, 'bot'), 600);
    };
  }

  // --- Modal Logic (Register & Pricing) ---
  const joinBtn = document.getElementById('join-now-btn');
  const regModal = document.getElementById('register-modal');
  const pricingModal = document.getElementById('pricing-modal');
  const closeReg = document.getElementById('close-register');
  const closePricing = document.getElementById('close-pricing');
  const regForm = document.getElementById('register-form');
  function isRegistered() {
    return localStorage.getItem('pamma_registered') === 'yes';
  }
  function showPricing() {
    if (pricingModal) {
      pricingModal.style.display = 'flex';
      pricingModal.classList.add('show');
    }
  }
  function showRegister() {
    if (regModal) regModal.style.display = 'flex';
  }
  if (joinBtn) {
    joinBtn.addEventListener('click', function (e) {
      e.preventDefault();
      if (isRegistered()) {
        showPricing();
      } else {
        showRegister();
      }
    });
  }
  if (regForm) {
    regForm.addEventListener('submit', function (e) {
      e.preventDefault();
      localStorage.setItem('pamma_registered', 'yes');
      if (regModal) regModal.style.display = 'none';
      showPricing();
    });
  }
  if (closeReg && regModal) closeReg.onclick = () => regModal.style.display = 'none';
  if (closePricing && pricingModal) closePricing.onclick = () => pricingModal.style.display = 'none';
  window.onclick = function (event) {
    if (event.target === regModal) regModal.style.display = 'none';
    if (event.target === pricingModal) pricingModal.style.display = 'none';
  };
  if (pricingModal) {
    pricingModal.querySelectorAll('.get-started-btn').forEach(btn => {
      btn.onclick = function (ev) {
        ev.preventDefault();
        if (localStorage.getItem('pta_registered') === 'yes') {
          window.location.href = '/payment.html';
        } else {
          window.location.href = './RegisterNow/register.html';
        }
      };
    });
  }

  // --- Rotating Tagline ---
  const taglines = [
    "Join the best Taekwondo academy in town. Train with certified instructors, make new friends, and build confidence!",
    "Unlock your potential with world-class martial arts training.",
    "Boost your fitness, focus, and self-defense skills.",
    "Fun, friendly, and safe environment for all ages.",
    "Start your Taekwondo journey today—first class is free!"
  ];
  let taglineIndex = 0;
  const taglineEl = document.getElementById('rotating-tagline');
  if (taglineEl) {
    function showNextTagline() {
      taglineEl.classList.remove('fade-in');
      setTimeout(() => {
        taglineEl.classList.add('fade-out');
        taglineIndex = (taglineIndex + 1) % taglines.length;
        taglineEl.textContent = taglines[taglineIndex];
        taglineEl.classList.remove('fade-out');
        taglineEl.classList.add('fade-in');
      }, 600);
    }
    taglineEl.classList.add('fade-in');
    setInterval(showNextTagline, 3500);
  }

  // --- Workout Generator (Dropdown) ---
  const form = document.getElementById('workout-form');
  const select = document.getElementById('fitness-level');
  const result = document.getElementById('workout-result');
  if (form && select && result) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const level = select.value;
      let workouts = [];
      if (!level) {
        result.innerHTML = `<span style="color:#ff512f;font-weight:600;">Please select your player type first!</span>`;
        result.style.display = 'block';
        result.classList.add('show');
        return;
      }
      if (level === "beginner") {
        workouts = [
          "15s Jumping Jacks",
          "5 Push-ups",
          "30s Plank",
          "10 Squats"
        ];
      } else if (level === "intermediate") {
        workouts = [
          "Doliyo_Chagi (Roundhouse Kick) - 30 Kicks each leg in 2 sets",
          "70s Jumping Jacks",
          "15 Push-ups",
          "70s Plank",
          "20s Squats",
          "20s Squats_with-Jump"
        ];
      } else if (level === "advanced") {
        workouts = [
          "Doliyo_Chagi (Roundhouse Kick) - 50 Kicks each leg in 3 sets",
          "Doliyo_Chagi (Roundhouse Kick) - 26 Kicks in 10s each leg",
          "100s Jumping Jacks",
          "40 Push-ups",
          "100s Plank",
          "30 Squats 2 sets",
          "30 Squats_with-Jump 2 sets",
          "60s Burpees",
          "70s Lunges each leg with jump",
          "30s Pistol squats each leg",
        ];
      }
      result.innerHTML = `
        <h3>Your ${level.charAt(0).toUpperCase() + level.slice(1)} Workout:</h3>
        <ul>${workouts.map(w => `<li>${w}</li>`).join('')}</ul>
      `;
      result.style.display = 'block';
      result.classList.add('show');
    });
  }

    // AR Drill Logic
  const arBtn = document.getElementById('start-ar-drill');
  const arResult = document.getElementById('ar-drill-result');
  const moves = [
    { text: "Dodge Left!", left: "15%", emoji: "🥋" },
    { text: "Dodge Right!", left: "75%", emoji: "🥋" },
    { text: "Block High!", left: "50%", emoji: "🛡️" },
    { text: "Kick Low!", left: "30%", emoji: "🦶" },
    { text: "Punch!", left: "60%", emoji: "🥊" },
    { text: "Step Back!", left: "50%", emoji: "👣" },
    { text: "Spin Hook Kick!", left: "80%", emoji: "🦶" },
    { text: "Jump Back Kick!", left: "20%", emoji: "🦶" },
    { text: "Slide In & Jab!", left: "55%", emoji: "🥊" },
    { text: "Double Roundhouse!", left: "70%", emoji: "🦶" },
    { text: "Axe Kick!", left: "45%", emoji: "🦶" },
    { text: "Counter Side Kick!", left: "35%", emoji: "🦶" },
    { text: "Feint & Attack!", left: "60%", emoji: "🥋" },
    { text: "Rapid Combo!", left: "50%", emoji: "🥊" },
    { text: "Backstep + Counter!", left: "25%", emoji: "👣" },
    { text: "Triple Kick Combo!", left: "65%", emoji: "🦶" },
    { text: "Fake & Spin!", left: "40%", emoji: "🥋" },
    { text: "Jumping Axe Kick!", left: "60%", emoji: "🦶" },
    { text: "Slide Back & Block!", left: "50%", emoji: "🛡️" }
  ];
  const arAnimArea = document.getElementById('ar-drill-anim-area');
const startArBtn = document.getElementById('start-ar-drill');
let arMoveIndex = 0;
let arInterval = null;

function showArMove(idx) {
  if (!arAnimArea) return;
  arAnimArea.innerHTML = '';
  const move = moves[idx];
  // Emoji
  const emoji = document.createElement('div');
  emoji.className = 'ar-move-emoji';
  emoji.style.left = move.left;
  emoji.textContent = move.emoji;
  // Move text
  const text = document.createElement('div');
  text.className = 'ar-move-text';
  text.textContent = move.text;
  arAnimArea.appendChild(emoji);
  arAnimArea.appendChild(text);
}

function startArDrill() {
  arMoveIndex = 0;
  showArMove(arMoveIndex);
  if (arInterval) clearInterval(arInterval);
  arInterval = setInterval(() => {
    arMoveIndex++;
    if (arMoveIndex >= moves.length) {
      clearInterval(arInterval);
      setTimeout(() => {
        arAnimArea.innerHTML = `<div class="ar-move-text" style="color:#2193b0;">Drill Complete! Great job! 🥋</div>`;
      }, 800);
      return;
    }
    showArMove(arMoveIndex);
  }, 1700); // 1.7 seconds per move
}

if (startArBtn && arAnimArea) {
  startArBtn.onclick = startArDrill;
}
});