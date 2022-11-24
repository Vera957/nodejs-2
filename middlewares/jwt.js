const jwt = require('jsonwebtoken')
const { JWT_SECRET } = process.env

function createToken(id) {
   


    const token = jwt.sign(id, JWT_SECRET, {
        expiresIn: "15h",
    });
    console.log("token:", token); 
    return token;
}

function verifyToken(token) {
    try {
        const verifiedToken = jwt.verify(token, JWT_SECRET);
        return verifiedToken;
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    createToken,
    verifyToken,
}