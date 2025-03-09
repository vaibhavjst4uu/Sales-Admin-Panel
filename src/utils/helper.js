// otpGenerator.js

const crypto = require("crypto");

module.exports = {
  generateOtp: (digits = 4) => {
    if (digits <= 0) {
      throw new Error('Number of digits must be greater than 0');
    }
    
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    
    // Generate a secure random number
    const otp = crypto.randomInt(min, max + 1).toString();
    
    return otp;
  },

  hash256: (data) => {

    const hash = crypto.createHash("sha256");
    hash.update(data);
    return hash.digest("hex");
  },

  CustomResponse: (res, status = 200, message = "", data = [], extra = []) => {
    return res
      .status(status)
      .json({ status: status, msg: message, data:data, ...extra });
  },

  CustomError: (res, status = 500, msg = "", errors = []) => {
    return res.status(status).send({ status: status, msg: msg, errors });
  },

  CustomErrorCatch: (res, error) => {
    let responseObject = {
      result: -1,
      msg: error.message,
    };
    if (error.name === 'ValidationError') {
      const errorMessage = Object.values(error.errors)[0].message;
      responseObject = {
        result: -1,
        msg: errorMessage,
      };
    } else if (error.code === 11000 && error.keyPattern && error.keyValue) {
      // Duplicate key violation
      const fieldName = Object.keys(error.keyPattern)[0];
      const duplicatedValue = error.keyValue[fieldName];
      const errorMessage = `${module.exports.ucWords(fieldName)} '${duplicatedValue}' must be unique.`;
      responseObject = {
        result: -1,
        msg: errorMessage,
      };
    }
    if ( error?.response?.status && typeof error.response.status === 'function') {
      responseObject.msg = error.message;
      return error.response.status(500).send(responseObject);
    } else {
      return res.status(500).send(responseObject);
    }


  },

  validations: (res, obj) => {
    const errorObject = {}; // Store errors in a single object
  
    // Check if obj is missing or empty
    if (!obj || Object.keys(obj).length === 0) {
      return res.status(400).json({
        result: 0,
        status: 400,
        msg: "Validation Errors",
        errors: [{ error: "Please add JSON body" }], // Add a specific error message for empty body
      });
    }
  
    // Helper function to check value validity
    const isInvalid = (value) => value === undefined || value === null || value === "";
  
    // Iterate over object keys to validate values
    Object.entries(obj).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // Validate array elements
        if (value.some(isInvalid)) {
          errorObject[key] = `${module.exports.ucWords(key)} array elements are required`;
        }
      } else if (isInvalid(value)) {
        // Validate single value
        errorObject[key] = `${module.exports.ucWords(key)} is required`;
      }
    });
  
    // If there are any errors, return them in the required format
    if (Object.keys(errorObject).length > 0) {
      return res.status(200).json({
        result: 0,
        status: 200,
        msg: "Validation Errors",
        errors: [errorObject], // Wrap errorObject in an array
      });
    }
  }
  ,  
  maskData: (value, type) => {
    if (!value) return "Not provided";

    switch (type) {
      case 'email': {
        const [user, domain] = value.split('@');
        const maskedUser = user.length > 2 ? `${user[0]}*****${user[user.length - 1]}` : user;
        return `${maskedUser}@${domain}`;
      }
      case 'phone': {
        return value.length >= 10 ? `${value.slice(0, 3)}*****${value.slice(-2)}` : value;
      }
      default: {
        return value;
      }
    }
  },

  singularize: (word) => {
    if (word.endsWith('ies')) {
        word = word.slice(0, -3) + 'y'; // candies → candy
    } else if (word.endsWith('es')) {
        word = word.slice(0, -2); // boxes → box
    } else if (word.endsWith('s')) {
        word = word.slice(0, -1); // cats → cat
    }
    return word;
  },

  singularizeAndCapitalize: (word) => {
    let singularWord = module.exports.singularize(word);
    return singularWord.charAt(0).toUpperCase() + singularWord.slice(1);
  },

  padNumber:(num)=> {
    return num.toString().padStart(2, '0');
  },
  

}



