class ChatbotWidget {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.messages = [];
        this.init();
    }

    init() {
        this.createChatbotUI();
        this.bindEvents();
    }

    createChatbotUI() {
        this.container.innerHTML = `
            <div class="chatbot-header">Pamma's Taekwondo Chatbot</div>
            <div class="chatbot-messages" id="chatbot-messages"></div>
            <input type="text" id="chatbot-input" placeholder="Type your message..." />
            <button id="chatbot-send">Send</button>
        `;
    }

    bindEvents() {
        const sendButton = document.getElementById('chatbot-send');
        const inputField = document.getElementById('chatbot-input');

        sendButton.addEventListener('click', () => this.sendMessage(inputField.value));
        inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage(inputField.value);
            }
        });
    }

    sendMessage(message) {
        if (message.trim() === '') return;
        this.messages.push({ user: message });
        this.displayMessages();
        this.handleResponse(message);
    }

    displayMessages() {
        const messagesContainer = document.getElementById('chatbot-messages');
        messagesContainer.innerHTML = this.messages.map(msg => `<div>${msg.user}</div>`).join('');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    handleResponse(userMessage) {
        // Placeholder for response handling logic
        const response = `You said: ${userMessage}`; // This should be replaced with actual response logic
        this.messages.push({ bot: response });
        this.displayMessages();
    }

    toggleVisibility() {
        this.container.classList.toggle('hidden');
    }
}

export default ChatbotWidget;