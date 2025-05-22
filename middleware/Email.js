
import { transporter } from "./Email.config.js"
import { Verification_Email_Template } from "./EmailTemplate.js"

export const sendVerificationEamil=async(email,verificationCode)=>{
    try {
     const response= await transporter.sendMail({
            from: '"THREECODE" <bahawallkhann@gmail.com>',

            to: email, // list of receivers
            subject: "Verify your Email", // Subject line
            text: "Verify your Email", // plain text body
            html: Verification_Email_Template.replace("{verificationCode}",verificationCode)
        })
        console.log('Email send Successfully',response)
    } catch (error) {
        console.log('Email error',error)
    }
}
