import sgMail from '@sendgrid/mail'
require ('dotenv').config();
import path from 'path'
import ejs from 'ejs'

sgMail.setApiKey('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')



const sendEmail = async (mailOptions) =>{
    
    sgMail
    .send(mailOptions)
    .then(()=>{
        console.log('email sent')
    })
    .catch((error) =>{
        console.error(error)
    })
}
export default sendEmail
