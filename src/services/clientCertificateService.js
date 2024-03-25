const { Model, Op } = require("../database/config");
const {  generateSignatureForCSR} = require('../../cryptoFunctions');

// Service to get all subjects
async function CertificateVerify(certificate) {
  try {
    const certificate1 = await Model.ClientCertificate.findOne({
        where: { certificate: certificate }
      });

    return certificate1;
  } catch (error) {
    throw error;
  }
}

// Service to store a new subject
async function storeCertificate(signedCertificate ,UserId , privateKeyArmored ) {
  try {   
    console.log ("signature",signedCertificate);
    const certificate = signedCertificate;
    const certificate1 = await Model.ClientCertificate.create({certificate, UserId});
    return signature;
  } catch (error) {
    throw error;
  }
}



module.exports = {
    storeCertificate,
    CertificateVerify,
};
