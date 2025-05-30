// This file exports utility functions that assist in processing user input and generating responses.

export function formatMessage(message) {
    return message.trim().charAt(0).toUpperCase() + message.slice(1);
}

export function validateInput(input) {
    return input && input.trim().length > 0;
}

export function addToConversationHistory(history, message) {
    history.push(message);
    return history;
}

export function getResponse(intent) {
    const responses = {
        greeting: "Hello! How can I assist you today?",
        farewell: "Thank you for visiting Pamma's Taekwondo Academy. Have a great day!",
        default: "I'm sorry, I didn't understand that. Can you please rephrase?",
    };
    return responses[intent] || responses.default;
}