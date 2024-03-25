const Busboy = require('busboy');
const fs = require('fs');
const path = require('path');
const { Transform } = require('stream');
function handleFormData(req, res, next) {
  const contentType = req.headers['content-type'];
  if (!contentType || !contentType.includes('multipart/form-data')) {
    return next();
  }
  const busboy = new Busboy({ headers: req.headers });
  const body = { files: {} };
  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    const buffers = [];
    file.on('data', (chunk) => {
      buffers.push(chunk);
    });
    file.on('end', () => {
      const fileData = Buffer.concat(buffers);
      body.files[fieldname] = {
        filename,
        mimetype,
        data: fileData,
      };
    });
  });
  busboy.on('field', (fieldname, value) => {
    body[fieldname] = value;
  });
  busboy.on('finish', () => {
    req.body = body;
    next();
  });
  busboy.on('error', (err) => {
    next(err);
  });

  req.pipe(busboy);
}
module.exports = handleFormData;