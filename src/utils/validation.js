const mongoose = require("mongoose")

const isValidPrice = function (price) {
  if (/^\d+(?:\.\d{1,4})?$/.test(price)) {
    return true
  } else {
    return false
  }
}

const isValid = (value) => {
    if (typeof value == 'undefined' || value == null) return false
    if (typeof value == 'string' && value.trim().length == 0) return false
    if (typeof value == 'number' && value.toString().trim().length == 0) return false
    return true
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

const isValidSize = (Size) => {
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

const isValidNum = (Num) => {
  let correctNum = [0,1]
  return (correctNum.includes(Num))
}



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

module.exports = { isValid, isValidObjectType, isValidBody, isValidSize, isValidString, isValidMobileNum, isValidEmail, validPwd, isValidObjectId, isValidPrice, isValidNum };
