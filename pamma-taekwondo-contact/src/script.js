// This file contains JavaScript code for advanced animations and interactivity on the webpage.

document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("contact-form");
    const userEmail = document.getElementById("user-email");
    const userPhone = document.getElementById("user-phone");
    const userReport = document.getElementById("user-report");
    const successMsg = document.getElementById("form-success");

    // Animate elements on page load
    const contactContainer = document.querySelector(".contact-container");
    contactContainer.style.opacity = 0;
    contactContainer.style.transform = "translateY(20px)";
    setTimeout(() => {
        contactContainer.style.transition = "opacity 0.5s ease, transform 0.5s ease";
        contactContainer.style.opacity = 1;
        contactContainer.style.transform = "translateY(0)";
    }, 100);

    // Animate fade-in for main card
    document.querySelector(".contact-glass").classList.add("animate-fadein");

    // Form submission handler
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        if (validateForm()) {
            successMsg.textContent = "Thank you! Your message has been sent.";
            successMsg.classList.add("visible");
            form.reset();
            setTimeout(() => {
                successMsg.classList.remove("visible");
            }, 3500);
        }
    });

    // Validate form inputs
    function validateForm() {
        let valid = true;
        if (!userEmail.value) {
            valid = false;
            alert("Please enter your email.");
        } else if (!userPhone.value) {
            valid = false;
            alert("Please enter your phone number.");
        } else if (!userReport.value) {
            valid = false;
            alert("Please enter your message.");
        }
        return valid;
    }

    // Add animations to form elements on focus
    const inputs = [userEmail, userPhone, userReport];
    inputs.forEach(input => {
        input.addEventListener("focus", function() {
            input.style.transition = "border-color 0.3s ease";
            input.style.borderColor = "#007BFF"; // Change border color on focus
        });
        input.addEventListener("blur", function() {
            input.style.borderColor = ""; // Reset border color on blur
        });
    });
});