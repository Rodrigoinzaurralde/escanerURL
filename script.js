// Clave de API de VirusTotal codificada en Base64
const ORIGINAL_API_KEY = 'NDJjZWZjMGZhNzI2MDZlYzNkZmM2YjRlNWVjMGYzNmFhMjIyZmI3MmY0MDc0ZDJjNTM3OGRmYWIxOWU0MDMwMQo='; 

const urlInput = document.getElementById('urlInput');
const scanButton = document.getElementById('scanButton');
const resultDiv = document.getElementById('result');
const loadingSpinner = document.getElementById('loadingSpinner');

function getDecodedApiKey() {
    return atob(ORIGINAL_API_KEY);
}

async function makeProxyRequest(url, options) {
    const proxyUrl = 'https://peaceful-springs-61070.herokuapp.com/';
    
    try {
        const response = await fetch(proxyUrl + url, options);
        return response;
    } catch (error) {
        throw new Error('Servicio temporalmente no disponible. La API de VirusTotal requiere un servidor backend para evitar restricciones CORS.');
    }
}

scanButton.addEventListener('click', async () => {
    const urlToScan = urlInput.value.trim();
    const API_KEY = getDecodedApiKey(); 

    if (!urlToScan) {
        resultDiv.innerHTML = '<p class="unknown">Por favor, introduce una URL válida.</p>';
        return;
    }

    try {
        new URL(urlToScan);
    } catch (e) {
        resultDiv.innerHTML = '<p class="unknown">Por favor, introduce una URL válida con formato correcto (ej: https://example.com).</p>';
        return;
    }

    resultDiv.innerHTML = ''; 
    loadingSpinner.style.display = 'block'; 

    try {
        const submitResponse = await makeProxyRequest('https://www.virustotal.com/api/v3/urls', {
            method: 'POST',
            headers: {
                'x-apikey': API_KEY,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `url=${encodeURIComponent(urlToScan)}`
        });

        if (!submitResponse.ok) {
            let errorData;
            try {
                errorData = await submitResponse.json();
            } catch (e) {
                errorData = { error: { message: submitResponse.statusText } };
            }
            throw new Error(`Error al enviar URL: ${submitResponse.status} - ${errorData.error ? errorData.error.message : submitResponse.statusText}`);
        }

        const submitData = await submitResponse.json();
        const analysisId = submitData.data.id;

        let analysisResult = null;
        let attempts = 0;
        const maxAttempts = 10; 
        const delay = 3000; 

        resultDiv.innerHTML = '<p>⏳ Analizando URL... Esto puede tardar hasta 30 segundos.</p>';

        while (analysisResult === null && attempts < maxAttempts) {
            await new Promise(res => setTimeout(res, delay)); 
            
            const getAnalysisResponse = await makeProxyRequest(`https://www.virustotal.com/api/v3/analyses/${analysisId}`, {
                method: 'GET',
                headers: {
                    'x-apikey': API_KEY
                }
            });

            if (!getAnalysisResponse.ok) {
                let errorData;
                try {
                    errorData = await getAnalysisResponse.json();
                } catch (e) {
                    errorData = { error: { message: getAnalysisResponse.statusText } };
                }
                throw new Error(`Error al obtener análisis: ${getAnalysisResponse.status} - ${errorData.error ? errorData.error.message : getAnalysisResponse.statusText}`);
            }

            const getAnalysisData = await getAnalysisResponse.json();
            if (getAnalysisData.data.attributes.status === 'completed') {
                analysisResult = getAnalysisData.data.attributes;
            }
            attempts++;

            resultDiv.innerHTML = `<p>⏳ Analizando URL... Intento ${attempts}/${maxAttempts}</p>`;
        }

        if (!analysisResult) {
            resultDiv.innerHTML = '<p class="unknown">⏰ El análisis tardó demasiado o no se completó. Intenta con una URL diferente o usa la versión completa en Vercel.</p>';
            return;
        }

        displayResults(urlToScan, analysisResult);

    } catch (error) {
        console.error('Error durante el escaneo:', error);
        resultDiv.innerHTML = `
            <div class="error-message">
                <p class="positive">${error.message}</p>
                <p><strong>💡 Recomendación:</strong> Para mejor funcionalidad, usa la versión completa:</p>
                <p><a href="https://escaner-url.vercel.app/" target="_blank" style="color: #007bff; text-decoration: none;">
                    🚀 Abrir versión completa en Vercel
                </a></p>
            </div>
        `;
    } finally {
        loadingSpinner.style.display = 'none'; 
    }
});

function displayResults(url, analysis) {
    let malicious = analysis.stats.malicious || 0;
    let suspicious = analysis.stats.suspicious || 0;
    let harmless = analysis.stats.harmless || 0;
    let undetected = analysis.stats.undetected || 0;
    let totalScans = malicious + suspicious + harmless + undetected;

    let verdictMessage = '';
    let verdictIcon = '';
    
    if (malicious > 0) {
        verdictMessage = `¡Cuidado! ${malicious} motores de seguridad detectaron esta URL como MALICIOSA.`;
        verdictIcon = '🚨';
    } else if (suspicious > 0) {
        verdictMessage = `¡Atención! ${suspicious} motores de seguridad la marcaron como SOSPECHOSA.`;
        verdictIcon = '⚠️';
    } else if (harmless > 0 && undetected > 0) {
        verdictMessage = `Esta URL parece segura. Detectada como HARMLESS por ${harmless} y UNDETECTED por ${undetected} motores.`;
        verdictIcon = '✅';
    } else if (harmless > 0) {
        verdictMessage = `Esta URL parece segura. Detectada como HARMLESS por ${harmless} motores.`;
        verdictIcon = '✅';
    } else {
        verdictMessage = `Estado desconocido. No hay detecciones maliciosas o sospechosas.`;
        verdictIcon = '❓';
    }

    resultDiv.innerHTML = `
        <div class="results-container">
            <h3>${verdictIcon} Resultado del Análisis</h3>
            <p><strong>URL Escaneada:</strong> ${url}</p>
            <div class="verdict-box ${malicious > 0 ? 'malicious' : suspicious > 0 ? 'suspicious' : 'safe'}">
                <p><strong>Resultado General:</strong> ${verdictMessage}</p>
            </div>
            <div class="stats-grid">
                <div class="stat-item malicious">
                    <span class="stat-number">${malicious}</span>
                    <span class="stat-label">Maliciosas</span>
                </div>
                <div class="stat-item suspicious">
                    <span class="stat-number">${suspicious}</span>
                    <span class="stat-label">Sospechosas</span>
                </div>
                <div class="stat-item safe">
                    <span class="stat-number">${harmless}</span>
                    <span class="stat-label">Seguras</span>
                </div>
                <div class="stat-item undetected">
                    <span class="stat-number">${undetected}</span>
                    <span class="stat-label">No detectadas</span>
                </div>
            </div>
            <p class="total-scans"><strong>Total de Motores:</strong> ${totalScans}</p>
            <p class="disclaimer">📋 Este resultado se basa en el análisis de VirusTotal.</p>
        </div>
    `;
}
