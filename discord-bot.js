import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config(); // Carga las variables de entorno del archivo .env

// --- CONFIGURACIÓN DEL CLIENTE DE DISCORD ---
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

client.once('ready', () => {
    console.log(`¡Bot ${client.user.tag} está en línea!`);
});

client.on('messageCreate', async message => {
    // Evita que el bot se responda a sí mismo
    if (message.author.bot) return;

    // Inicia la animación de "escribiendo..."
    await message.channel.sendTyping();

    try {
        // Prepara el historial para enviar al servidor
        const history = [{ role: 'user', content: message.content }];

        // Llama a tu servidor para obtener la respuesta
        const serverResponse = await fetch('http://localhost:3000/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ history }),
        });

        const data = await serverResponse.json();
        const botResponse = data.response;

        // Envía la respuesta obtenida del servidor al canal de Discord
        message.channel.send(botResponse);
    } catch (error) {
        console.error('Error al contactar el servidor del bot:', error);
        message.channel.send('Lo siento, estoy teniendo problemas para conectarme con mi servidor. Por favor, inténtalo más tarde.');
    }
});

// Inicia sesión en Discord con el token de tu bot
client.login(process.env.DISCORD_BOT_TOKEN);