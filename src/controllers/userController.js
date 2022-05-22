const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const multer = require('multer')

const createUser = async function (req, res) {
    try {
        let requestBody = req.body
        const { password } = requestBody
        const bcryptPassword = await bcrypt.hash(password, 10)
        requestBody.password = bcryptPassword
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

const updateUserDetails = async function (req, res, file) {
    try {
        const userId = req.params.userId
        const formData = file
        console.log(formData, userId);
    }
    catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}

module.exports = { createUser, loginUser, getUserDetails, updateUserDetails }

