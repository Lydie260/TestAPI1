
import User from '../models/db/usermodel';
import validation from '../helpers/validation';
import userModel from '../models/body/user.model';
import authenticate from '../helpers/authenticate';
import  Mongoose  from 'mongoose';
import sendEmail from '../helpers/sendEmail';
import jwt from "jsonwebtoken";
require('dotenv').config();


class UserController{
    static signup(req, res){
        const{error} = validation.registerValidations(userModel.createUser(req));
        
        if(error){
            return res.status(400).json({
                status: 400,
                message: error.details[0].message.replace(/"/g, ''),

            })
        }

        const  { names, email, password} = req.body;
        const lowEmail = email.toLowerCase();
        User.find({email:lowEmail},(error,result) =>{
            if(result.length){
                return res.status(409).json({
                    message: 'email is already used, please use another',
                })
            }
            const hashedPaword = authenticate.hashPassword(password);
            const user = new User({
                _id: new Mongoose.Types.ObjectId(),
                names: names,
                email: lowEmail,
                password: hashedPaword,
                status:'active'
            });
            user
            .save()
            .then(()=>{
                res.status(201).json({
                    message: 'wowww, account has been created',
                    status: 201,
                });
                const mailOptions = {
                    from: process.env.EMAIL,
                    to: lowEmail,
                    subject: "confirm your email",
                    html:`<!DOCTYPE html>
                    <html lang="en">
                    
                    <head>
                      <meta charset="UTF-8" />
                      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
                      <title>Verify Your Account</title>
                      <style>
                        body {
                          background: #f2f2f2;
                          border: blue;
                        }
                    
                        section {
                          font-family: proxima-nova, sans-serif;
                          margin: auto;
                          width: 60%;
                        }
                    
                        .small_text {
                          font-size: 16px;
                          margin-top: 30px;
                          color: #424242;
                        }
                    
                        .body_par {
                          color: #333;
                        }
                    
                        .login_body li {
                          list-style: none;
                        }
                    
                        .login_body li {
                          color: #333;
                        }
                    
                        a {
                          text-decoration: none;
                        }
                    
                        .footer_text {
                          font-size: 15px;
                          margin-top: 20px;
                          color: #333;
                        }
                    
                        footer {
                          margin-top: 35px;
                          color: #222;
                          font-size: 15px;
                          margin-bottom: 25px;
                        }
                    
                        footer p {
                          line-height: 1.7;
                        }
                    
                        .logo_img {
                          width: 200px;
                          height: 200px;
                        }
                        .logo_div {
                          margin: auto;
                        }
                        
                    
                        .verify_button {
                          background-color:  #ffc107;
                          color: #ffffff;
                          padding: 5px 20px;
                          font-size: 16px;
                          border-radius: 10px;
                          font-weight: bold;
                          text-transform: capitalize;
                          text-align: center;
                        }
                    
                        @media screen and (max-width: 812px) {
                          section {
                            width: 95%;
                          }
                    
                          .small_text {
                            font-size: 14px;
                            margin-top: 40px;
                          }
                    
                          .footer_text {
                            font-size: 13px;
                          }
                    
                          .tuner_logo {
                            height: 280px;
                          }
                    
                          .tuner_logo img {
                            margin-top: 70px;
                            width: 200px;
                          }
                    
                        }
                      </style>
                    </head>
                    
                    <body>
                      <section>
                        <h2>Account Information</h2>
                        <div class="small_text">
                          <p>
                            <strong>Dear ${ names },</strong>
                          </p>
                        </div>
                        <div class="body_par">
                          <p>
                            Your account on <b>Lydie app</b> Was successfully created. 
                          </p>
                        </div>
                        <div class="login_body">
                          <h4>Your Account Info.</h4>
                          <br>
                            <b>Email: </b><span class="info_text">${email}</span><br/>
                            <b>username: </b><span class="info_text">${names}</span>
                          </li>
                        </div>
                        <p class="footer_text">
                          If you encounter any problem, please don't hesitate to CONTACT US at
                          <span style="color:#424242"><a href="mailto:gatarelydie370@gmail.com">gatarelydie370@gmail.com</a></span>
                        </p>
                        <footer>
                          <p>
                            <span>Kigali, Rwanda</span><br />
                          </p>
                          &copy; Lydie app - All Rights Reserved.
                        </footer>
                      </section>
                    </body>
                    
                    </html>`
                };
                sendEmail(mailOptions)
            }).catch(err =>{
                res.status(500).json({
                    message: 'ohh no there is something wrong, check your internet or call support',
                    status: 500
                });
            })
        })
        

    }
    static signin(req, res){
    const {email, password} = req.body;
    const lowEmail = email.toLowerCase();
    
    const { error } = validation.loginValidation(userModel.loginUser(req));

    if(error){
        return res.status(400).json({
            status: 400,
            message: error.details[0].message.replace(/"/g, ''),

        })
    }

    User.find({email:lowEmail},(error,result)=>{
        if (result.length){
            const compared = authenticate.comparePassword(password, result[0].password)
            if(compared){
                res.status(200).json({
                    message: 'Log in successfull',
                    status: 200,
                    token: authenticate.generateToken(result[0])

                });
            }else{
                res.status(400).json({
                    message:'incorrect email or password ',
                    status: 403,
                });
            }
        }else{
            res.status(400).json({
                message: 'incorrect email or password',
                status: 403,
            });
        }
    });
    }

static forgetPassword=(req, res)=>{
    try{
        const {email}=req.body;
        User.findOne({email},(err,user)=>{
            if(err || !user){
                return res.status(400).json({error:"user of this email does not exist"})
            }
            const token =jwt.sign({_id: user._id},process.env.RESET_PASSWORD_ID,{expiresIn:'20m'});
            req.token = token
            req.user = user

            const mailOptions = {
                from:process.env.EMAIL,
                to: email,
                subject: 'Account activation link',
                html: `<h2> please click on given link to reset your password <h2>
                <a href="http://localhost:3001/Resetpassword/${token}">Click here to reset Password<a>`
            };
            const userData={
                user,
                resetLink:token
            }
return User.updateOne({_id: user._id},userData,(err,success)=>{
    if(err){
        return res.status(400).json({error:err})
    }else{
        sendEmail(mailOptions);
        if(err){
            return res.json({
                message: "error"
            })

        }
        return res.json({
            message: 'Email has been sent, kindly follow the instructions',userData
        });
    }
})
        })
    }catch (error){

    }
}
static resetPassword=(req, res)=>{
    const {resetLink,newPassword}=req.body;
    if(resetLink){
        jwt.verify(resetLink,process.env.RESET_PASSWORD_ID,function(error,decodedToken){
            if(error){
                return res.json({
                    error:"incorect token or it is expired"
                })
            }
            User.findOneAndUpdate({resetLink},{password: newPassword},(error, user)=>{
                if(error || !user){
                    return res.status(400).json({error:'user of this token does not exist'})
                }
                res.status(201).json({
                    message: 'password has been reset successful'
                })
            })
        })
    }
    else {
        return res.status(400).json({error: 'Authentication error '})
    }
}
}


export default UserController;
