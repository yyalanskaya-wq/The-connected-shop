const { generateUniqueEmail, generateUkrainianFullName } = require("../support/Utils");
 
module.exports = {
    userFullName: generateUkrainianFullName(),
    userEmail: generateUniqueEmail(),
    userPassword: "tututu359!"

};
 