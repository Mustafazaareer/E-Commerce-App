// eslint-disable-next-line import/no-extraneous-dependencies
const nodemailer = require('nodemailer');

const sendEmail =async (options)=>{
    //1) Create Transporter (service will send email like "gmail","mailgun","mailtrap","sendGrid")
    const transporter =nodemailer.createTransport({
        host:process.env.EMAIL_HOST,
        port:process.env.EMAIL_PORT, //if secure false port = 587, if true port = 465 
        secure:true,
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASSWORD
        }
    })
    //2) Define email opations like (from ,to ,content ,subject ,text)
    const mailOpts ={
        from:'E-shop App <191047@ppu.edu.ps>',
        to:options.email,
        subject:options.subject,
        text:options.message
    };
    //3) Send email 

    await transporter.sendMail(mailOpts);

};

module.exports=sendEmail;