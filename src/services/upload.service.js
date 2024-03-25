const fs = require('fs/promises');
const path = require('path');
function isAllowedFileExtension(filename, allowedExtensions) {
  if (!allowedExtensions || allowedExtensions.length === 0) {
    return true;
  }
  const ext = path.extname(filename).toLowerCase();
  return allowedExtensions.some((allowedExt) => ext === allowedExt.toLowerCase());
}
const uploadFile = async (req, fileFieldName, storagePath = "", allowedExtensions = [], maxSizeInBytes = 10485760) => {
  const defaultStoragePath = "../storage/uploads";
  const uploadPath = path.join(__dirname, defaultStoragePath, storagePath);
  // Ensure the directory exists
  await fs.mkdir(uploadPath, { recursive: true });
  const files = req.body.files || {}; // Ensure files object exists
  const file = files[fileFieldName];
  if (!file) {
    throw new Error(`File not found for field name: ${fileFieldName}`);
  }
  const fileExt = path.extname(file.filename).toLowerCase();
  // Check file extension
  if (!isAllowedFileExtension(file.filename, allowedExtensions)) {
    throw new Error('Invalid file extension');
  }
  // Check file size
  if (file.data.length > maxSizeInBytes) {
    throw new Error('File size exceeds the allowed limit');
  }
  // Generate a unique filename with original filename and timestamp
  const originalFilename = path.parse(file.filename).name;
  const uniqueFilename = `${originalFilename}-${Date.now()}-${Math.floor(Math.random() * 1000)}${fileExt}`;
  const saveTo = path.join(uploadPath, uniqueFilename);
  // Save the file data
  await fs.writeFile(saveTo, file.data);
  //console.log(`File saved: ${saveTo}`);
  // Return the path relative to the project root
  const relativePath = path.relative(process.cwd(), saveTo);
  // Return the new filename with the relative path
  return relativePath;
};
//Example
// const myFilePathInsideMyserverStorage =  await uploadFile(req, 'file3', "userImages", [ ".jpg",".png" ]);
module.exports = uploadFile;