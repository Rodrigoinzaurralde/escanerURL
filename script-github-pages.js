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
    const proxyUrl = 'https://api.allorigins.win/raw?url=';
    return fetch(proxyUrl + encodeURIComponent(url), options);
}

scanButton.addEventListener('click', async () => {
    const urlToScan = urlInput.value.trim();
    const API_KEY = getDecodedApiKey(); 

    if (!urlToScan) {
        resultDiv.innerHTML = '<p class="unknown">Por favor, introduce una URL válida.</p>';
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
        }

        if (!analysisResult) {
            resultDiv.innerHTML = '<p class="unknown">El análisis tardó demasiado o no se completó.</p>';
            return;
        }

        displayResults(urlToScan, analysisResult);

    } catch (error) {
        console.error('Error durante el escaneo:', error);
        resultDiv.innerHTML = `<p class="positive">Ocurrió un error: ${error.message}. Verifica el límite de peticiones de la API.</p>`;
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
    if (malicious > 0) {
        verdictMessage = `<span class="positive">¡Cuidado! ${malicious} motores de seguridad detectaron esta URL como MALICIOSA.</span>`;
    } else if (suspicious > 0) {
        verdictMessage = `<span class="unknown">¡Atención! ${suspicious} motores de seguridad la marcaron como SOSPECHOSA.</span>`;
    } else if (harmless > 0 && undetected > 0) {
        verdictMessage = `<span class="negative">Esta URL parece segura. Detectada como HARMLESS por ${harmless} y UNDETECTED por ${undetected} motores.</span>`;
    } else if (harmless > 0) {
        verdictMessage = `<span class="negative">Esta URL parece segura. Detectada como HARMLESS por ${harmless} motores.</span>`;
    } else {
        verdictMessage = `<span class="unknown">Estado desconocido. No hay detecciones maliciosas o sospechosas.</span>`;
    }

    resultDiv.innerHTML = `
        <p><strong>URL Escaneada:</strong> ${url}</p>
        <p><strong>Resultado General:</strong> ${verdictMessage}</p>
        <p><strong>Detecciones Maliciosas:</strong> <span class="positive">${malicious}</span></p>
        <p><strong>Detecciones Sospechosas:</strong> <span class="unknown">${suspicious}</span></p>
        <p><strong>Harmless (inofensivo):</strong> <span class="negative">${harmless}</span></p>
        <p><strong>No Detectado:</strong> <span>${undetected}</span></p>
        <p><strong>Total de Motores:</strong> ${totalScans}</p>
        <p><small>Este resultado se basa en el análisis de VirusTotal.</small></p>
    `;
}
