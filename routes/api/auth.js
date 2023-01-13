const express = require("express");
const authenticate = require("../../middlewares/authenticate");
const upload = require("../../middlewares/upload")

const ctrl = require("../../controllers/auth")

const {schemas} = require("../../models/user")

const router = express.Router();

router.post("/signup", ctrl.signup)
router.post("/login", ctrl.login)
router.get("/current", authenticate, ctrl.getCurrent);
router.get("/logout", authenticate, ctrl.logout);
router.patch("/avatars", authenticate, upload.single("avatar"), ctrl.updateAvatar)

module.exports = router;