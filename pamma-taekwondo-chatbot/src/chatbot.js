// src/chatbot.js
class Chatbot {
    constructor() {
        this.intents = {
            greeting: ["Hello! How can I assist you today?", "Hi there! What do you need help with?"],
            registration: ["You can register by clicking on the 'Register Now' button on our homepage.", "To register, please visit our registration page."],
            schedule: ["You can find our class schedule on the 'About' page.", "Our classes are held throughout the week. Check the schedule for details."],
            default: ["I'm sorry, I didn't understand that. Can you please rephrase?", "Could you please provide more details?"]
        };
        this.init();
    }

    init() {
        const userInput = document.getElementById('user-input');
        const sendButton = document.getElementById('send-button');
        sendButton.addEventListener('click', () => this.handleUserInput(userInput.value));
    }

    handleUserInput(input) {
        const response = this.getResponse(input);
        this.displayMessage(input, 'user');
        this.displayMessage(response, 'bot');
    }

    getResponse(input) {
        const lowerInput = input.toLowerCase();
        if (lowerInput.includes("hi") || lowerInput.includes("hello")) {
            return this.getRandomResponse(this.intents.greeting);
        } else if (lowerInput.includes("register")) {
            return this.getRandomResponse(this.intents.registration);
        } else if (lowerInput.includes("schedule")) {
            return this.getRandomResponse(this.intents.schedule);
        } else {
            return this.getRandomResponse(this.intents.default);
        }
    }

    getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }

    displayMessage(message, sender) {
        const chatWindow = document.getElementById('chat-window');
        const messageElement = document.createElement('div');
        messageElement.className = sender === 'user' ? 'user-message' : 'bot-message';
        messageElement.textContent = message;
        chatWindow.appendChild(messageElement);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Chatbot();
});