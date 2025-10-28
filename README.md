# 🔍 Escáner de URLs Segura

Una aplicación web simple para verificar la seguridad de URLs utilizando la API de VirusTotal.

## 📋 Descripción

Esta aplicación permite a los usuarios escanear URLs para detectar contenido malicioso o sospechoso utilizando los motores de seguridad de VirusTotal. La interfaz es intuitiva y proporciona resultados claros sobre la seguridad de las URLs analizadas.

## ✨ Características

- 🔐 **Seguridad**: API key codificada en Base64 para mayor protección
- 🎨 **Interfaz moderna**: Diseño responsivo con Google Fonts (Roboto)
- ⚡ **Tiempo real**: Resultados instantáneos con indicador de carga
- 📊 **Análisis completo**: Muestra estadísticas detalladas de detección
- 🚨 **Alertas visuales**: Código de colores para diferentes tipos de amenazas

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos y responsivos
- **JavaScript ES6+**: Funcionalidad asíncrona con fetch API
- **VirusTotal API v3**: Análisis de seguridad de URLs

## 📁 Estructura del Proyecto

```
API/
├── index.html      # Página principal
├── script.js       # Lógica de la aplicación
├── style.css       # Estilos CSS
└── README.md       # Documentación
```

## 🚀 Instalación y Uso

### Opción 1: Usar la versión en línea (Recomendado)
La aplicación está desplegada en Vercel:
**[🔗 Acceder a la aplicación](https://escaner-url.vercel.app/)**

### Opción 2: Ejecutar localmente

#### Prerrequisitos
- Node.js 16+ instalado
- npm o yarn
- Conexión a internet

#### Pasos para ejecutar localmente
1. **Clona** este repositorio:
   ```bash
   git clone https://github.com/Rodrigoinzaurralde/escanerURL.git
   cd escanerURL
   ```
2. **Instala** las dependencias:
   ```bash
   npm install
   ```
3. **Ejecuta** el servidor:
   ```bash
   npm start
   ```
4. **Abre** tu navegador en `http://localhost:3000`

### Deployment en Vercel

#### Para deployar tu propia versión:
1. **Fork** este repositorio
2. **Conecta** tu cuenta de GitHub con Vercel
3. **Importa** el proyecto en Vercel
4. **Deploy** automático ✨

## 📊 Interpretación de Resultados

La aplicación muestra los siguientes estados:

- 🔴 **MALICIOSA**: URL detectada como peligrosa por uno o más motores
- 🟡 **SOSPECHOSA**: URL marcada como sospechosa
- 🟢 **SEGURA**: URL considerada inofensiva (Harmless)
- ⚪ **NO DETECTADA**: Sin detecciones específicas

## 🔧 Configuración

### API Key

La API key de VirusTotal está preconfigurada y codificada en Base64 por seguridad. Si necesitas usar tu propia API key:

1. Obtén una API key de [VirusTotal](https://www.virustotal.com/gui/join-us)
2. Codifica tu API key en Base64
3. Reemplaza el valor en la variable `ORIGINAL_API_KEY` en `script.js`

### Personalización

Puedes personalizar:

- **Colores**: Modifica las clases CSS en `style.css`
- **Tiempos de espera**: Ajusta `maxAttempts` y `delay` en `script.js`
- **Mensajes**: Cambia los textos en español por tu idioma preferido

## 🔒 Seguridad

- ✅ API key codificada en Base64
- ✅ Validación de entrada de URLs
- ✅ Manejo de errores robusto
- ✅ Sin almacenamiento de datos sensibles

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📜 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si encuentras algún problema o tienes preguntas:

1. Revisa que tengas conexión a internet
2. Verifica que la URL esté bien formateada
3. Comprueba la consola del navegador para errores
4. Considera los límites de la API de VirusTotal

## 📝 Notas Importantes

- **Límites de API**: VirusTotal tiene límites en las consultas por minuto
- **URLs válidas**: Asegúrate de incluir el protocolo (http:// o https://)
- **Tiempo de análisis**: Algunos análisis pueden tardar varios segundos

## 🙏 Agradecimientos

- [VirusTotal](https://www.virustotal.com/) por proporcionar la API de análisis
- [Google Fonts](https://fonts.google.com/) por la tipografía Roboto
- Comunidad de desarrolladores por las mejores prácticas implementadas

---
