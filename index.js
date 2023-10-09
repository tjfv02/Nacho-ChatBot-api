const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
// Middleware para analizar el cuerpo de la solicitud como JSON
app.use(bodyParser.json());

// Habilita CORS para todas las rutas
app.use(cors());

// Middleware para analizar el cuerpo de la solicitud como JSON
app.use(bodyParser.json());

// Función openaiTest
const openaiTest = async (data) => {
    try {
        const options = {
            method: 'POST',
            baseURL: 'https://api.openai.com/v1/completions',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer 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`
            },
            data: {
                "model": "text-davinci-003",
                "prompt": data.text, 
                "temperature": 0.1,
                "max_tokens": 500,
                "top_p": 1,
                "frequency_penalty": 0,
                "presence_penalty": 0,
                "stop": ["_END"]
            }
        }

        const result = await axios(options);
        console.log('RESPUESTA CHATGPT - ', result.data);

        if (result.data) {
            const responseData = result.data;
            const respuesta = responseData.choices[0].text;
            let texto_limpio = respuesta.replace(/\n/g, '').replace(/#/g, '');

            const responseJSON = {
                text: texto_limpio,
                timestamp: new Date(),
                isUser: false,
            };

            return responseJSON;
        }
    } catch (error) {
        console.error(error);
        
        const errorResponse = {
            text: 'Error al procesar la solicitud',
            timestamp: new Date(),
            isUser: false,
        };
        return errorResponse;
    }
};

// Punto final para procesar las solicitudes POST desde Postman
app.post('/api/openai/preguntar', async (req, res) => {
    try {
        const question = req.body.text; // Obtén la pregunta desde el cuerpo de la solicitud

        // Llama a la función openaiTest con la pregunta
        const responseJSON = await openaiTest({ text: question });

        // Envía la respuesta JSON al cliente (Postman)
        res.json(responseJSON);
    } catch (error) {
        console.error(error);
        // En caso de error, envía una respuesta de error al cliente (Postman)
        res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
});

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor Express escuchando en el puerto ${port}`);
});
