const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const createError = require('http-errors')
const { User } = require("../models/user");
const dotenv = require('dotenv');

dotenv.config()
const { SECRET_KEY } = process.env;

const signup = async (req, res) => {
 const {email, password} = req.body;
    const user = await User.findOne({email});
    if(user) {
        throw createError(409, "Email in use", {status: "Conflict"})
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({...req.body, password: hashPassword});

    res.status(201).json({
        name: newUser.name,
        email: newUser.email,
    })
}

const login = async(req, res)=> {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user){
        throw createError(401, "Email or password is wrong", {status: "Unauthorized"}); 
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare) {
        throw createError(401, "Email or password is wrong", {status: "Unauthorized"}); 
    }

    const payload = {
        id: user._id,
    }

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" })
    await User.findByIdAndUpdate(user._id, {token});


    
     res.json({
        token, 
       subscription: user.subscription,
        email: user.email,
    })

}

const getCurrent = async (req, res) => {
    try {
const {email, subscription} = req.user;

     res.status(200).json({
         status: "OK",
         email,
         subscription
    })
    } catch (err) {
        console.log(err);
    }
    
}

const logout = async(req, res)=> {
    const { _id } = req.user;
    
    await User.findByIdAndUpdate(_id, {token: ""});

    res.status(204).json({
        message: "No Content",
    })
}

module.exports = {
signup, login, getCurrent, logout
}