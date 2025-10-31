document.addEventListener('DOMContentLoaded', () => {
    // Elementos de la interfaz del chat
    const chatBubble = document.getElementById('chat-bubble');
    const chatWindow = document.getElementById('chat-window');
    const closeChatBtn = document.getElementById('close-chat');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');

    // Si los elementos principales no existen, no hacer nada
    if (!chatBubble || !chatWindow || !closeChatBtn || !chatMessages || !chatInput || !sendButton) {
        return;
    }

    // --- Lógica para abrir/cerrar el chat ---
    chatBubble.addEventListener('click', () => {
        chatWindow.classList.toggle('open');
    });

    closeChatBtn.addEventListener('click', () => {
        chatWindow.classList.remove('open');
    });

    // Historial de mensajes para mantener el contexto de la conversación
    const messageHistory = [];

    function addMessage(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message', sender);
        messageDiv.textContent = message;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll
    }

    function showTyping() {
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('chat-message', 'assistant', 'typing');
        typingDiv.id = 'typing-indicator';
        typingDiv.textContent = 'Escribiendo...';
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function hideTyping() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    async function sendMessage() {
        const userMessage = chatInput.value.trim();
        if (!userMessage) return;

        addMessage(userMessage, 'user');
        messageHistory.push({ role: 'user', content: userMessage });
        chatInput.value = '';
        chatInput.disabled = true;
        sendButton.disabled = true;

        showTyping();

        try {
            const response = await fetch('http://localhost:3000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ history: messageHistory }),
            });

            if (!response.ok) {
                throw new Error('La respuesta del servidor no fue exitosa.');
            }

            const data = await response.json();
            const assistantMessage = data.response;

            hideTyping();
            addMessage(assistantMessage, 'assistant');
            messageHistory.push({ role: 'assistant', content: assistantMessage });

        } catch (error) {
            hideTyping();
            addMessage('Lo siento, algo salió mal. Por favor, inténtalo de nuevo.', 'assistant');
            console.error('Error al contactar al servidor:', error);
        } finally {
            chatInput.disabled = false;
            sendButton.disabled = false;
            chatInput.focus();
        }
    }

    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});
