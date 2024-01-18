import type { APIRoute } from "astro";
import nodemailer from "nodemailer";

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

    const mailOptions = {
      from: "zegelvirtualnoreply@gmail.com",
      to: form.email,
      subject: "Prueba de envio de correo",
      text: `Correo: ${form.email}, Contraseña: ${form.dni}`,
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
