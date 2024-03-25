require('dotenv').config()
const jwt = require("jsonwebtoken");
const { Model } = require("../../database/config.js");
const RError = require("../../core/error.response.js");
const responseMessage = require("../../core/success.response.js");
const checkUser = async (req, res, next) => {
    try {
        const token = req.headers.auth;
        const user = await getUser(token);
        req.user_id = user.id
        next();
    } catch (error) {
        console.log(error)
        const statusCode = error.statusCode || 500;
        const response = responseMessage(false, statusCode, error.message);
        res.status(statusCode).send(response);
    }
}
const getUser = async (token) => {
    if (!token) {
        throw new RError(401, "unauthorized");
    }
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const id = decodedToken.id;
    const user = await Model.User.findByPk(id, { attributes: ['id', 'name'] });
    if (user == null) {
        throw new RError(404, "user not found")
    }
    return user;
}
module.exports = { checkUser, getUser };