const crypto = require('crypto');

     function generateHash(data, algorithm = 'sha256') {
         const hash = crypto.createHash(algorithm);
         hash.update(data);
         return hash.digest('hex');
     }

     const myString = "palu366";
     const sha256Hash = generateHash(myString);
     console.log(sha256Hash);