const axios = require('axios');
const { getUserInput, closeReadline } = require('../utils/cliHelper');


// Replace 'http://localhost:3000' with your server's URL
const serverURL = 'http://localhost:3000';


const registerUser = async () => {
  try {
    const username = await getUserInput('Enter a new username: ');
    const password = await getUserInput('Enter a new password: ');
    const email = await getUserInput('Enter your email: ');
    const idNumber = await getUserInput('Enter your idNumber: ');
    const phone = await getUserInput('Enter your phone number: ');
    const response = await axios.post(`${serverURL}/register`, { username, password ,email ,idNumber , phone  });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const loginUser = async () => {
  try {
    const username = await getUserInput('Enter your username: ');
    const password = await getUserInput('Enter your password: ');

    const response = await axios.post(`${serverURL}/login`, { username, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

module.exports = { registerUser, loginUser };
