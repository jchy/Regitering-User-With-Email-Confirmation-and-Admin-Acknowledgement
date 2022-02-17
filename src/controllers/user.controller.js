const express = require('express');
const router = express.Router();

const User= require("../models/user.model");

const protect = require('../middlewares/protect');

router.get('/', protect, async (req, res) => {
    console.log("req.user", await req.user);
    const users = await User.find({}).select('-password').lean().exec();
    return res.status(200).json({ data : users });
})

module.exports = router;