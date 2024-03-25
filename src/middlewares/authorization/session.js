require('dotenv').config()
const { Model } = require("../../database/config");
const RError = require("../../core/error.response.js");
const responseMessage = require("../../core/success.response.js");

const checkUser = async (req, res, next) => {
  try {
    const userId = req.session.user_id; 
    if (!userId) {
      throw new RError(401, 'Unauthorized');
    }
    const user = await Model.User.findByPk(userId); 
    if (!user) {
      throw new RError(404, 'User not found');
    }
    req.user_id = user.id; // Store user ID for further access
    console.log("user id : ",user.id);
    next();
  } catch (error) {
    console.error(error);
    const statusCode = error.statusCode || 500;
    const response = responseMessage(false, statusCode, error.message);
    res.status(statusCode).send(response);
  }
};
module.exports = { checkUser };
