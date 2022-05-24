const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { uploadFile } = require('../utils/aws')
const { isValid, isValidObjectType, isValidBody, validTitle, validString, validMobileNum, validEmail, validPwd, isValidObjectId, validDate } = require('../utils/validation')

const createUser = async function (req, res) {
    try {
        let requestBody = req.body
        let files = req.files
        let imageUrl = await uploadFile(files[0])
        const { password } = requestBody
        const bcryptPassword = await bcrypt.hash(password, 10)
        requestBody.password = bcryptPassword
        requestBody.profileImage = imageUrl
        let userCreated = await userModel.create(requestBody)
        return res.status(201).send({ status: true, message: "User created successfully", data: userCreated })
    }
    catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}

//*********************************************************************************************************************************** */

const loginUser = async function (req, res) {
    try {
        let requestBody = req.body
        const { password, email } = requestBody
        let userLoggedIn = await userModel.findOne({ email })
        if (!userLoggedIn) return res.status(404).send({ status: false, message: "user not found" })
        let checkValidPass = await bcrypt.compare(password, userLoggedIn.password)
        if (!checkValidPass) return res.status(400).send({ status: false, message: "incorrect password" })
        let token = jwt.sign(
            { userId: userLoggedIn._id }, "e-commerceWebsite", { expiresIn: '1d' }
        )
        return res.status(200).send({ status: true, message: "User login successfull", data: token })
    }
    catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}

//********************************************************************************************************************************************* */

const getUserDetails = async function (req, res) {
    try {
        const userId = req.params.userId
        const findUserId = await userModel.findById({ _id: userId })
        if (!findUserId) return res.status(404).send({ status: false, message: "user details not found" })
        return res.status(200).send({ status: true, message: "User profile details", data: findUserId })
    }
    catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}

//************************************************************************************************************************************************ */

const updateUserDetails = async function (req, res) {
    try {

        const userId = req.params.userId
        const formData = req.files
        const updateData = req.body

        const { address, fname, lname, email, phone, password } = updateData      // undefined {}       []  {}

        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, msg: "invalid user Id" })
        let findUserId = await userModel.findById({ _id: userId })
        if (!findUserId) return res.status(404).send({ status: false, msg: "user not found" })

        if ((Object.keys(updateData).length == 0) && (!formData)) return res.status(400).send({ status: false, msg: "please provide data to update" })   //fordata handle

        if (formData) {
            let updateProfileImage = await uploadFile(formData[0])
            updateData.profileImage = updateProfileImage
        }


        if (fname) {
            if (!isValid(fname)) return res.status(400).send({ status: false, msg: "fname is not valid" })
            if (!validString(fname)) return res.status(400).send({ status: false, msg: "fname should not contain number" })
        }
        if (lname) {
            if (!isValid(lname)) return res.status(400).send({ status: false, msg: "lname is not valid" })
            if (!validString(lname)) return res.status(400).send({ status: false, msg: "lname should not contain number" })
        }
        if (email) {
            if (!validEmail(email)) return res.status(400).send({ status: false, msg: "email is not valid" })
        }
        if (phone) {
            if (!validMobileNum(phone)) return res.status(400).send({ status: false, msg: "phone is not valid" })
        }
        if (password) {
            if (!isValid(password)) return res.status(400).send({ status: false, msg: "password is not valid" })
            updateData.password = await bcrypt.hash(password, 10)
        }
        if (address) {
           // updateData.address = JSON.parse(address)
            let address = JSON.parse(address)
            console.log(address);
            // if(address.shipping){
            //     if(address.shipping.street){}
            //     if(address.shipping.city)
            //     if(address.shipping.pincode)

            // }
            // if(address.billing){
            //     if(address.billing.street)
            //     if(address.billing.city)
            //     if(address.billing.pincode)


            

            // }
        }


        const updateDetails = await userModel.findByIdAndUpdate({ _id: userId }, updateData, { new: true })
        return res.status(200).send({ status: true, message: "User profile updated successfully", data: updateDetails })
    }
    catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}

module.exports = { createUser, loginUser, getUserDetails, updateUserDetails }

