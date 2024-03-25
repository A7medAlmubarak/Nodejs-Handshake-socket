const crypto = require('crypto');
const { decryptDataWithSessionKey , encryptDataWithSessionKey , generateSessionKey, generateKeyPair, encryptData ,decryptData , signData ,verifySignature} = require('./cryptoFunctions');
const subjectService = require('./src/services/subjectService');
const clientCertificateService = require('./src/services/clientCertificateService');
const { Model, Op } = require("./src/database/config");


let socketIO;
const usersPublicKeys = {};

function initSocket(io) {
  socketIO = io;

  io.on('connection', async (socket) => {
    console.log('A user connected');



    const token = await new Promise((resolve) => {
      socket.on('getToken', (usertoken) => {
        const token = usertoken;
        resolve(token);
      });
    });

    


    // Generate a pair of keys for the user
    const { privateKeyArmored, publicKeyArmored } = await generateKeyPair();

    console.log(`Public key received from server :`, publicKeyArmored);

    // Emit the public key to the connected client
    socket.emit('publicKey', publicKeyArmored);

    // Store the user's public key on the socket for later use
    socket.publicKeyArmored = publicKeyArmored;
    // Handle other Socket.io events here

    socket.on('sendPublicKey', (receivedPublicKey) => {
      const userId = socket.id;
      usersPublicKeys[userId] = receivedPublicKey;
      console.log(`Public key received from user ${userId}:`, receivedPublicKey);
      socket.emit('receivedUserPublicKey');
    });
    const decryptedSessionKey = await new Promise((resolve) => {
    socket.on('sessionKeyExchange', async(encryptedSessionKey) => {
      console.log('Received encryptedSessionKey:', encryptedSessionKey);
      const decryptedSessionKey = await decryptData(encryptedSessionKey, privateKeyArmored, usersPublicKeys[socket.id]);
      console.log('decryptedSessionKey:', decryptedSessionKey);
      socket.emit('sessionKeyReceived');
      resolve(decryptedSessionKey);

    });
  });





    socket.on('getAllSubjects', async () => {
        const subjects = await subjectService.getAllSubjects();
        const encryptedSubjects = await encryptDataWithSessionKey(JSON.stringify(subjects), decryptedSessionKey);
        socket.emit('SubjectList', encryptedSubjects);
    });


    socket.on('getUserSubjects', async () => {
      const user = await Model.User.findByPk(token); 
      if (!user) {
        throw new RError(404, 'User not found');
      }
        const userSubjects = await subjectService.getUserSubjects(user.id);
        const encryptedUserSubjects = await encryptDataWithSessionKey(userSubjects, decryptedSessionKey);
        socket.emit('SubjectList', encryptedUserSubjects);
    });

    socket.on('storeSubject', async (data) => {

      const user = await Model.User.findByPk(token); 
      if (!user) {
        throw new RError(404, 'User not found');
      }
      console.log("user",JSON.stringify(user))

      console.log("user.UserId",user.id)
        const subjectName = await decryptDataWithSessionKey(data.encryptedSubjectName, decryptedSessionKey);
        console.log("subjectName",subjectName  )

        const newSubject = await subjectService.storeSubject(subjectName, user.id);
    });

    socket.on('submitMark', async ({ encryptedSubjectId, encryptedMark }) => {

      const subjectId = await decryptDataWithSessionKey(encryptedSubjectId, decryptedSessionKey);
      const mark = await decryptDataWithSessionKey(encryptedMark, decryptedSessionKey);
      const Subject = await subjectService.submitMark(subjectId, mark);
    });





    socket.on('generateSignature', async ({ data }) => {
      try {
          console.log("here")
        const signature = await signData(data, privateKeyArmored);
        console.log("signature",signature)

        // Send the signature and public key back to the client
        socket.emit('signatureGenerated', { signature, publicKeyArmored });
      } catch (error) {
        console.error('Error generating signature:', error.message);
      }
    });

    socket.on('verifySignature', async ({ data, signature, publicKeyArmored }) => {
      try {
        // Verify the provided signature
        const isSignatureValid = await verifySignature(data, signature, publicKeyArmored);

        console.log("isSignatureValid",isSignatureValid )
        // Send the verification result back to the client
        socket.emit('signatureVerified', { isSignatureValid });
      } catch (error) {
        console.error('Error verifying signature:', error.message);
      }
    });

    
    const ClientCertificate = await new Promise((resolve) => {
      socket.on('getClientCertificate', async ({csr, userid1}) => {
        const isSignatureValid = verifyCSR(csr);
    
        if (isSignatureValid) {
          const signedCertificate = signCSR(csr, privateKeyArmored);
          const ClientCertificate = await clientCertificateService.storeCertificate(signedCertificate , userid1 , privateKeyArmored  );

        } else {
          console.log('Invalid CSR signature');
        }
    
        
        socket.emit('ClientCertificate', ClientCertificate);
        resolve(ClientCertificate);
      });
    });
  });
}

function getSocketIO() {
  return socketIO;
}

function verifyCSR(csr) {
  const { userId, csrData, signature } = csr;
  const userPublicKey = '...'; // Replace with the actual user's public key
  const verify = crypto.createVerify('SHA256');
  verify.update(csrData);
  return verify.verify(userPublicKey, signature, 'base64');
}

function signCSR(csr, privateKey) {
  // Assuming your server is a CA, sign the CSR using the server's private key
  // This is a simplified example, and in a real-world scenario, you'd use a CA library
  // to handle certificate signing.
  const serverSign = crypto.createSign('SHA256');
  serverSign.update(csr.csrData);
  const serverSignature = serverSign.sign(privateKey, 'base64');
  return { userId: csr.userId, signedData: csr.csrData, signature: serverSignature };
}


module.exports = { initSocket, getSocketIO };
