const mongoose = require("mongoose")

const isValidPrice = function (price) {
  if (/^\d+(?:\.\d{1,4})?$/.test(price)) {
    return true
  } else {
    return false
  }
}

const isValid = function (value) {
  if (typeof value === 'undefined' || value === null) return false
  if (typeof value === 'string' && value.trim().length === 0) return false
  return true;
}

const isValidObjectType = (value) => {
  if (typeof value === 'object' && Object.keys(value).length > 0) {
    return false;
  } else {
    return true;
  }
}

const isValidBody = (object) => {
  if (Object.keys(object).length > 0) {
    return true
  } else {
    return false;
  }
};

const validSize = (Size) => {
  let correctSize = ["S", "XS", "M", "X", "L", "XXL", "XL"]
  return (correctSize.includes(Size))
}

const isValidString = (String) => {
  if (/\d/.test(String)) {
    return false
  } else {
    return true
  }
}

const isValidNum = (number) => {
  if (/^\d+$/.test(number)) {
    return true
  } else {
    return false;
  };
};

const isValidMobileNum = (Mobile) => {
  if (/^[6-9]\d{9}$/.test(Mobile)) {
    return true
  } else {
    return false;
  };
};

const isValidEmail = (Email) => {
  if (/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(Email)) {
    return true
  } else {
    return false;
  }

};

const validPwd = (Password) => {
  if (/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/.test(Password)) {
    return false
  } else {
    return true;
  }
};

const isValidObjectId = (objectId) => {
  return mongoose.Types.ObjectId.isValid(objectId)
};

module.exports = { isValid, isValidObjectType, isValidBody, validSize, isValidString, isValidMobileNum, isValidEmail, validPwd, isValidObjectId, isValidPrice, isValidNum };
