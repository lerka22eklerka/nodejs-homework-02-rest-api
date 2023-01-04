const express = require("express");

const ctrl = require("../../controllers/auth")

const {schemas} = require("../../models/user")

const router = express.Router();

router.post("/signup", ctrl.signup)

module.exports = router;