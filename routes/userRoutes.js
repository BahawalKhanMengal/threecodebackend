const express = require('express');
const User = require('../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./authMiddleware');
const { sendEmailtoUser } = require('../config/EmailTemplate');
const Feedback = require('../models/Feedback')
// import nodemailer from "nodemailer";
const nodemailer = require('nodemailer')
const router = express.Router();
const secretKey = "kajdsfafkgfaka344*(&^&^%^^*&(*(&";

// ----------------- REGISTER -------------------
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ status: false, message: "All fields are required!" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ status: false, message: "Passwords do not match" });
    }
    // ✅ Add manual password length validation before hashing
    if (password.length < 8) {
      return res.status(400).json({ status: false, message: "Password must be at least 8 characters long" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ status: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isVerified: false
    });

    await newUser.save();

    const token = jwt.sign({ email: newUser.email }, secretKey, { expiresIn: '5m' });
    const link = `https://threecode.onrender.com/user/verify/${token}`;

    await sendEmailtoUser(link, email);

    return res.status(200).json({
      status: true,
      message: "Registered successfully. Please check your email to verify your account."
    });

  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    console.error(error);
    res.status(500).json({ status: false, message: "Server error", error: error.message });
  }
});

// ----------------- VERIFY EMAIL -------------------
router.get('/verify/:token', async (req, res) => {
  const { token } = req.params;
  try {
    if (!token) {
      return res.status(400).json({ message: "Invalid URL" });
    }

    const decoded = jwt.verify(token, secretKey);
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(200).json({ message: "Email is already verified" });
    }

    user.isVerified = true;
    await user.save();

    return res.status(200).json({ message: "Email verified successfully" });

  } catch (error) {
    return res.status(400).json({ message: "Link expired or invalid", error: error.message });
  }
});

// ----------------- LOGIN -------------------
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: false, message: "All fields are required!" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ status: false, message: "User not found" });
    }

    if (!user.isVerified) {
      return res.status(401).json({ status: false, message: "Email verification pending. Please check your inbox." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ status: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, secretKey, { expiresIn: "2d" });

    return res.status(200).json({
      status: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message
    });
  }
});

// ----------------- Forgot Password -------------------

router.post('/forgotpassword', async (req, res) => {
  const { email } = req.body;
  try {
    if (email) {
      const isUser = await User.findOne({ email: email })
      if (isUser) {
        const secretKey = isUser._id + "kajdsfafkgfaka344*(&^&^%^^*&(*(&"; 
        const token = jwt.sign({userID:isUser._id},secretKey,{expiresIn:"5m"})
        const link = `http://localhost:5179/forgotpassword/${isUser._id}/${token}`; 
          const transport = nodemailer.createTransport ({
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
            subject: `Password Reset Request`,
            text: `
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
                                            requested to reset your password</h1>
                                        <span
                                            style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                        <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                            We cannot simply send you your old password. A unique link to reset your
                                            password has been generated for you. To reset your password, click the
                                            following link and follow the instructions.
                                        </p>
                                        <a href=${link}
                                            style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset
                                            Password</a>
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
                                            requested to reset your password</h1>
                                        <span
                                            style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                        <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                            We cannot simply send you your old password. A unique link to reset your
                                            password has been generated for you. To reset your password, click the
                                            following link and follow the instructions.
                                        </p>
                                        <a href="${link}"
                                            style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset
                                            Password</a>
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

      } else {
        return res.status(400).json({ message: "Invalid Email" })
      }
    } else {
      return res.status(400).json({ message: "Email Is Required" })
    }
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
})

// _____________________ Change Password ______________

// router.post('/forgotpassword/:id/:token', async (req, res) => {
//   const { newPassword, confirmPassword } = req.body;
//   const { id, token } = req.params;

//   try {
//     if (!newPassword || !confirmPassword) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     if (newPassword !== confirmPassword) {
//       return res.status(400).json({ message: "Passwords do not match" });
//     }

//     if (newPassword.length < 8) {
//       return res.status(400).json({ message: "Password must be at least 8 characters long" });
//     }

//     const user = await User.findById(id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const secretKey = user._id + "kajdsfafkgfaka344*(&^&^%^^*&(*(&";
//     const decoded = jwt.verify(token, secretKey);

//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     await User.findByIdAndUpdate(user._id, { $set: { password: hashedPassword } });

//     return res.status(200).json({ message: "Password changed successfully" });

//   } catch (error) {
//     return res.status(400).json({
//       message: "Link expired or invalid",
//       error: error.message
//     });
//   }
// });
router.post('/forgotpassword/:id/:token', async (req, res) => {
  const { newPassword, confirmPassword } = req.body;
  const { id, token } = req.params;

  try {
      if (!newPassword || !confirmPassword) {
          return res.status(400).json({ message: "All fields are required" });
      }

      if (newPassword !== confirmPassword) {
          return res.status(400).json({ message: "Passwords do not match" });
      }

      if (newPassword.length < 8) {
          return res.status(400).json({ message: "Password must be at least 8 characters long" });
      }

      const user = await User.findById(id);
      if (!user) return res.status(404).json({ message: "User not found" });

      const secretKey = user._id + "kajdsfafkgfaka344*(&^&^%^^*&(*(&";
      const decoded = jwt.verify(token, secretKey);

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await User.findByIdAndUpdate(user._id, { $set: { password: hashedPassword } });

      return res.status(200).json({ message: "Password changed successfully" });

  } catch (error) {
      return res.status(400).json({
          message: "Link expired or invalid",
          error: error.message
      });
  }
});




// profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    res.status(200).json({ status: true, message: "Profile data", data: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// contact us
router.post('/contact', authMiddleware, async (req, res) => {
  const { firstname, lastname, textarea, email } = req.body;

  try {
    if (!firstname || !lastname || !textarea || !email) {
      return res.status(400).json({ status: false, message: "All fields are required" });
    }

    const newFeedback = new Feedback({
      firstname,
      lastname,
      message: textarea,
      email
    });

    await newFeedback.save();
    res.status(200).json({ status: true, message: "Feedback submitted successfully" });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ status: false, message: "Server error", error: error.message });
  }
});
// Create Room (Only Logged-in Users)
router.post("/create-room", authMiddleware, (req, res) => {
  try {
    const roomId = Math.random().toString(36).substring(2, 10); // Generate unique room ID
    res.status(200).json({ status: true, message: "Room created", roomId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;

