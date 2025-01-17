/* eslint-disable @typescript-eslint/no-unused-vars */
import * as nodemailer from "nodemailer";
import * as fs from 'fs';
import * as path from 'path';


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

    async sendEmail(emailReceiver: string, nameReceiver: string, order_id: string, data_product?: { name: string, image: string, quantity: number }[]) {

        try {
            if (!this.transporter)
                throw new Error("Transporte no configurado");

            // Crea el contenido dinámico de la lista de productos
            let productHtml = '';
            if (data_product && data_product.length > 0) {
                productHtml = data_product.map(product => `
                    <div class="product-card">
                        <img src="${product.image}" alt="${product.name}">
                        <div class="product-name">${product.name}</div>
                        <div class="product-quantity">Cantidad: ${product.quantity}</div>
                    </div>
                `).join('');
            }

            const mailOptions = {
                from: '"GoDely" <this.userGmail>',
                to: emailReceiver,
                subject: '¡Tu orden ha sido creada exitosamente!',
                html: `
                <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
                <head>
                    <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
                    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                    <meta name="format-detection" content="date=no" />
                    <meta name="format-detection" content="address=no" />
                    <meta name="format-detection" content="telephone=no" />
                    <meta name="x-apple-disable-message-reformatting" />
                    <link href="https://fonts.googleapis.com/css?family=Playfair+Display:400,400i,700,700i" rel="stylesheet" />
                    <title>*|MC:SUBJECT|*</title>
        
                    <style type="text/css" media="screen">
                        body {
                            background: #2c2c2c;
                        }
                        .product-container {
                            width: 100%;
                            padding: 50px 0;
                            display: flex;
                            flex-wrap: wrap;
                            justify-content: center;
                            gap: 20px;
                        }
                        .product-card {
                            background-color: #333;
                            width: 217px;
                            border-radius: 8px;
                            overflow: hidden;
                            text-align: center;
                            font-family: 'Playfair Display', Georgia, serif;
                            margin-left: 20px
                        }
                        .product-card img {
                            width: 100%;
                            height: 181px;
                            object-fit: cover;
                        }
                        .product-name {
                            padding: 10px;
                            font-size: 18px;
                            color: #fff;
                        }
                        .product-quantity {
                            padding: 10px;
                            font-size: 22px;
                            color: #ffd5ab;
                            font-weight: bold;
                        }
                        html {
                            background: #2c2c2c;
                        }
                        body {
                            padding: 0 !important;
                            margin: 0 !important;
                            display: block !important;
                            -webkit-text-size-adjust: none;
                            background: #2c2c2c url("https://res.cloudinary.com/dxttqmyxu/image/upload/v1737092355/ojct1kjlpuqao2tkae2i.jpg");
                            background-repeat: no-repeat repeat-y;
                            background-position: 0 0;
                        }
                        a {
                            color: #e85853;
                            text-decoration: none;
                        }
                        p {
                            padding: 0 !important;
                            margin: 0 !important;
                        }
                        img {
                            -ms-interpolation-mode: bicubic;
                        }
                        .mcnPreviewText {
                            display: none !important;
                        }
                        @media only screen and (max-device-width: 480px),
                        only screen and (max-width: 480px) {
                            .mobile-shell {
                                width: 100% !important;
                                min-width: 100% !important;
                            }
                            .text-header,
                            .m-center {
                                text-align: center !important;
                            }
                            .h0 {
                                height: 0px !important;
                            }
                            .fluid-img img {
                                width: 100% !important;
                                max-width: 100% !important;
                                height: auto !important;
                            }
                        }
                    </style>
                </head>
        
                <body>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center">
                        <tr>
                            <td background="https://res.cloudinary.com/dxttqmyxu/image/upload/v1737092355/ojct1kjlpuqao2tkae2i.jpg" align="center" valign="top">
                                <table width="650" border="0" cellspacing="0" cellpadding="0" class="mobile-shell">
                                    <tr>
                                        <td>
                                            <div mc:repeatable="Select" mc:variant="Article / Image + Title + Text">
                                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                    <tr>
                                                        <td class="fluid-img" style="font-size:0pt; line-height:0pt; text-align:left;">
                                                            <img src="https://res.cloudinary.com/dxttqmyxu/image/upload/v1737090503/mw3dcbwu4s1hzr7yiwhl.png" width="600" height="300" mc:edit="image_2" style="max-width:650px;" border="0" alt="" />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td class="p0-15-30" style="padding: 0px 40px 45px 40px;">
                                                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                                <tr>
                                                                    <td class="h2 pb15" style="color:#ffffff; font-family:'Playfair Display', Georgia, serif; font-size:35px; line-height:46px; text-align:center; font-style:italic; padding-bottom:15px;">
                                                                        <div mc:edit="text_2">¡Gracias por tu compra! Tu orden ha sido creada exitosamente.</div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td class="text" style="color:#a3a3a3; font-family:'Playfair Display', Georgia, serif; font-size:16px; line-height:30px; text-align:center;">
                                                                        <div mc:edit="text_4">Agradecemos tu confianza en nosotros. A continuación, encontrarás los detalles de tu pedido.</div>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </div>
                                            
                                            <div mc:repeatable="Select" mc:variant="Three Columns">
                                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                    <tr>
                                                        <td class="p30-15" style="padding: 50px 0px;" align="center">
                                                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                                <tr>
                                                                    <td align="center" style="padding-bottom: 40px;">
                                                                        <table border="0" cellspacing="0" cellpadding="0">
                                                                            <tr>
                                                                                <td class="img-title" style="font-size:0pt; line-height:0pt; text-align:left;">
                                                                                    <img src="https://res.cloudinary.com/dxttqmyxu/image/upload/v1737093189/rvbiqvyukuxprztvkdb4.png" width="70" height="29" border="0" alt="" />
                                                                                </td>
                                                                                <td class="content-spacing" width="15" style="font-size:0pt; line-height:0pt; text-align:left;"></td>
                                                                                <td class="h2" style="color:#ffffff; font-family:'Playfair Display', Georgia, serif; font-size:35px; line-height:46px; text-align:center; font-style:italic;">
                                                                                    <div mc:edit="text_5">Detalle del pedido</div>
                                                                                </td>
                                                                                <td class="content-spacing" width="15" style="font-size:0pt; line-height:0pt; text-align:left;"></td>
                                                                                <td class="img-title" style="font-size:0pt; line-height:0pt; text-align:left;">
                                                                                    <img src="https://res.cloudinary.com/dxttqmyxu/image/upload/v1737093278/ng6cnbtdpsictbk0aaix.png" width="70" height="29" border="0" alt="" />
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </div>
                                            
                                            <div id="product-list" class="product-container">
                                                ${productHtml}
                                            </div>

                                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                <tr>
                                                    <td class="p30-15" style="padding: 45px 40px;">
                                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                            <tr>
                                                                <td align="center" style="padding-bottom: 40px;">
                                                                    <div mc:edit="text_7">
                                                                        <a href="http://godely.com" target="_blank" style="background-color:#e85853;color:#ffffff; text-decoration:none; font-size:18px; font-weight:bold; padding:15px 25px; display:inline-block; border-radius:5px;">Volver a la tienda</a>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                            
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
                `,
            };

            // Enviar el correo
            const info = await this.transporter.sendMail(mailOptions);
            console.log("Correo enviado:", info.response);
        } catch (error) {
            console.error("Error al enviar el correo:", error);
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