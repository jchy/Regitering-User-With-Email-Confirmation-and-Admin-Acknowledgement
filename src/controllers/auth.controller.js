const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../models/user.model");

const newToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY);
};

const signup = async (req, res) => {
  try {
    const user = await User.create(req.body);
    const token = await newToken(user);
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

module.exports = {
  signup,
  signin,
};
