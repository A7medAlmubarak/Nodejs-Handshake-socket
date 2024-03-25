const openpgp = require('openpgp');
const crypto = require('crypto');

//const { generateKeyPair, signData, verifySignature, encryptData, decryptData } = require('./cryptoFunctions');
async function encryptDataWithSessionKey(data, sessionKey) {
  try {
    const algorithm = 'aes-256-ctr';
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(sessionKey, 'hex'), Buffer.from('00000000000000000000000000000000', 'hex'));
    let encryptedData = cipher.update(data, 'utf-8', 'hex');
    encryptedData += cipher.final('hex');
    return encryptedData;
  } catch (error) {
    throw error;
  }
}
async function decryptDataWithSessionKey(encryptedData, sessionKey) {
  try {
    const algorithm = 'aes-256-ctr';
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(sessionKey, 'hex'), Buffer.from('00000000000000000000000000000000', 'hex'));
    let decryptedData = decipher.update(encryptedData, 'hex', 'utf-8');
    decryptedData += decipher.final('utf-8');
    return decryptedData;
  } catch (error) {
    throw error;
  }
}



function generateCSR() {
  return crypto.createCSR({
    key: keyPair.privateKey,
    subject: { /* معلومات حول السيرفر */ }
  });
}

function generateSessionKey(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

// Function to generate a key pair (for demonstration purposes)
async function generateKeyPair() {
  const { privateKeyArmored, publicKeyArmored } = await openpgp.generateKey({
    userIds: [{ name: 'John Doe', email: 'john.doe@example.com' }],
    curve: 'ed25519',
  });

  return { privateKeyArmored, publicKeyArmored };
}

// Function to sign data
async function signData(data, privateKeyArmored) {
    try {
      const privateKey = (await openpgp.key.readArmored(privateKeyArmored)).keys[0];
  
      const { data: signedData } = await openpgp.sign({
        message: openpgp.cleartext.fromText(data),
        privateKeys: [privateKey],
      });
  
      return signedData;
    } catch (error) {
      throw new Error('Error signing data: ' + error.message);
    }
  }
        
// Function to verify a signature
async function ؤ(data, signature, publicKeyArmored) {
  const publicKey = (await openpgp.key.readArmored(publicKeyArmored)).keys[0];

  const verified = await openpgp.verify({
    message: openpgp.message.fromText(data),
    signature: await openpgp.signature.readArmored(signature),
    publicKeys: [publicKey],
  });

  return verified.signatures[0].valid;
}

// Function to encrypt data
async function encryptData(data, publicKeyArmored) {
  const publicKey = (await openpgp.key.readArmored(publicKeyArmored)).keys;

  const { data: encryptedData } = await openpgp.encrypt({
    message: openpgp.message.fromText(data),
    publicKeys: publicKey,
  });

  return encryptedData;
}

// Function to decrypt data
async function decryptData(encryptedData, privateKeyArmored, publicKeyArmored) {
  const privateKey = (await openpgp.key.readArmored(privateKeyArmored)).keys[0];
  const publicKey = (await openpgp.key.readArmored(publicKeyArmored)).keys;

  const { data: decryptedData } = await openpgp.decrypt({
    message: await openpgp.message.readArmored(encryptedData),
    publicKeys: publicKey,
    privateKeys: [privateKey],
  });

  return decryptedData;
}

const generateSignatureForCSR = async (csr, privateKeyArmored) => {
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(JSON.stringify(csr)
  );
  const signature = await signer.sign(privateKeyArmored);
  return signature;
}


module.exports = {
  generateSessionKey,
    generateKeyPair,
    signData,
    verifySignature,
    encryptData,
    decryptData,
    encryptDataWithSessionKey,
    decryptDataWithSessionKey,
    generateSignatureForCSR
  };
  