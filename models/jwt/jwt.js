const jwt = require("jsonwebtoken")

const { JWT_SECRET } = process.env

async function createToken(id) {
    try {
        const token = jwt.sign(id, JWT_SECRET, {
            expiresIn: "15h",
        })
        console.log('token created')
        return token
    } catch (error) {
        console.error(error)
    }    
}



/* async function verifyToken(token) {
    try {
        const verifiedToken = jwt.verify(token, JWT_SECRET);
        console.log("verifiedToken:", verifiedToken);
    } catch (error) {
        console.error(error);
    }
   }

    try {
        const expiredToken =
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjEsImlhdCI6MTY2ODEwMjMzNiwiZXhwIjoxNjY4MTAyMzUxfQ.ComTw5yf1dGdh07W_d3w9KW2CO1DEDbpHfgaZeYFClw";
        const verifiedToken = jwt.verify(expiredToken, JWT_SECRET);
        console.log("verifiedToken:", verifiedToken);
    } catch (error) {
        // TokenExpiredError jwt expired
        console.error("EXPIRED_TOKEN_ERROR: ", error.name, error.message);
    } */


async function checkTermOfToken(token) {
    try {
        const verifiedToken = jwt.verify(token, JWT_SECRET);
        console.log("verifiedToken:", verifiedToken);
    } catch (error) {
        console.error("EXPIRED_TOKEN_ERROR: ", error.name, error.message);
    }
}

module.exports = {
    createToken,
    checkTermOfToken,
  //  checkToken,
}