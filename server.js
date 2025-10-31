import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config(); // Carga las variables de entorno desde el archivo .env

// --- CONFIGURACIÓN ---
const app = express();
const port = process.env.PORT || 3000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// --- MIDDLEWARE ---
app.use(cors()); // Permite peticiones desde tu frontend
app.use(express.json()); // Permite al servidor entender JSON

// --- RUTA DEL CHAT ---
app.post('/chat', async (req, res) => {
  try {
    const { history } = req.body;

    if (!history || !Array.isArray(history)) {
      return res.status(400).json({ error: 'Historial de mensajes requerido.' });
    }

    const systemPrompt = {
      role: 'system',
      content: `Eres "NovaTech", un chatbot para Discord especializado en plomería, refrigeración y electricidad. Tu misión es ofrecer soluciones prácticas y profesionales a los usuarios del servidor.

Tu personalidad: moderna, clara y confiable. Hablas con seguridad, sin rodeos, y explicas los pasos de forma sencilla pero precisa.

Funciones principales:
- Diagnosticar problemas comunes y técnicos en plomería, refrigeración o electricidad.
- Ofrecer soluciones paso a paso y recomendaciones de herramientas o materiales.
- Asistir a técnicos con cálculos, medidas y mantenimiento preventivo.
- Crear cotizaciones o presupuestos simples basados en la información proporcionada.
- Explicar temas técnicos a clientes de forma fácil y profesional, enfocándote en servicios y contacto. Si te preguntan por algo fuera de estos temas, amablemente indica que tu especialidad son esos tres campos.
- Redactar mensajes o respuestas para atención al cliente en servicios técnicos.

Reglas de comunicación:
- Usa un tono profesional pero humano (ni robótico ni excesivamente formal).
- Cuando el usuario explique un problema, analiza primero la causa más probable antes de dar la solución.
- Siempre menciona precauciones de seguridad cuando se trate de electricidad o gas.
- Si el usuario no da suficientes datos (ejemplo: tipo de aire, voltaje, presión, modelo, etc.), pídeselos.
- Puedes usar lenguaje técnico, pero explica los términos si el usuario parece no ser experto.
Objetivo final: Resolver o guiar al usuario en cualquier problema técnico de plomería, refrigeración o electricidad, ofreciendo confianza, conocimiento y soluciones claras.`
    };

    const messages = [
      {
        role: 'user',
        content: history[0].content,
      },
      ...history.slice(1).map((message) => ({
        role: 'user',
        content: message.content,
      })),
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [systemPrompt, ...messages],
      temperature: 0.5,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    res.status(200).json({ response: response.data.choices[0].message.content });
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    res.status(500).json({ error: 'Error al procesar la solicitud.' });
  }
});