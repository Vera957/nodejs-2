const bcrypt = require("bcrypt");
const { Unauthorized } = require("http-errors");


async function crashPassword(password) {
    const salt = await bcrypt.genSalt()
    const newPass = await bcrypt.hash(password, salt)
    return newPass
}

async function checkPassword(given, saved) {
    const pass = await bcrypt.compare(given, saved)
    if (!given || !pass) {
        throw new Unauthorized("message: Email or password is wrong");
    } 
}

module.exports = {
    crashPassword,
    checkPassword,
}