import * as nodemailer from "nodemailer";

const userGmail = "jamalcuent@gmail.com";
const passAppGmail = "aauo ubdh gehy xyjp";

// Configuración del transporte de Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: userGmail,
    pass: passAppGmail,
  },
});

// Configuración de opciones de correo
const mailOptions = {
  from: userGmail,
  to: userGmail,
  subject: "Eres una lacra",
  text: "Eres una mega lacra Jamaaal!",
};

// Envío del correo
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log("Error al enviar correo:", error);
  } else {
    console.log("Correo enviado:", info.response);
  }
});
