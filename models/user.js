const { userDataValidatorJoi, User } = require('../routes/api/schemas.user')
// const { verifyToken } = require('../middlewares/jwt')  // create!!!!
const bcrypt = require("bcrypt");
const { Unauthorized } = require("http-errors");
const gravatar = require('gravatar');
const path = require("path");
const fs = require("fs/promises");
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = process.env
const jimp = require('jimp')

async function signup(req, res, next) {
    const checkedUser = userDataValidatorJoi.validate(req.body)
    const { error, value } = checkedUser;
    if (error) {
        return res.status(404).json({ message: error.message })
    } else {
        const notUniqueEmail = await User.findOne({ email: value.email })
        if (notUniqueEmail) return res.status(400).json({ message: 'user with current email already exist' })
        const salt = await bcrypt.genSalt()
        const crashedPass = await bcrypt.hash(value.password, salt)
        value.password = crashedPass
        console.log('value.password', value.password)
        const url = gravatar.url(value.email, { s: '200', r: 'pg', d: '404' });
        value.avatarUrl = url;
        await User.create(value);
        return res.json({
            user: {
                'email': value.email,
                "subscription": "starter",
            }
        }
        )
    }
}

async function login(req, res, next) {
    const joiValidator = userDataValidatorJoi.validate(req.body)
    const { value, error } = joiValidator
    if (error) throw new Error(error.message)
    const user = await User.findOne({ email: value.email });
    const pass = await bcrypt.compare(value.password, user.password)
    console.log('user exist, pass ok', user, pass)
    if (!user || !pass) {
        throw new Unauthorized("message: Email or password is wrong");
    }
    const token = jwt.sign({ id: user._id.toString() }, JWT_SECRET,
        {
            expiresIn: "15h",
        }
    );

    user.token = token
    await User.findByIdAndUpdate(user._id, user);
    return res.json({
        token: user.token,
        user: {
            email: user.email,
            subscription: user.subscription,
        }
    })
}

async function logout(req, res, next) {
    const { user } = req
    user.token = null
    await User.findByIdAndUpdate(user._id, user)
    return res.status(204).json({ logout: true })
}

async function getUsers(req, res, next) {
    const allUsers = await User.find()
    return res.json({ 'users': allUsers })
}

async function current(req, res, next) {
    return res.json({
        "email": req.user.email,
        "subscription": req.user.subscription
    })
}

async function avatar(req, res, next) {
    try {
        console.log('avatar')
        const { file, user } = req
        const result = gravatar.url(user.email, { s: "200", r: "pg", d: "404" });
        user.avatarURL = result
        user.avatarURL = user.avatarURL + file.filename;  // test it
        const newPath = path.join(__dirname, "../public/images/", file.filename); // change path?
        await fs.rename(file.path, newPath, { new: true });
        await User.findByIdAndUpdate(user._id, user)
        const image = await jimp.read(newPath);
        image.resize(250, 250);
        await image.writeAsync(newPath);
        return res.status(201).json({
            data: {
                avatar: user.avatarURL
            },
        });
    }
    catch (error) {
        if (req.file) {
            await fs.unlink(req.file.path);
        }
        console.error("Got error:", error.name, error.message);
        return res.status(500).json({
            error: error.message,
        });
    }
}


module.exports = {
    signup,
    login,
    current,
    logout,
    getUsers,
    avatar,
}

