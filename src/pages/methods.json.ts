import type { APIRoute } from "astro";
import nodemailer, { type SendMailOptions } from "nodemailer";

interface FormDataValues {
  fullName: string;
  dni: string;
  email: string;
  phone: string;
  location: string;
  privacyPolicyAccept: boolean;
  dataUsageAccept: boolean;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const ZEGAL_EMAIL = <string>import.meta.env.ZEGAL_EMAIL;
    const ZEGEL_APP_PASSWORD = <string>import.meta.env.ZEGEL_APP_PASSWORD;

    const form = (await request.json()) as FormDataValues;

    console.log(form);

    if (
      !form.fullName ||
      !/^-?\d*\.?\d+$/.test(form.dni) ||
      !/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(form.email) ||
      !/^9\d{0,8}$/.test(form.phone) ||
      !form.location
    ) {
      return new Response(null, {
        status: 400,
        statusText: "Bad request",
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: ZEGAL_EMAIL,
        pass: ZEGEL_APP_PASSWORD,
      },
    });

    const mailOptions: SendMailOptions = {
      from: "zegelvirtualnoreply@gmail.com",
      to: form.email,
      subject:
        "¡Bienvenido(a) a Despega con Trome y Zegel! Accede a tu curso online ahora",
      html: `
      <p>Estimado(a) ${form.fullName},</p>

      <p>En nombre del equipo de Trome y Zegel, queremos darte la más cordial bienvenida a nuestro programa educativo. Estamos emocionados de tenerte a bordo y confiamos en que tu experiencia de aprendizaje será enriquecedora.</p>

      <p>Para comenzar tu curso 100% online, te proporcionamos los detalles de acceso al Campus Virtual:</p>

      <ul>
      <li>Enlace de Acceso: <a href="https://campus.zegelvirtual.com/Login">https://campus.zegelvirtual.com/Login</a></li>
      <li>Correo Electrónico: <strong>${form.email}</strong></li>
      <li>Contraseña: <strong>${form.dni}</strong></li>
      </ul>

      <p>Por favor, sigue estos pasos para ingresar:</p>
      
      <ol>
      <li>Haz clic en el enlace proporcionado.</li>
      <li>Ingresa tu correo electrónico en el campo correspondiente.</li>
      <li>Utiliza tu DNI como contraseña para acceder al curso.</li>
      </ol>
      
      <p>Recuerda que este correo electrónico contiene información sensible, por lo que te recomendamos guardarla de manera segura. Si tienes algún problema para acceder o necesitas asistencia técnica, no dudes en contactarnos a rconcha@inlearning.edu.pe</p>
      
      <p>Recuerda que tienes 30 días para culminar el curso una vez que lo actives.</p>
      
      <p>¡Todos los cursos incluyen certificado!</p>
      
      <p>Estamos comprometidos a brindarte una experiencia educativa de calidad, y estamos aquí para apoyarte en cada paso del camino. ¡Esperamos que disfrutes de tu viaje de aprendizaje con Despega con Trome y Zegel!</p>
      
      <p>¡Gracias por confiar en nosotros!</p>
      
      <p>Saludos,</p>
      <p><strong>Roger</strong></p>
      <p>[Tu Cargo]</p>
      <p>Despega con Trome y Zegel</p>
      <p><a href="mailto:rconcha@inlearning.edu.pe">rconcha@inlearning.edu.pe</a></p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.error("Error al enviar el correo:", error);
      }
      console.log("Correo enviado:", info.response);
    });

    return new Response(
      JSON.stringify({
        message: "Correo enviado con éxito.",
        ok: true,
      })
    );
  } catch (error) {
    console.log(error);
    return new Response(null, {
      status: 500,
      statusText: "Internal Error",
    });
  }
};
