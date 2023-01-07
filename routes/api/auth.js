const express = require("express");
const authenticate = require("../../middlewares/authenticate");

const ctrl = require("../../controllers/auth")

const {schemas} = require("../../models/user")

const router = express.Router();

router.post("/signup", ctrl.signup)
router.post("/login", ctrl.login)
router.get("/current", authenticate, ctrl.getCurrent);
router.get("/logout", authenticate, ctrl.logout);

module.exports = router;