/* eslint-disable @typescript-eslint/no-unused-vars */
import * as nodemailer from "nodemailer";

import { IEmailSender } from "src/common/application/email-sender/email-sender.interface.application"

export class NodemailerEmailSender implements IEmailSender {
    private userGmail = "godely.inf@gmail.com";
    private passAppGmail = "thee ojdl caau ogbm";//"aauo ubdh gehy xyjp";
    private senderName = "GoDely"
    private transporter = null

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: this.userGmail,
                pass: this.passAppGmail,
                name: this.senderName
            },
        });
    }

    async sendEmail(emailReceiver: string, nameReceiver: string, order_id: string) {

        try {

            if (!this.transporter)
                throw new Error("Transporte no configurado")

            const mailOptions = {
                from: '"GoDely" <this.userGmail>',
                to: emailReceiver,
                subject: '¡Tu orden ha sido creada exitosamente!',
                html: `
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Confirmación de Orden</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                            color: #333;
                        }
                        .container {
                            width: 100%;
                            max-width: 600px;
                            margin: 20px auto;
                            background-color: #fff;
                            padding: 20px;
                            border-radius: 5px;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        }
                        .logo {
                            text-align: center;
                            margin-bottom: 10px;
                        }
                        .logo img {
                            width: 80%;
                        }
                        .header {
                            background-color: #F77523;
                            padding: 20px;
                            text-align: center;
                            color: #fff;
                            border-radius: 5px 5px 0 0;
                        }
                        .header h1 {
                            margin: 0;
                        }
                        .content {
                            padding: 20px;
                            text-align: center;
                        }
                        .content p {
                            font-size: 16px;
                            line-height: 1.5;
                            color: #666;
                        }
                        .order-id {
                            font-size: 24px;
                            font-weight: bold;
                            color: #333;
                        }
                        .footer {
                            text-align: center;
                            font-size: 12px;
                            color: #999;
                            margin-top: 20px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="logo"> 
                            <img src="https://res.cloudinary.com/dxttqmyxu/image/upload/v1731617091/nwgc64gwc22rypvbq2vj.jpg" alt="GoDely Logo"  height="50">
                        </div>
                        <div class="header">
                            <h1>Confirmación de tu Orden</h1>
                        </div>
                        <div class="content">
                            <p>¡Gracias por tu compra! Tu orden ha sido creada exitosamente.</p>
                            <p class="order-id">Número de orden: #${order_id}</p>
                            <p>En breve recibirás un correo adicional con los detalles de tu envío y seguimiento.</p>
                        </div>
                        <div class="footer">
                            <p>GoDely, el mejor servicio de delivery del país 😉.</p>
                        </div>
                    </div>
                </body>
                </html>
                `
            };

            this.transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log("Error al enviar correo:", error);
                } else {
                    console.log("Correo enviado:", info.response);
                }
            });

        } catch (error) {

        }

    }


    async sendWelcomeEmail(emailReceiver: string, nameReceiver: string, user_id: string) {

        try {

            if (!this.transporter)
                throw new Error("Transporte no configurado")

            const mailOptions = {
                from: '"GoDely" <this.userGmail>',
                to: emailReceiver,
                subject: '¡Te damos la bienvenida al sistema GoDely!',
                html: `
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Bienvenido a GoDely</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                            color: #333;
                        }
                        .container {
                            width: 100%;
                            max-width: 600px;
                            margin: 20px auto;
                            background-color: #fff;
                            padding: 20px;
                            border-radius: 5px;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        }
                        .logo {
                            text-align: center;
                            margin-bottom: 10px;
                        }
                        .logo img {
                            width: 80%;
                        }
                        .header {
                            background-color: #F77523;
                            padding: 20px;
                            text-align: center;
                            color: #fff;
                            border-radius: 5px 5px 0 0;
                        }
                        .header h1 {
                            margin: 0;
                        }
                        .content {
                            padding: 20px;
                            text-align: center;
                        }
                        .content p {
                            font-size: 16px;
                            line-height: 1.5;
                            color: #666;
                        }
                        .order-id {
                            font-size: 24px;
                            font-weight: bold;
                            color: #333;
                        }
                        .footer {
                            text-align: center;
                            font-size: 12px;
                            color: #999;
                            margin-top: 20px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="logo"> 
                            <img src="https://res.cloudinary.com/dxttqmyxu/image/upload/v1731617091/nwgc64gwc22rypvbq2vj.jpg" alt="GoDely Logo"  height="50">
                        </div>
                        <div class="header">
                            <h1>Confirmación de tu Registro</h1>
                        </div>
                        <div class="content">
                            <p>¡Gracias por tu registrarte! Te has registrado con los siguientes datos.</p>
                            <p class="order-id">Id Usuario: #${user_id}</p>
                            <p>Estamos emocionados que formes parte del sistema GoDely.</p>
                        </div>
                        <div class="footer">
                            <p>GoDely, el mejor servicio de delivery del país 😉.</p>
                        </div>
                    </div>
                </body>
                </html>
                `
            };

            this.transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log("Error al enviar correo:", error);
                } else {
                    console.log("Correo enviado:", info.response);
                }
            });

        } catch (error) {

        }

    }

    async sendCode(emailReceiver: string, nameReceiver: string, code: string) {

        try {

            if (!this.transporter)
                throw new Error("Transporte no configurado")

            const mailOptions = {
                from: '"GoDely" <this.userGmail>',
                to: emailReceiver,
                subject: 'Código de verificación',
                html: `
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Tu código de confirmación</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                            color: #333;
                        }
                        .container {
                            width: 100%;
                            max-width: 600px;
                            margin: 20px auto;
                            background-color: #fff;
                            padding: 20px;
                            border-radius: 5px;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        }
                        .logo {
                            text-align: center;
                            margin-bottom: 10px;
                        }
                        .logo img {
                            width: 80%;
                        }
                        .header {
                            background-color: #F77523;
                            padding: 20px;
                            text-align: center;
                            color: #fff;
                            border-radius: 5px 5px 0 0;
                        }
                        .header h1 {
                            margin: 0;
                        }
                        .content {
                            padding: 20px;
                            text-align: center;
                        }
                        .content p {
                            font-size: 16px;
                            line-height: 1.5;
                            color: #666;
                        }
                        .order-id {
                            font-size: 24px;
                            font-weight: bold;
                            color: #333;
                        }
                        .footer {
                            text-align: center;
                            font-size: 12px;
                            color: #999;
                            margin-top: 20px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="logo"> 
                            <img src="https://res.cloudinary.com/dxttqmyxu/image/upload/v1731617091/nwgc64gwc22rypvbq2vj.jpg" alt="GoDely Logo"  height="50">
                        </div>
                        <div class="header">
                            <h1>Código de confirmación de identidad</h1>
                        </div>
                        <div class="content">
                            <p>Ingresa el siguiente código de confirmación para verificar tu identidad.</p>
                            <p class="order-id">Código: #${code}</p>
                            <p>En caso de que se trate de un error, omita este mensaje.</p>
                        </div>
                        <div class="footer">
                            <p>GoDely, el mejor servicio de delivery del país 😉.</p>
                        </div>
                    </div>
                </body>
                </html>
                `
            };

            this.transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log("Error al enviar correo:", error);
                } else {
                    console.log("Correo enviado:", info.response);
                }
            });

        } catch (error) {

        }

    }

    async sendCharge(emailReceiver: string, nameReceiver: string, id_orden: string, charge: string) {

        try {

            if (!this.transporter)
                throw new Error("Transporte no configurado")

            const mailOptions = {
                from: '"GoDely" <this.userGmail>',
                to: emailReceiver,
                subject: 'La orden ha sido pagada exitosamente!',
                html: `
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Recibo de Orden</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                            color: #333;
                        }
                        .container {
                            width: 100%;
                            max-width: 600px;
                            margin: 20px auto;
                            background-color: #fff;
                            padding: 20px;
                            border-radius: 5px;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        }
                        .logo {
                            text-align: center;
                            margin-bottom: 10px;
                        }
                        .logo img {
                            width: 80%;
                        }
                        .header {
                            background-color: #F77523;
                            padding: 20px;
                            text-align: center;
                            color: #fff;
                            border-radius: 5px 5px 0 0;
                        }
                        .header h1 {
                            margin: 0;
                        }
                        .content {
                            padding: 20px;
                            text-align: center;
                        }
                        .content p {
                            font-size: 16px;
                            line-height: 1.5;
                            color: #666;
                        }
                        .order-id {
                            font-size: 24px;
                            font-weight: bold;
                            color: #333;
                        }
                        .footer {
                            text-align: center;
                            font-size: 12px;
                            color: #999;
                            margin-top: 20px;
                        }
                        .receipt-link {
                            margin-top: 20px;
                            font-size: 16px;
                            color: #333;
                        }
                        .receipt-link a {
                            color: #F77523;
                            text-decoration: none;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="logo">
                            <img src="https://res.cloudinary.com/dxttqmyxu/image/upload/v1731617091/nwgc64gwc22rypvbq2vj.jpg" alt="GoDely Logo" height="50">
                        </div>
                        <div class="header">
                            <h1>Recibo de tu Orden #${id_orden}</h1>
                        </div>
                        <div class="content">
                            <p>Tu orden ha sido pagada exitosamente.</p>

                            <!-- Enlace al recibo PDF de Stripe -->
                            <div class="receipt-link">
                                <p>Puedes ver tu recibo de pago aquí:</p>
                                <a href="${charge}" target="_blank">Ver recibo de pago</a>
                            </div>
                        </div>
                        <div class="footer">
                            <p>GoDely, el mejor servicio de delivery del país 😉.</p>
                        </div>
                    </div>
                </body>
                </html>
                `
            };

            this.transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log("Error al enviar correo:", error);
                } else {
                    console.log("Correo enviado:", info.response);
                }
            });

        } catch (error) {

        }

    }

    async sendChargeRefund(emailReceiver: string, nameReceiver: string, id_orden: string, charge: string) {

        try {

            if (!this.transporter)
                throw new Error("Transporte no configurado")

            const mailOptions = {
                from: '"GoDely" <this.userGmail>',
                to: emailReceiver,
                subject: 'La orden ha sido reembolsada exitosamente!',
                html: `
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Recibo del reembolso de la Orden</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                            color: #333;
                        }
                        .container {
                            width: 100%;
                            max-width: 600px;
                            margin: 20px auto;
                            background-color: #fff;
                            padding: 20px;
                            border-radius: 5px;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        }
                        .logo {
                            text-align: center;
                            margin-bottom: 10px;
                        }
                        .logo img {
                            width: 80%;
                        }
                        .header {
                            background-color: #F77523;
                            padding: 20px;
                            text-align: center;
                            color: #fff;
                            border-radius: 5px 5px 0 0;
                        }
                        .header h1 {
                            margin: 0;
                        }
                        .content {
                            padding: 20px;
                            text-align: center;
                        }
                        .content p {
                            font-size: 16px;
                            line-height: 1.5;
                            color: #666;
                        }
                        .order-id {
                            font-size: 24px;
                            font-weight: bold;
                            color: #333;
                        }
                        .footer {
                            text-align: center;
                            font-size: 12px;
                            color: #999;
                            margin-top: 20px;
                        }
                        .receipt-link {
                            margin-top: 20px;
                            font-size: 16px;
                            color: #333;
                        }
                        .receipt-link a {
                            color: #F77523;
                            text-decoration: none;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="logo">
                            <img src="https://res.cloudinary.com/dxttqmyxu/image/upload/v1731617091/nwgc64gwc22rypvbq2vj.jpg" alt="GoDely Logo" height="50">
                        </div>
                        <div class="header">
                            <h1>Reembolso de la Orden #${id_orden}</h1>
                        </div>
                        <div class="content">
                            <p>Tu orden ha sido reembolsada exitosamente.</p>

                            <!-- Enlace al recibo PDF de Stripe -->
                            <div class="receipt-link">
                                <p>Puedes ver tu recibo de reembolso aquí:</p>
                                <a href="${charge}" target="_blank">Ver recibo de reembolso</a>
                            </div>
                        </div>
                        <div class="footer">
                            <p>GoDely, el mejor servicio de delivery del país 😉.</p>
                        </div>
                    </div>
                </body>
                </html>
                `
            };

            this.transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log("Error al enviar correo:", error);
                } else {
                    console.log("Correo enviado:", info.response);
                }
            });

        } catch (error) {

        }

    }


}