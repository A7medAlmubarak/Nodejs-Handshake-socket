const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const getUserInput = (prompt) => {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
};

const closeReadline = () => {
  rl.close();
};

module.exports = { getUserInput, closeReadline };