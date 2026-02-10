// server.js (Backend en Node.js con Express)

// =================================================================
// 1. INCLUSIÓN DE LIBRERÍAS (TOP-LEVEL)
// =================================================================
require("dotenv").config(); // Carga las variables del .env en process.env
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer"); // <--- AHORA EN EL TOP-LEVEL
const path = require('path');

const app = express();
const port = 3000;

// =================================================================
// 2. CONFIGURACIÓN DE MIDDLEWARE
// =================================================================
app.use(cors({ origin: "*" }));
app.use(bodyParser.json({ limit: "1mb" }));

// =================================================================
// 3. CONFIGURACIÓN DE NODEMAILER (TOP-LEVEL)
// =================================================================
const emailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// =================================================================
// 4. FUNCIONES DE LÓGICA (TOP-LEVEL)
// =================================================================
// server.js (Sección 4. FUNCIONES DE LÓGICA)

// Estructura de mapeo: relaciona la clave de pregunta (q1) y la letra de respuesta (a/b/c) con el texto.
const preguntasMapa = {
  q1: "1. Identidad Digital / Web",
  q2: "2. Estrategia y Objetivos",
  q3: "3. Posicionamiento Orgánico (SEO)",
  q4: "4. Publicidad Pagada (PPC/Ads)",
  q5: "5. Generación de Leads",
  q6: "6. Gestión de Redes Sociales",
  q7: "7. Contenido Estratégico",
  q8: "8. Analítica Web",
  q9: "9. Optimización de Conversión (CRO)",
  q10: "10. Consultoría y Soporte",

  // OPCIONES DE RESPUESTA POR PREGUNTA (Copiadas de tu HTML)
  opciones: {
    q1: {
      a: "No tengo sitio web.",
      b: "Sí, pero no está optimizado (lento, sin diseño responsive, desactualizado).",
      c: "Sí, está activo y funciona bien (es rápido, moderno, adaptable).",
    },
    q2: {
      a: "No, solo publicamos esporádicamente.",
      b: "Tenemos objetivos vagos, pero no KPIs o funnels definidos.",
      c: "Sí, tenemos una estrategia clara con métricas definidas y alineadas al negocio.",
    },
    q3: {
      a: "No sé qué es SEO o no lo hacemos.",
      b: "Hacemos cosas básicas (ej. optimizar un título) pero sin estrategia integral (link building, técnica).",
      c: "Sí, implementamos auditorías regulares, optimización on-page, off-page y técnica.",
    },
    q4: {
      a: "No utilizamos publicidad pagada.",
      b: "Sí, campañas básicas para generar likes/mensajes directos, pero sin análisis de ROI/ROAS.",
      c: "Sí, gestionamos campañas complejas con funnels de venta avanzados y retargeting medido.",
    },
    q5: {
      a: "Los leads se quedan en la bandeja de entrada o WhatsApp.",
      b: "Usamos un CRM o herramienta básica, pero no hay automatización de marketing.",
      c: "Sí, tenemos funnels automatizados (Email Marketing, Retargeting) y un CRM integrado.",
    },
    q6: {
      a: "Publicaciones irregulares sin diseño profesional ni interacción activa con la comunidad.",
      b: "Publicaciones regulares y diseño gráfico aceptable, con gestión básica de la comunidad.",
      c: "Gestión multicanal avanzada, con diseño profesional, contenido rico (video, micro-videos) y tono coherente de marca.",
    },
    q7: {
      a: "No, solo publicamos sobre nuestros productos/servicios.",
      b: "A veces, pero no hay un plan de contenidos mensual o trimestral estratégico.",
      c: "Sí, todo el contenido está planificado, optimizado para SEO y diseñado para cada etapa del embudo.",
    },
    q8: {
      a: "No usamos ninguna herramienta o solo miramos las métricas de likes.",
      b: "Sí, tenemos Google Analytics instalado, pero no generamos reportes con conclusiones accionables.",
      c: "Sí, hacemos seguimiento detallado, análisis de la competencia y reportes mensuales con estrategias de mejora (CRO).",
    },
    q9: {
      a: "No, la web es estática.",
      b: "Hemos hecho cambios puntuales, pero no hay una estrategia de mejora continua basada en datos.",
      c: "Sí, implementamos pruebas A/B y mejoras continuas para maximizar la conversión.",
    },
    q10: {
      a: "No, solo necesito ejecución básica.",
      b: "Podría ser útil.",
      c: "Sí, es fundamental para la dirección estratégica del negocio.",
    },
  },
};
// Función para formatear los datos de las respuestas en texto legible (MODIFICADA)
function formatarRespuestasParaAdmin(data) {
  let respuestasFormateadas = "";

  for (let i = 1; i <= 10; i++) {
    const qKey = `q${i}`;
    const respuestaLetra = data[qKey] || "N/A"; // Obtiene la letra (a, b, c)

    // Intenta obtener el texto completo de la respuesta
    // Usa el mapa (preguntasMapa) para encontrar el texto de la opción.
    const preguntaTitulo =
      preguntasMapa[qKey] || `Pregunta #${i} (Título no encontrado)`;
    const respuestaTexto = preguntasMapa.opciones[qKey]
      ? preguntasMapa.opciones[qKey][respuestaLetra]
      : `Respuesta (Letra: ${respuestaLetra.toUpperCase()})`;

    // Formato para el correo del administrador
    respuestasFormateadas += `
            <p style="margin-bottom: 5px;">
                <strong>${preguntaTitulo}:</strong>
            </p>
            <p style="margin-top: 0; padding-left: 20px; color: #007bff;">
                &rarr; **Opción Seleccionada:** ${respuestaTexto} 
                <span style="font-weight: bold; color: #555;">(${respuestaLetra.toUpperCase()})</span>
            </p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 10px 0;">
        `;
  }

  return respuestasFormateadas;
}

const validateAndSanitizeData = (data) => {
  // ... (El código de validación sigue siendo el mismo y funciona correctamente)
  const textFields = ["nombre", "contacto", "email"];

  for (const field of textFields) {
    if (!data[field] || typeof data[field] !== "string") {
      return {
        valid: false,
        message: `El campo ${field} es obligatorio o tiene un formato incorrecto.`,
      };
    }
    data[field] = data[field]
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .trim();
    if (data[field].length > 100) {
      return {
        valid: false,
        message: `El campo ${field} excede la longitud permitida.`,
      };
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return {
      valid: false,
      message: "El formato del correo electrónico no es válido.",
    };
  }

  const edad = parseInt(data.edad);
  if (isNaN(edad) || edad < 0 || edad > 150) {
    return {
      valid: false,
      message: "La edad de la empresa no es un número válido.",
    };
  }

  for (let i = 1; i <= 10; i++) {
    const qKey = `q${i}`;
    if (!["a", "b", "c"].includes(data[qKey])) {
      return {
        valid: false,
        message: `La respuesta a la pregunta ${i} no es válida.`,
      };
    }
  }

  return { valid: true, sanitizedData: data };
};

// Función para analizar las respuestas y recomendar el plan (movida al top-level)
function analizarRecomendacion(respuestas) {
  const respuestasA = [];
  const respuestasB = [];
  const respuestasC = [];

  for (let i = 1; i <= 10; i++) {
    const respuesta = respuestas[`q${i}`];
    if (respuesta === "a") {
      respuestasA.push(i);
    } else if (respuesta === "b") {
      respuestasB.push(i);
    } else if (respuesta === "c") {
      respuestasC.push(i);
    }
  }

  const totalA = respuestasA.length;
  const totalB = respuestasB.length;
  const totalC = respuestasC.length;

  let recomendacion = {
    plan: "Plan Marketing Pro",
    costo: "$650 USD/mes",
    justificacion:
      "Su negocio opera con un nivel de madurez alto y requiere una optimización avanzada, análisis de competencia detallado y la participación directa de consultoría estratégica.",
  };

  if (totalA >= 4 || (totalA + totalB > totalC && totalC <= 2)) {
    recomendacion = {
      plan: "Plan Marketing Starter",
      costo: "$350 USD/mes",
      justificacion:
        "Foco Principal: Su negocio necesita establecer una base sólida de generación de leads y una gestión social profesional mínima para adquirir presencia.",
    };
  } else if (totalB >= 5 || (totalC > totalA && totalC < totalB)) {
    recomendacion = {
      plan: "Plan Marketing Growth",
      costo: "$490 USD/mes",
      justificacion:
        "Foco Principal: Su negocio ya tiene una presencia o necesita desarrollarla desde un enfoque 360, requiriendo estrategia SEO/SEM, desarrollo web y contenido rico.",
    };
  }

  return recomendacion;
}

// =================================================================
// 5. RUTA PRINCIPAL (ÚNICA Y CORRECTA)
// =================================================================

app.get("/", (req, res) => {
    // __dirname es la ruta actual del directorio. Aquí asumes que index.html está en la raíz.
    // Usamos res.sendFile() para enviar el archivo HTML al navegador.
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post("/submit-auditoria", async (req, res) => {
  // ... (Validación y obtención de data) ...
  const validationResult = validateAndSanitizeData(req.body);
  // IMPORTANTE: Asegúrate de que esta línea esté presente para evitar el ReferenceError
  if (!validationResult.valid) {
    console.error("Error de validación:", validationResult.message);
    return res.status(400).json({ error: validationResult.message });
  }
  const data = validationResult.sanitizedData;
  const emailUsuario = data.email;

  // 1. Analizar la recomendación
  const recomendacion = analizarRecomendacion(data);

  // --- CORREO 1: Para el CLIENTE (¡AGREGANDO EL CUERPO HTML!) ---
  const mailOptionsCliente = {
    from: '"Auditoría CÓDICE" <' + process.env.EMAIL_USER + ">",
    to: emailUsuario,
    subject: `✅ ¡Tu Auditoría Digital CÓDICE ha sido completada, ${data.nombre}!`,
    // =========================================================
    // AÑADIENDO EL CUERPO HTML COMPLETO DEL CLIENTE AQUÍ
    // =========================================================
    html: `
            <h2>Diagnóstico de Presencia Digital</h2>
            <p>Hola ${data.nombre},</p>
            <p>Hemos procesado tu auditoría y aquí está un resumen de la recomendación de plan basada en tus respuestas:</p>
            <div style="border: 1px solid #007bff; padding: 15px; border-radius: 5px; background-color: #e6f7ff;">
                <h3>🎯 Recomendación: ${recomendacion.plan} (${recomendacion.costo})</h3>
            </div>
            <p><strong>Justificación:</strong> ${recomendacion.justificacion}</p>
            <p>Un asesor se pondrá en contacto contigo en las próximas 24 horas a través de ${data.contacto} o este email para profundizar en tu diagnóstico.</p>
            <p>Gracias por confiar en CÓDICE.</p>
            <hr>
            <small>Este es un mensaje automatizado. Por favor, no respondas a este correo.</small>
        `,
  };

  // --- CORREO 2: Para el ADMINISTRADOR (MODIFICADO) ---
  const mailOptionsAdmin = {
    from: '"Notificación CÓDICE Server" <' + process.env.EMAIL_USER + ">",
    to: process.env.EMAIL_USER,
    subject: `🚨 NUEVA AUDITORÍA CÓDICE: ${data.nombre} (${recomendacion.plan})`,
    html: `
            <h2>Nueva Solicitud de Auditoría Recibida</h2>
            <p><strong>De:</strong> ${data.nombre}</p>
            <p><strong>Contacto:</strong> ${data.contacto}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Edad de la Empresa (años):</strong> ${data.edad}</p>
            <hr>
            <h3>Recomendación Calculada: ${recomendacion.plan}</h3>
            
            <p><strong>Justificación del Plan:</strong> ${
              recomendacion.justificacion
            }</p>
            
            <hr>
            <h4>Respuestas Detalladas del Cliente:</h4>
            ${formatarRespuestasParaAdmin(data)} 
            
            <p>Favor de contactar para iniciar la venta.</p>
        `,
  };

  // 2. Enviar los correos y manejar errores
  try {
    // ... (Tu código try/catch para enviar correos y responder) ...
    const infoCliente = await emailTransporter.sendMail(mailOptionsCliente);
    console.log(
      `Recomendación enviada con éxito a: ${emailUsuario}. Respuesta: ${infoCliente.response}`
    );

    const infoAdmin = await emailTransporter.sendMail(mailOptionsAdmin);
    console.log(
      `Notificación de administrador enviada con éxito. Respuesta: ${infoAdmin.response}`
    );

    res.status(200).send({
      message: "Recomendación enviada con éxito.",
      plan: recomendacion.plan,
    });
  } catch (error) {
    console.error("⛔ Error Crítico al enviar el correo:", error.message);
    res.status(500).send({
      message:
        "Formulario recibido, pero hubo un error al enviar el correo automático. Te contactaremos manualmente.",
      error: error.message,
    });
  }
});

// =================================================================
// 6. INICIAR EL SERVIDOR
// =================================================================
app.listen(port, () => {
  console.log(`Servidor de auditoría escuchando en http://localhost:${port}`);
});
