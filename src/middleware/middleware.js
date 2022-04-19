const jwt = require("jsonwebtoken")
const validator = require("../validator/validator")

const authentication = function (req, res, next) {
    try {
        let token = req.headers["authorization"]
        if (!token) {
            return res.status(400).send({ status: false, msg: "Please pass Token for authentication" })
        }

        const splitToken = token && token.split(" ")[1]

        let decodedToken = jwt.verify(splitToken, "group11", { ignoreExpiration: true })

        //checking Expire
        let expire = decodedToken.exp;
        let iat = Math.floor(Date.now() / 1000)
        if (expire < iat) {
            return res.status(401).send({ status: false, msg: "token is expired" })
        }

        if (!decodedToken) {
            return res.status(401).send({ status: false, msg: "Token is Invalid,Please enter a valid token" })
        }

        req["userId"] = decodedToken.userId;
        next();

    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}

const authorization = function (req, res, next) {
    try {
        let id = req.userId
        let userId = req.params.userId

        if (!validator.isValidobjectId(userId)) {
            return res.status(400).send({ staus: false, msg: "Please enter Valid UserID(24 char)" })
        }

        if (id !== userId) {
            return res.status(403).send({ status: false, msg: "You are not authorized" })
        }

        next()

    }
    catch (error) {
        return res.staus(500).send({ status: false, msg: error.message })
    }
}

module.exports = { authentication, authorization }



