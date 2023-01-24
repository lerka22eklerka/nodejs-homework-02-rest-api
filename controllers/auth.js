const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const createError = require('http-errors')
const gravatar = require("gravatar")
const { v4: uuidv4 } = require('uuid');
const jimp = require("jimp")
const fs = require("fs/promises");
const path = require("path")
const { User } = require("../models/user");
const dotenv = require('dotenv');
const sgMail = require("@sendgrid/mail");


const {SENDGRID_API_KEY, BASE_URL} = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

dotenv.config()
const { SECRET_KEY } = process.env;

const signup = async (req, res) => {
 const {email, password} = req.body;
    const user = await User.findOne({email});
    if(user) {
        throw createError(409, "Email in use", {status: "Conflict"})
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationToken = uuidv4();

    const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL, verificationToken });
    
     const verifyEmail = {
         to: email,
         from: "lerka22eklerka@gmail.com",
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click verify email</a>`
    }
     await sgMail.send(verifyEmail);

    res.status(201).json({
        email: newUser.email,
    })
}



const login = async(req, res)=> {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user){
        throw createError(401, "Email or password is wrong", {status: "Unauthorized"}); 
    }

    if(!user.verify){
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

// const verify = async(req, res)=> {
//     const {verificationToken} = req.params;
//     const user = await User.findOne({verificationToken});
//     if(!user) {
//         throw createError(404, "User not found", {status: "Not found"})
//     }

//     await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: null});

//     res.status(200).json({
//         message: "Verification successful"
//     })
// }

const verify = async(req, res)=> {
    const {verificationToken} = req.params;
    const user = await User.findOne({verificationToken});
    if(!user) {
        throw createError(404, "User not found", {status: "Not found"})
    }

    await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: null});

    res.status(200).json({
        message: "Verification successful"
    })
}

const reVerification = async (req, res) => { 
    const {verificationToken, email} = req.params;
  const user = User.findOne({ email, verify: false });
  if (!user) {
    throw createError(400, "Verification has already been passed", {status: "Bad Request"})
  }
  const verifyEmail = {
  to: email, 
  from: 'lerka22eklerka@gmail.com',
  subject: "Verify email",
  html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click verify email</a>`,
}
  await sgMail.send(verifyEmail);
}

const reSendingEmail = async (req, res, next) => {
    const { error } = verifySchema.validate(req.body)
    const { email } = req.body;
    if (error) {
        return res.status(400).json({
            status: "Bad Request",
            ResponseBody: {
                message: "missing required field email"
            }
        });
    }
    try {
        await reVerification(email)
        res.status(200).json({
            status: "OK",
            ResponseBody: {
                message: 'Verification email sent'
            }
        })
    } catch (error) {
        next(error)
    }
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

const avatarsDir = path.join(__dirname, "../", "public", "avatars");
const updateAvatar = async(req, res)=> {
    const {_id} = req.user;
    const { path: tempUpload, filename } = req.file;
   
    const avatar = await jimp.read(tempUpload);  
    await avatar.autocrop().cover(250, 250, jimp.HORIZONTAL_ALIGN_CENTER || jimp.VERTICAL_ALIGN_MIDDLE).writeAsync(tempUpload);
    
    const newFileName = `${_id}_${filename}`;
    const resultUpload = path.join(avatarsDir, newFileName);
    await fs.rename(tempUpload, resultUpload);

    const avatarURL = path.join("avatars", newFileName);
    await User.findByIdAndUpdate(_id, {avatarURL});

    res.status(200).json({
        avatarURL,
    })

}

module.exports = {
signup, login, getCurrent, logout, updateAvatar, verify, reVerification, reSendingEmail
}