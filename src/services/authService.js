require('dotenv').config()

const bcrypt = require('bcrypt');
const { Model, Op } = require("../database/config");
class AuthService {
  static async registerUser(username, password , email , idNumber ,phone) {
    if (!password) {
        throw new Error('Password is required for user registration.');
      }
      const user = await Model.User.create({username,email , password ,  idNumber ,phone });
  }

  static async loginUser(username, password) {
    const user = await Model.User.findOne({
      where: { username: username }
    });
        if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }

    return null;
  }
}

module.exports = AuthService;
