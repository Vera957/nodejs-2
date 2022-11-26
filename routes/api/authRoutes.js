const express = require("express");
// const authController = require("../controllers/auth.controller");
// const { tryCatchWrapper } = require("../helpers");
// const { userController } = require("../../models/user");
// const { auth } = require("../middlewares/auth");

const authRouter = express.Router();

// authRouter.post("/register", tryCatchWrapper(authController.register));
// authRouter.post("/login", tryCatchWrapper(authController.login));
// authRouter.post("/logout", tryCatchWrapper(auth), tryCatchWrapper(authController.logout));

// authRouter.get('/verify/:verifyToken', tryCatchWrapper(userController.verifyUser))

module.exports = {
    authRouter,
};