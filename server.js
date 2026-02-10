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
  let respuestasFormateadas = `
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; background-color: #ffffff;">
  `;

  for (let i = 1; i <= 10; i++) {
    const qKey = `q${i}`;
    const respuestaLetra = data[qKey] || "N/A";
    const preguntaTitulo = preguntasMapa[qKey] || `Pregunta #${i}`;
    const respuestaTexto = preguntasMapa.opciones[qKey]
      ? preguntasMapa.opciones[qKey][respuestaLetra]
      : `Opción ${respuestaLetra.toUpperCase()}`;

    // Estilo condicional para resaltar respuestas 'c' (las mejores) o 'a' (dolores fuertes)
    const colorRespuesta = respuestaLetra === 'c' ? '#059669' : (respuestaLetra === 'a' ? '#FF1053' : '#1d519f');
    const bgRespuesta = respuestaLetra === 'c' ? '#ecfdf5' : (respuestaLetra === 'a' ? '#fff1f2' : '#f0f7ff');

    respuestasFormateadas += `
      <tr>
        <td style="padding: 15px; border-bottom: 1px solid #f1f5f9;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="font-family: Arial, sans-serif; font-size: 14px; color: #64748b; font-weight: bold; padding-bottom: 5px;">
                ${preguntaTitulo}
              </td>
            </tr>
            <tr>
              <td style="background-color: ${bgRespuesta}; border-left: 4px solid ${colorRespuesta}; padding: 12px 15px; border-radius: 4px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="font-family: Arial, sans-serif; font-size: 15px; color: ${colorRespuesta}; font-weight: 600;">
                      <span style="background-color: ${colorRespuesta}; color: #ffffff; padding: 2px 8px; border-radius: 3px; font-size: 12px; margin-right: 10px;">
                        ${respuestaLetra.toUpperCase()}
                      </span>
                      ${respuestaTexto}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `;
  }

  respuestasFormateadas += `</table>`;
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
    from: '"Códice Mkt + Tech" <' + process.env.EMAIL_USER + ">",
    to: emailUsuario,
    subject: `✅ Diagnóstico Digital Finalizado: ${data.nombre}`,
    html: `
      <div style="background-color: #f6f7f8; padding: 30px 10px; font-family: 'Segoe UI', Arial, sans-serif;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          
          <tr>
            <td style="padding: 30px; text-align: center; border-bottom: 1px solid #f1f5f9;">
              <table align="center" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <img src="./img/logotipo_codice.webp" alt="Códice Logo" width="120" style="display: block; margin: 0 auto 10px auto;" />
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px 50px;">
              <h1 style="color: #0f172a; font-size: 24px; margin: 0 0 15px 0;">¡Hola, ${data.nombre}!</h1>
              <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                Gracias por completar nuestra <strong>Auditoría de Presencia Digital</strong>. Nuestro sistema ha analizado tus respuestas sobre el ecosistema de <strong>${data.company_name || 'tu empresa'}</strong> y este es el camino estratégico que recomendamos para tu escalabilidad técnica:
              </p>

              <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#f0f7ff" style="border-radius: 8px; border: 1px solid #1d519f; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 25px; text-align: center;">
                    <div style="color: #1d519f; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">Estrategia Sugerida</div>
                    <div style="color: #1d519f; font-size: 24px; font-weight: 800; margin-bottom: 5px;">${recomendacion.plan}</div>
                    <div style="color: #1d519f; font-size: 16px; opacity: 0.8;">Inversión estimada: ${recomendacion.costo}</div>
                  </td>
                </tr>
              </table>

              <h3 style="color: #0f172a; font-size: 18px; margin-bottom: 10px;">¿Por qué este plan?</h3>
              <p style="color: #64748b; font-size: 15px; line-height: 1.6; margin-bottom: 30px; border-left: 3px solid #FF1053; padding-left: 15px;">
                ${recomendacion.justificacion}
              </p>

              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #121820; border-radius: 8px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 25px; text-align: center;">
                    <p style="color: #ffffff; font-size: 15px; margin-bottom: 20px;">Un consultor senior revisará tu caso para presentarte una hoja de ruta detallada en las próximas 24 horas.</p>
                    <a href="https://wa.me/59390904105" style="background-color: #25D366; color: #ffffff; padding: 12px 25px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">HABLAR CON UN EXPERTO</a>
                  </td>
                </tr>
              </table>

              <p style="color: #475569; font-size: 14px; text-align: center;">
                Atentamente,<br>
                <strong>El equipo de Códice Mkt + Tech</strong>
              </p>
            </td>
          </tr>

          <tr>
            <td bgcolor="#f8fafc" style="padding: 20px; text-align: center; border-top: 1px solid #f1f5f9;">
              <p style="color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin: 0;">
                © 2026 Códice Tecnología & Desarrollo S.A.S
              </p>
            </td>
          </tr>
        </table>
      </div>
    `
  };

  // --- CORREO 2: Para el ADMINISTRADOR (MODIFICADO) ---
  const mailOptionsAdmin = {
    from: '"Códice Intelligence" <' + process.env.EMAIL_USER + ">",
    to: process.env.EMAIL_USER,
    subject: `🚨 LEAD CALIFICADO: ${data.nombre} - ${recomendacion.plan}`,
    html: `
      <div style="background-color: #f6f7f8; padding: 20px; font-family: Arial, sans-serif;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0;">
          <tr>
            <td bgcolor="#121820" style="padding: 20px; text-align: center;">
              <span style="color: #ffffff; font-size: 20px; font-weight: bold; letter-spacing: 2px;">CÓDICE AUDIT REPORT</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px;">
              <h2 style="color: #1d519f; margin-top: 0;">Datos del Prospecto</h2>
              <table width="100%" style="margin-bottom: 20px; font-size: 14px; color: #475569;">
                <tr><td style="padding: 5px 0;"><strong>Nombre:</strong> ${data.nombre}</td></tr>
                <tr><td style="padding: 5px 0;"><strong>Email:</strong> ${data.email}</td></tr>
                <tr><td style="padding: 5px 0;"><strong>WhatsApp/Telf:</strong> ${data.contacto}</td></tr>
                <tr><td style="padding: 5px 0;"><strong>Antigüedad Empresa:</strong> ${data.edad} años</td></tr>
              </table>
              
              <div style="background-color: #FF1053; color: #ffffff; padding: 15px; border-radius: 6px; text-align: center; margin-bottom: 30px;">
                <div style="font-size: 12px; text-transform: uppercase; opacity: 0.9;">Plan Recomendado</div>
                <div style="font-size: 22px; font-weight: bold;">${recomendacion.plan}</div>
                <div style="font-size: 14px; margin-top: 5px;">Inversión estimada: ${recomendacion.costo}</div>
              </div>

              <h3 style="color: #1d519f; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px;">Análisis de Respuestas</h3>
              ${formatarRespuestasParaAdmin(data)}
              
              <div style="margin-top: 30px; padding: 20px; background-color: #f8fafc; border-radius: 6px; font-size: 13px; color: #64748b; line-height: 1.5;">
                <strong>Nota Comercial:</strong> Este cliente ha sido calificado automáticamente. Basado en el volumen de respuestas "A", se recomienda priorizar el discurso sobre <b>Eficiencia Operativa</b> y <b>Recuperación de ROI</b>.
              </div>
            </td>
          </tr>
        </table>
      </div>
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
