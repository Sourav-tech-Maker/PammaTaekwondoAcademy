// Fade-in animation for container
document.addEventListener('DOMContentLoaded', function () {
  const container = document.querySelector('.container');
  if (container) {
    container.style.opacity = 1;
    container.style.transform = 'translateY(0)';
  }

  // Form validation and payment modal trigger
  const form = document.querySelector('.belt-test-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      // Collect form data
      window.formDataToSubmit = {
        userid: form.userid.value,
        name: form.name.value,
        address: form.address.value,
        mobile: form.mobile.value,
        email: form.email.value,
        currentbelt: form.currentbelt.value,
        dob: form.dob.value,
        emergency: form.emergency.value,
        selfdeclaration: form.selfdeclaration.checked
      };
      document.getElementById('payment-modal').style.display = 'flex';
      document.getElementById('payment-status').textContent = '';
    });
  }

  // Payment simulation
  document.querySelectorAll('.pay-btn').forEach(btn => {
    btn.onclick = function() {
      const status = document.getElementById('payment-status');
      status.textContent = 'Processing payment via ' + this.dataset.method + '...';
      status.style.color = '#ffd600';
      setTimeout(() => {
        // Simulate payment success (randomize for illusion)
        const success = Math.random() > 0.15; // 85% chance success
        if(success) {
          status.textContent = 'Payment Successful! Saving your registration...';
          status.style.color = '#4caf50';
          // Send to backend
          fetch('http://localhost:3001/api/belt-test-register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(window.formDataToSubmit)
          })
          .then(res => res.json())
          .then(result => {
            if(result.success) {
              setTimeout(() => {
                document.getElementById('payment-modal').style.display = 'none';
                alert('Registration and payment successful!');
                if (form) form.reset();
              }, 1200);
            } else {
              status.textContent = 'Registration failed!';
              status.style.color = '#f44336';
            }
          })
          .catch(() => {
            status.textContent = 'Error submitting registration.';
            status.style.color = '#f44336';
          });
        } else {
          status.textContent = 'Payment Failed! Please try another method.';
          status.style.color = '#f44336';
        }
      }, 1800);
    };
  });

  // Close payment modal
  const closeBtn = document.getElementById('close-payment');
  if (closeBtn) {
    closeBtn.onclick = function() {
      document.getElementById('payment-modal').style.display = 'none';
    };
  }
});