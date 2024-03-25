const io = require('socket.io-client');
const { generateSessionKey, generateKeyPair, encryptData , generateCSR ,signData, verifySignature} = require('./cryptoFunctions');
const { getUserInput } = require('./cliHelper');
let clientCertificate;
// Function for client-server handshake
async function handshaking(socket,UserData) {
  try {
    console.log("usertoken",UserData.id)
    socket.emit('getToken', UserData.id);
    // Generate key pair for the client
    const { privateKeyArmored, publicKeyArmored } = await generateKeyPair();
    // Send public key to the server
    socket.emit('sendPublicKey', publicKeyArmored);

    // Receive server's public key
    const serverPublicKeyArmored = await new Promise((resolve) => {
      socket.once('publicKey', (serverPublicKey) => {
        resolve(serverPublicKey);
      });
    });
    const sessionKey = generateSessionKey();

    const encryptedSessionKey = await new Promise((resolve) => {
    socket.on('receivedUserPublicKey', async () => {
      const encryptedSessionKey = await encryptData(sessionKey, serverPublicKeyArmored);
      socket.emit('sessionKeyExchange', encryptedSessionKey);
      resolve(encryptedSessionKey);
    });
  });
  console.log("UserData.role_id:", UserData.role_id);


  /*
  if(UserData.role_id==2){
    const userid1=UserData.id;
    const csr = generateCSR({privateKeyArmored ,  userid1}  );

    socket.emit('getClientCertificate', {csr , userid1});

    clientCertificate = await new Promise((resolve) => {
      socket.on('ClientCertificate', async (clientCertificate) => {
        resolve(clientCertificate);
      });
    });
  

  }*/
  
  console.log("here")


    return {
      clientCertificate,
      privateKeyArmored,
      publicKeyArmored,
      serverPublicKeyArmored,
      encryptedSessionKey,
      sessionKey
    };

  } catch (error) {
    console.error('Handshaking error:', error.message);
    throw error; // rethrow the error if needed
  }
}

module.exports = handshaking;