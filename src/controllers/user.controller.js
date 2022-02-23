const express = require('express');
const router = express.Router();

const User= require("../models/user.model");

const protect = require('../middlewares/protect');

router.get('/', protect, async (req, res) => {
    // console.log("req.user", await req.user);
    const per_page = req.query.per_page || 3;
    const page = req.query.page || 1;
    const skip = page < 0 ? 0 : (page - 1)*per_page;
    // (page - 1)*per_page
    const users = await User.find({}).select('-password').skip(skip).limit(per_page);
    return res.status(200).json({ data : users });
})

module.exports = router;