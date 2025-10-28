const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: ['http://localhost:3000', 'https://escaner-url.vercel.app', 'https://*.vercel.app'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'x-api-key']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('.'));

app.post('/api/virustotal/urls', async (req, res) => {
    try {
        const { fetch } = await import('node-fetch');
        const { url, apiKey } = req.body;

        const response = await fetch('https://www.virustotal.com/api/v3/urls', {
            method: 'POST',
            headers: {
                'x-apikey': apiKey,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `url=${encodeURIComponent(url)}`
        });

        const data = await response.json();
        
        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        res.json(data);
    } catch (error) {
        console.error('Error en proxy:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Proxy para obtener análisis
app.get('/api/virustotal/analyses/:id', async (req, res) => {
    try {
        const { fetch } = await import('node-fetch');
        const { id } = req.params;
        const apiKey = req.headers['x-api-key'];

        const response = await fetch(`https://www.virustotal.com/api/v3/analyses/${id}`, {
            method: 'GET',
            headers: {
                'x-apikey': apiKey
            }
        });

        const data = await response.json();
        
        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        res.json(data);
    } catch (error) {
        console.error('Error en proxy:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`📁 Archivos servidos desde: ${__dirname}`);
    if (process.env.NODE_ENV !== 'production') {
        console.log(`🔍 Abre tu navegador en: http://localhost:${PORT}`);
    }
});

// Export para Vercel
module.exports = app;
