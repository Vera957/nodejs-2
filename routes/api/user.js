const express = require('express')
const routerUser = express.Router()
const { tryCatchWrapper } = require('../../middlewares/tryCatchWrapper')
const { auth } = require('./../../middlewares/auth.middleware')
const multer = require("multer");
const uniqid = require('uniqid')
const path = require("path");
const userController = require('../../models/user')

const storage = multer.diskStorage({
    dest: path.join(__dirname, "tmp"),
    filename: function (req, file, cb) {
        cb(null, uniqid() + file.originalname);
    },
});
const upload = multer({
    storage,
    limits: {
        fileSize: 10000, 
    },
});

routerUser.get('/', tryCatchWrapper(auth), tryCatchWrapper(userController.getUsers))
routerUser.post('/signup', tryCatchWrapper(userController.signup))
routerUser.post('/login',tryCatchWrapper(userController.login))
routerUser.get('/logout',tryCatchWrapper(auth), tryCatchWrapper(userController.logout))
routerUser.get('/current', tryCatchWrapper(auth), tryCatchWrapper(userController.current))
routerUser.post('/', tryCatchWrapper(userController.signup))
routerUser.patch('/avatars', tryCatchWrapper(auth), upload.single("image"), tryCatchWrapper(userController.avatar))

module.exports = { routerUser, userController }


