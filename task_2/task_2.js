const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Define the directory containing the files
const directoryPath = 'drafts/task2';
const fileEncoding = 'binary'; // Specify the encoding here
const yourEmail = 'mr.fayzullayevbolibek@gmail.com'.toLowerCase(); // Your email in lowercase

// Function to calculate the SHA3-256 hash for a file and format it as lowercase hex
function calculateHash(filePath) {
  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(filePath, { encoding: fileEncoding });
    const hash = crypto.createHash('sha3-256');

    fileStream.on('data', (data) => {
      hash.update(data, fileEncoding);
    });

    fileStream.on('end', () => {
      const fileHash = hash.digest('hex').toLowerCase(); // Format as lowercase hex
      resolve({ file: filePath, hash: fileHash });
    });

    fileStream.on('error', (error) => {
      reject(error);
    });
  });
}

// Read all files in the directory and calculate hashes
fs.readdir(directoryPath, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }

  const filePromises = files.map((file) => {
    const filePath = path.join(directoryPath, file);
    return calculateHash(filePath);
  });

  Promise.all(filePromises)
    .then((results) => {
      // Sort the hashes in ascending order as whole strings
      results.sort((a, b) => a.hash.localeCompare(b.hash));
      
      // Join the sorted hashes without any separator
      const concatenatedHashes = results.map((result) => result.hash).join('');
      
      // Concatenate with your email address
      const finalResult = concatenatedHashes + yourEmail;
      
      // Calculate the SHA3-256 hash of the final result
      const finalHash = crypto.createHash('sha3-256').update(finalResult).digest('hex');
      
      console.log('SHA3-256 Hash of Final Result:');
      console.log(finalHash);
    })
    .catch((error) => {
      console.error('Error calculating hashes:', error);
    });
});
