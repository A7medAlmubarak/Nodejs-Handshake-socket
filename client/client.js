const readline = require('readline');
const io = require('socket.io-client');
const authApi = require('./request/authApi');
const dataApi = require('./request/dataApi');
const { getUserInput, closeReadline } = require('./utils/cliHelper');
const { decryptDataWithSessionKey , encryptDataWithSessionKey , generateSessionKey, generateKeyPair, encryptData,signData, verifySignature } = require('./utils/cryptoFunctions');

const handshaking = require('./utils/handshake'); // Update the path accordingly
let UserId;
let UserData;
let clientSignature;
const socket = io('http://localhost:3000'); // Replace with your server's URL

(async () => {
  try {

    

    // Authenticate the user (login)

    const actionChoice = await getUserInput('Choose an action (1: Register, 2: Login): ');

    switch (actionChoice) {
      case '1':
        // Register a new user
        const result = await authApi.registerUser();
        console.log(result);
        isAuthenticated = true; // Set to true assuming successful registration
        break;

      case '2':
        // Log in with an existing user
        UserData = await authApi.loginUser();
        UserId= UserData.id;
        console.log("UserId:",UserId);
        isAuthenticated = true; // Set to true assuming successful login
        break;

      default:
        console.log('Invalid choice');
    }

    
  
    const {
      ClientCertificate,
      privateKeyArmored,
      publicKeyArmored,
      serverPublicKeyArmored,
      encryptedSessionKey,
      sessionKey
    } = await handshaking(socket, UserData);

    // Now you can use the returned values as needed
    console.log('\nPrivate Key:\n', privateKeyArmored);
    console.log('\nPublic Key:\n', publicKeyArmored);
    console.log('\nServer Public Key:\n', serverPublicKeyArmored);
    console.log('\nencryptedSessionKey:\n', encryptedSessionKey);
    console.log('\nSessionKey:\n', sessionKey);
    console.log("UserData.role_id:", UserData.role_id);
/*
    if( UserData.role_id==2 ){
    console.log('\ClientCertificate:\n', ClientCertificate);
    }*/


    
    // After login, present options to the user
    let continueLoop = true;

    while (continueLoop) {
      const userChoice = await getUserInput(
        'Choose an option \nAS STUDENT (1: Insert Subject, 2: view my subject list)\n AS PROF (3: view all subject, 4: submit mark) \nChoose an action (5: message to sign)',
      );

      switch (userChoice) {
        case '1':
          // Insert data
          const Subjectname = await getUserInput('Enter subject name: ');
          const encryptedSubjectName = await encryptDataWithSessionKey(Subjectname, sessionKey);

          socket.emit('storeSubject', { encryptedSubjectName });
          break;

        case '2':
          // Send a custom event to the server
          const customEventData = await getUserInput('Enter custom event data: ');
          socket.emit('customEvent', customEventData);
          console.log('Custom event sent to the server:', customEventData);
          break;

        case '3':
          socket.emit('getAllSubjects');
          socket.on('SubjectList', async (encryptedSubjects) => {
            const decryptedSubjects = await decryptDataWithSessionKey(encryptedSubjects, sessionKey);
            console.log('All subjects:', JSON.parse(decryptedSubjects));
          });
          break;

          case '4':
            const subjectId = await getUserInput('Enter subject id: ');
            const mark = await getUserInput('Enter subject mark: ');
            const encryptedSubjectId = await encryptDataWithSessionKey(subjectId, sessionKey);
            const encryptedMark = await encryptDataWithSessionKey(mark, sessionKey);

            socket.emit('submitMark', { encryptedSubjectId, encryptedMark });
            break;
          
        case '5':
          const messageToSign = await getUserInput('Enter a message to sign: ');
          const signature = await signData(messageToSign, privateKeyArmored);
          socket.emit('signedMessage', { message: messageToSign, signature });
          
          // Example: Receive a signed message from the server and verify it
          socket.on('signedMessageReceived', async ({ message, signature }) => {
            const isSignatureValid = await verifySignature(message, signature, serverPublicKey);
            console.log('Received Message:', message);
            console.log('Is Signature Valid:', isSignatureValid);
          });
          break;

          case '6':
            // Logout and exit the loop
            continueLoop = false;
            break;
  

        default:
          console.log('Invalid choice');
      }
    }

  } catch (error) {
    // Handle errors if needed
    console.error('Error:', error);
  } finally {
    // Close the readline interface when done
    closeReadline();
  }
})();



