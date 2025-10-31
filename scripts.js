document.addEventListener('DOMContentLoaded', () => {
    // --- Lógica para Resaltar el Enlace Activo ---
    const navLinks = document.querySelectorAll('nav a');
    // Obtiene el nombre del archivo actual (ej: "servicios.html" o "index.html")
    const currentPage = window.location.pathname.split('/').pop() || 'index.html'; 

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        // Si el href del enlace coincide con la página actual, se resalta
        if (linkPage === currentPage) {
            link.classList.add('active-link');
        }
    });

    // --- Lógica del Chat Bot Simple ---
    const chatBubble = document.getElementById('chat-bubble');
    const chatWindow = document.getElementById('chat-window');
    const closeChat = document.getElementById('close-chat');
    const sendButton = document.getElementById('send-button');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    // Almacena el historial de la conversación
    let messageHistory = [];

    // Abrir y cerrar la ventana del chat
    chatBubble.addEventListener('click', () => {
        chatWindow.classList.toggle('open');
        if (chatWindow.classList.contains('open')) {
            addMessage('assistant', "¡Hola! Soy un bot de asistencia. Escribe 'ayuda' para ver lo que puedo hacer.");
        }
    });

    

    closeChat.addEventListener('click', () => {
        chatWindow.classList.remove('open');
    });

    // Enviar mensaje
    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function addMessage(sender, text) {
        // Evita añadir el mensaje de bienvenida si ya existe
        if (sender === 'assistant' && chatMessages.children.length > 0 && chatWindow.classList.contains('open')) {
             const lastMessage = chatMessages.lastElementChild.textContent;
             if (lastMessage.includes("¡Hola! Soy un bot de asistencia")) return;
        }

        const messageElement = document.createElement('div'); 
        messageElement.classList.add('chat-message', sender);

        // Si es el indicador de escritura, añade la animación
        if (text === 'TYPING_INDICATOR') {
            messageElement.classList.add('typing');
            messageElement.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
        } else {
            messageElement.textContent = text;
        }

        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll
        return messageElement; // Devuelve el elemento para poder eliminarlo
    }

    function getBotResponse(userInput) {
        const lowerInput = userInput.toLowerCase();

        if (lowerInput.includes('hola')) {
            return "¡Hola! ¿En qué puedo ayudarte? Escribe 'servicios', 'contacto' o 'ayuda'.";
        } else if (lowerInput.includes('servicio')) {
            return "Ofrecemos servicios de plomería, refrigeración y electricidad. Puedes ver más detalles en nuestra página de 'Servicios'.";
        } else if (lowerInput.includes('contacto')) {
            return "Puedes encontrar nuestra información de contacto en la página de 'Contacto'.";
        } else if (lowerInput.includes('ayuda')) {
            return "Puedes preguntarme sobre: \n- servicios \n- contacto";
        } else if (lowerInput.includes('gracias')) {
            return "¡De nada! Si necesitas algo más, no dudes en preguntar.";
        } else {
            return "No he entendido tu pregunta. Por favor, intenta con 'servicios', 'contacto' o 'ayuda'.";
        }
    }

    function sendMessage() {
        const userInput = chatInput.value.trim();
        if (userInput === '') return;

        addMessage('user', userInput);
        chatInput.value = '';

        // Muestra la animación de escritura
        const typingIndicator = addMessage('assistant', 'TYPING_INDICATOR');
        chatInput.disabled = true;
        sendButton.disabled = true;
        setTimeout(() => {
            typingIndicator.remove(); // Elimina la animación
            const botResponse = getBotResponse(userInput);
            addMessage('assistant', botResponse);
            chatInput.disabled = false;
            sendButton.disabled = false;
            chatInput.focus();
        }, 1200); // Simula un tiempo de respuesta
    }

    // --- Lógica del Lightbox para la galería ---
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        const lightboxImg = document.getElementById('lightbox-img');
        const galleryImages = document.querySelectorAll('.installation-gallery img');
        const closeLightbox = document.querySelector('.lightbox-close');

        galleryImages.forEach(image => {
            image.addEventListener('click', () => {
                lightbox.style.display = 'flex';
                lightboxImg.src = image.src;
            });
        });

        const hideLightbox = () => {
            lightboxImg.classList.remove('zoomed'); // Resetea el zoom al cerrar
            lightbox.style.display = 'none';
        };

        closeLightbox.addEventListener('click', hideLightbox);
        
        // Cierra el lightbox si se hace clic en el fondo (pero no en la imagen)
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) hideLightbox();
        });

        lightboxImg.addEventListener('click', () => {
            lightboxImg.classList.toggle('zoomed');
        });
    }
});
