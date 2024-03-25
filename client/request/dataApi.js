const axios = require('axios');
const { getUserInput, closeReadline } = require('../utils/cliHelper');

const serverURL = 'http://localhost:3000';

const getDataList = async () => {
  try {
    const response = await axios.get(`${serverURL}/api/data/data-list`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const insertData = async (newData) => {
  try {
    const response = await axios.post(`${serverURL}/api/data/insert-data`, newData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

module.exports = { getDataList, insertData };
