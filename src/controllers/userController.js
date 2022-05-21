const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')

const createUser = async function (req, res) {
    try {
        let requestBody = req.body
        const { password } = requestBody
        const bcryptPassword = await bcrypt.hash(password, 10)
        requestBody.password = bcryptPassword
        let userCreated = await userModel.create(requestBody)
        return res.status(201).send({ status: true, message: "user successfully registered", data: userCreated })
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
        if (!bcrypt.compare(password, userLoggedIn.password)) return res.status(400).send({ status: false, message: "incorrect password" })
        return res.status(200).send({ status: true, message: "user successfully login", data: userLoggedIn })
    }
    catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}

module.exports = { createUser, loginUser }

