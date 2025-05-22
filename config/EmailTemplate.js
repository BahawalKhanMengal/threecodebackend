import nodemailer from "nodemailer";

export const sendEmailtoUser = (link, email) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: `Verify Your Email`,
    text: `
<!doctype html>
<html lang="en-US">

<head>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <title>Verify Your Email</title>
    <meta name="description" content="Verify Your Email">
    <style type="text/css">
        a:hover {text-decoration: underline !important;}
    </style>
</head>

<body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
    <!--100% body table-->
    <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
        style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
        <tr>
            <td>
                <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                    align="center" cellpadding="0" cellspacing="0">
                    
                    <tr>
                        <td>
                            <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="padding:0 35px;">
                                        <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
                                            requested to Verify Your Email</h1>
                                        <span
                                            style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                        <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                            Click below Link and Verify your EMail.
                                        </p>
                                        <a href=${link}
                                            style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Verify Email</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                            </table>
                        </td>
                   
                </table>
            </td>
        </tr>
    </table>
    <!--/100% body table-->
</body>

</html>`,
    html: `
<!doctype html>
<html lang="en-US">

<head>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <title>Reset Password Email Template</title>
    <meta name="description" content="Reset Password Email Template.">
    <style type="text/css">
        a:hover {text-decoration: underline !important;}
    </style>
</head>

<body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
    <!--100% body table-->
    <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
        style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
        <tr>
            <td>
                <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                    align="center" cellpadding="0" cellspacing="0">
                   
                    <tr>
                        <td>
                            <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="padding:0 35px;">
                                        <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
                                            requested to Verify Your Email</h1>
                                        <span
                                            style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                        <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                            Click below Link and Verify your EMail..
                                        </p>
                                        <a href="${link}"
                                            style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Verify Email</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                            </table>
                        </td>
                   
                </table>
            </td>
        </tr>
    </table>
    <!--/100% body table-->
</body>

</html>`,
  };

  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(400).json({ message: "Error" });
    }
    return res.status(200).json({ message: "Email Sent" });
  });
};












// export const Verification_Email_Template = `
//   <!DOCTYPE html>
//   <html lang="en">
//   <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>Verify Your Email</title>
//       <style>
//           body {
//               font-family: Arial, sans-serif;
//               margin: 0;
//               padding: 0;
//               background-color: #f4f4f4;
//           }
//           .container {
//               max-width: 600px;
//               margin: 30px auto;
//               background: #ffffff;
//               border-radius: 8px;
//               box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
//               overflow: hidden;
//               border: 1px solid #ddd;
//           }
//           .header {
//               background-color: #4CAF50;
//               color: white;
//               padding: 20px;
//               text-align: center;
//               font-size: 26px;
//               font-weight: bold;
//           }
//           .content {
//               padding: 25px;
//               color: #333;
//               line-height: 1.8;
//           }
//           .verification-code {
//               display: block;
//               margin: 20px 0;
//               font-size: 22px;
//               color: #4CAF50;
//               background: #e8f5e9;
//               border: 1px dashed #4CAF50;
//               padding: 10px;
//               text-align: center;
//               border-radius: 5px;
//               font-weight: bold;
//               letter-spacing: 2px;
//           }
//           .footer {
//               background-color: #f4f4f4;
//               padding: 15px;
//               text-align: center;
//               color: #777;
//               font-size: 12px;
//               border-top: 1px solid #ddd;
//           }
//           p {
//               margin: 0 0 15px;
//           }
//       </style>
//   </head>
//   <body>
//       <div class="container">
//           <div class="header">Verify Your Email</div>
//           <div class="content">
//               <p>Hello,</p>
//               <p>Thank you for signing up! Please confirm your email address by entering the code below:</p>
//               <span class="verification-code">{verificationCode}</span>
//               <p>If you did not create an account, no further action is required. If you have any questions, feel free to contact our support team.</p>
//           </div>
//           <div class="footer">
//               <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
//           </div>
//       </div>
//   </body>
//   </html>
// `;




// export const Welcome_Email_Template = `
//   <!DOCTYPE html>
//   <html lang="en">
//   <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>Welcome to Our Community</title>
//       <style>
//           body {
//               font-family: Arial, sans-serif;
//               margin: 0;
//               padding: 0;
//               background-color: #f4f4f4;
//               color: #333;
//           }
//           .container {
//               max-width: 600px;
//               margin: 30px auto;
//               background: #ffffff;
//               border-radius: 8px;
//               box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
//               overflow: hidden;
//               border: 1px solid #ddd;
//           }
//           .header {
//               background-color: #007BFF;
//               color: white;
//               padding: 20px;
//               text-align: center;
//               font-size: 26px;
//               font-weight: bold;
//           }
//           .content {
//               padding: 25px;
//               line-height: 1.8;
//           }
//           .welcome-message {
//               font-size: 18px;
//               margin: 20px 0;
//           }
//           .button {
//               display: inline-block;
//               padding: 12px 25px;
//               margin: 20px 0;
//               background-color: #007BFF;
//               color: white;
//               text-decoration: none;
//               border-radius: 5px;
//               text-align: center;
//               font-size: 16px;
//               font-weight: bold;
//               transition: background-color 0.3s;
//           }
//           .button:hover {
//               background-color: #0056b3;
//           }
//           .footer {
//               background-color: #f4f4f4;
//               padding: 15px;
//               text-align: center;
//               color: #777;
//               font-size: 12px;
//               border-top: 1px solid #ddd;
//           }
//           p {
//               margin: 0 0 15px;
//           }
//       </style>
//   </head>
//   <body>
//       <div class="container">
//           <div class="header">Welcome to Our Community!</div>
//           <div class="content">
//               <p class="welcome-message">Hello {name},</p>
//               <p>We’re thrilled to have you join us! Your registration was successful, and we’re committed to providing you with the best experience possible.</p>
//               <p>Here’s how you can get started:</p>
//               <ul>
//                   <li>Explore our features and customize your experience.</li>
//                   <li>Stay informed by checking out our blog for the latest updates and tips.</li>
//                   <li>Reach out to our support team if you have any questions or need assistance.</li>
//               </ul>
//               <a href="#" class="button">Get Started</a>
//               <p>If you need any help, don’t hesitate to contact us. We’re here to support you every step of the way.</p>
//           </div>
//           <div class="footer">
//               <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
//           </div>
//       </div>
//   </body>
//   </html>
// `;