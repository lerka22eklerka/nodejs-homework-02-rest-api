const jwt = require("jsonwebtoken")
const createError = require('http-errors')
const dotenv = require('dotenv');
const {User} = require("../models/user")

dotenv.config()

const {SECRET_KEY} = process.env;

const authenticate = async (req, res, next) => {
    const {authorization = ""} = req.headers;
    const [bearer, token] = authorization.split(" ");

    if(bearer !== "Bearer") {
        next(createError(401, "Not authorized", { status: "Unauthorized" }))
    }

    try {
        const {id} = jwt.verify(token, SECRET_KEY);
        const user = await User.findById(id);
        if(!user || !user.token || token !== String(user.token)) {
            next(createError(401, "Not authorized", { status: "Unauthorized" }))
        }
        req.user = user;
        next();
    }
    catch {
        next(createError(401))
    }
}

module.exports = authenticate;