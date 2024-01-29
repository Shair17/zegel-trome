import type { APIRoute } from "astro";
import nodemailer, { type SendMailOptions } from "nodemailer";
import { formSchema, type FormDataValues } from "../schema";
import axios from "axios";

export const POST: APIRoute = async ({ request }) => {
  try {
    const ZEGAL_EMAIL = <string>import.meta.env.ZEGAL_EMAIL;
    const ZEGEL_APP_PASSWORD = <string>import.meta.env.ZEGEL_APP_PASSWORD;

    const form = (await request.json()) as FormDataValues;
    const formData = new FormData();
    const data = formSchema.safeParse(form);

    if (data.success) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: ZEGAL_EMAIL,
          pass: ZEGEL_APP_PASSWORD,
        },
      });

      const user = data.data;

      const mailOptions: SendMailOptions = {
        from: "zegelvirtualnoreply@gmail.com",
        to: user.email,
        subject:
          "¡Bienvenido(a) a Despega con Trome y Zegel! Accede a tu curso online ahora",
        html: `
        <p>Estimado(a) ${`${user.names.trim()} ${user.surname.trim()} ${user.secondSurname.trim()}`},</p>
  
        <p>En nombre del equipo de Trome y Zegel, queremos darte la más cordial bienvenida a nuestro programa educativo. Estamos emocionados de tenerte a bordo y confiamos en que tu experiencia de aprendizaje será enriquecedora.</p>
  
        <p>Para comenzar tu curso 100% online, te proporcionamos los detalles de acceso al Campus Virtual:</p>
  
        <ul>
        <li>Enlace de Acceso: <a href="https://campus.zegelvirtual.com/Login">https://campus.zegelvirtual.com/Login</a></li>
        <li>Correo Electrónico: <strong>${user.email}</strong></li>
        <li>Contraseña: <strong>${user.dni}</strong></li>
        </ul>
  
        <p>Por favor, sigue estos pasos para ingresar:</p>
        
        <ol>
        <li>Haz clic en el enlace proporcionado.</li>
        <li>Ingresa tu correo electrónico en el campo correspondiente.</li>
        <li>Utiliza tu DNI como contraseña para acceder al curso.</li>
        </ol>

        <p><strong>Recuerda que tu curso se activará en las próximas 24 horas.</strong></p>

        <p>Este correo electrónico contiene información sensible, por lo que te recomendamos guardarla de manera segura. Si tienes algún problema para acceder o necesitas asistencia técnica, no dudes en contactarnos a <a href="mailto:gestion.proyectos@inlearning.edu.pe">gestion.proyectos@inlearning.edu.pe</a></p>
        
        <p>Recuerda que tienes 30 días para culminar el curso una vez que lo actives.</p>
        
        <p>¡Todos los cursos incluyen certificado!</p>
        
        <p>Estamos comprometidos a brindarte una experiencia educativa de calidad, y estamos aquí para apoyarte en cada paso del camino. ¡Esperamos que disfrutes de tu viaje de aprendizaje con Despega con Trome y Zegel!</p>
        
        <p>¡Gracias por confiar en nosotros!</p>
        
        <p>Saludos,</p>
        <p><strong>Roger</strong></p>
        <p>Jefe de Producto - Educación Ejecutiva</p>
        <p>Despega con Trome y Zegel</p>
        <p><a href="mailto:gestion.proyectos@inlearning.edu.pe">gestion.proyectos@inlearning.edu.pe</a></p>
        `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.error("Error al enviar el correo:", error);
        }
        console.log("Correo enviado:", info.response);
      });

      if (user.department === "Lima Metropolitana") {
        [user.district, user.province] = [user.province, user.district];
      }

      for (const key in user) {
        if (user.hasOwnProperty(key)) {
          let value = "";

          // @ts-ignore
          if (typeof user[key] === "boolean") {
            // @ts-ignore
            value = user[key] ? "Sí" : "No";
          } else {
            // @ts-ignore
            value = user[key];
          }

          formData.append(key, value);
        }
      }

      formData.append("date", new Date().toLocaleString());

      await axios.post(import.meta.env.GOOGLE_SHEET_API, formData);

      return new Response(
        JSON.stringify({
          message: "Correo enviado con éxito.",
          ok: true,
        })
      );
    }

    return new Response(null, {
      status: 400,
      statusText: "Bad request",
    });
  } catch (error) {
    console.log(error);
    return new Response(null, {
      status: 500,
      statusText: "Internal Error",
    });
  }
};
