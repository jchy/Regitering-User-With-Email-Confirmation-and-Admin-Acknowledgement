const express = require('express');
const app = express();
const cors = require('cors');
const nodemailer = require('nodemailer');

const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../models/user.model");

const newToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY);
};

var userData;

const signup = async (req, res) => {
  try {
    const user = await User.create(req.body);
    const token = await newToken(user);
    userData = { "email" :req.body.email, "first_name" :req.body.first_name,"last_name" : req.body.last_name, "isAdmin" :req.body.isAdmin};
    userCredential(userData);
    return res.status(201).json({ data: {token} });
  } catch (err) {
    return res.status(500).json({status: "failed", message: "Something went wrong"});
  }
};


//  we will find the user with email that comes in
// then we will try to match the password with the the password stored in the system
// create new token and return it
const signin = async (req, res) => {
    let user;
    try {
        user = await User.findOne({email: req.body.email}).exec();
        if(!user) return res.status(401).json({
            status: "failed", 
            message: "Your password or email is incorrect"
        });
    } catch (error) {
        return res.status(500).json({status: "failed", message: "An error occurred while signing you in"})
    };

    try{
        const match = await user.checkPassword(req.body.password);
        console.log("match", match);
        if(!match) return res.status(401).json({status: "failed", message : "Your password or email is incorrect"}); 
    } 
    catch (error){
        return res.status(500).json({status: "failed", message: "An error occurred while signing you in"}) 
    }
    const token = newToken(user);
    return res.status(201).json({data: {token}})
};


const userCredential = async (userData) => {
  if(userData.isAdmin){
    console.log("Welcome to borad admin")
  }
  else{
        const transporter = nodemailer.createTransport({
          host : "smtp.mailtrap.io",
          auth:{
              user : "8d9fc3e9718584",
              pass : "3781e3f214eb35"
          },
          port: 465,
          secure: false
      });

      let adminArray = [];
      const admins = await User.find({isAdmin: true},{email: 1, _id:0});
      for(let email in admins){
        adminArray.push(admins[email].email);
      }
      // console.log(adminArray);
        const message = {
          from : "admin@mail.com",
          to : `${userData.email}`,
          subject : `Welcome to ABC system ${userData.first_name} ${userData.last_name}`,
          text : `Hi ${userData.first_name}, Please confirm your email address`,
          cc : adminArray
      }

      transporter.sendMail(message,err => {
          if(err){
            console.log(err);
          }
         console.log("successfully send email");
      })
      sendMailToAdmins(userData,adminArray);
  }
} 

const sendMailToAdmins = (userData,adminArray) => {
      const transporter = nodemailer.createTransport({
        host : "smtp.mailtrap.io",
        auth:{
            user : "8d9fc3e9718584",
            pass : "3781e3f214eb35"
        },
        port: 465,
        secure: false
    });

    adminArray.map((admin) => {
          const message = {
            from : "ourCompany@mail.com",
            to : admin,
            subject : `${userData.first_name} ${userData.last_name} has registered with us`,
            text : `Please welcom ${userData.first_name} ${userData.last_name}`
        }

        transporter.sendMail(message,err => {
            if(err){
                console.log(err);
            }
          console.log(`successfully send email to ${admin}`);
        })
    })
}


module.exports = {
  signup,
  signin,
  userCredential
};


