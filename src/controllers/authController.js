const AuthService = require('../services/authService');
const path = require('path');

class AuthController {
  static async registerUser(req, res) {
    const { username, password , email , idNumber ,phone} = req.body;

    try {
      await AuthService.registerUser(username, password , email , idNumber ,phone);
      res.status(200).send('You have been registered');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }

  static async loginUser(req, res) {
    const { username, password } = req.body;

    try {
      const user = await AuthService.loginUser(username, password);

      if (user) {
        res.status(200).send(user);
      } else {
        res.status(500).send('wrong');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }
}

module.exports = AuthController;
