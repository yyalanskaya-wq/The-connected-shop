const { generateUniqueEmail, generateUkrainianFullName } = require("../support/utils");
 
module.exports = {
    userFullName: generateUkrainianFullName(),
    userEmail: generateUniqueEmail(),
    userPassword: "tututu359!"

};
 