const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { uploadFile } = require('../utils/aws')
const { isValid, isValidObjectType, isValidBody, validTitle, validString, validMobileNum, validEmail, validPwd, isValidObjectId, validDate } = require('../utils/validation')

const createUser = async function (req, res) {
    try {
        let requestBody = req.body
        if (!isValidBody(requestBody)) return res.status(400).send({ status: false, msg: "provide details" })
        const { fname, lname, email, phone, password, address } = requestBody
        if (!fname) return res.status(400).send({ status: false, message: "fname is mandatory" })
        if(validString(fname)) return res.status(201).send({ status: false, message: "fname should not contain number" })
        if (!lname) return res.status(400).send({ status: false, message: "lname is mandatory" })
        if(validString(lname)) return res.status(400).send({ status: false, message: "lname should not contain number" })

        if (!email) return res.status(400).send({ status: false, message: "email is mandatory" })
        if(validEmail(email)) return res.status(400).send({ status: false, message: "email not valid" })
        let uniqueEmail = await userModel.findOne({email:email})
        if(uniqueEmail) return res.status(400).send({ status: false, message: "email Id already exist" })

        if (!phone) return res.status(400).send({ status: false, message: "phone is mandatory" })
        if(validMobileNum(phone)) return res.status(400).send({ status: false, message: "phone not valid" })
        let uniquephone = await userModel.findOne({phone:phone})
        if(uniquephone) return res.status(400).send({ status: false, message: "phone no. already exist" })


        if (!password) return res.status(400).send({ status: false, message: "password is mandatory" })
        if (!address) return res.status(400).send({ status: false, message: "address is mandatory" })

        let files = req.files
        let imageUrl = await uploadFile(files[0])
        if(! imageUrl) return res.status(400).send({ status: false, message: "profile image is mandatory" })
        const bcryptPassword = await bcrypt.hash(password, 10)
        requestBody.password = bcryptPassword
        requestBody.address = JSON.parse(address)
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

        const { address, fname, lname, email, phone, password } = updateData

        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, msg: "invalid user Id" })
        let findUserId = await userModel.findById({ _id: userId })
        if (!findUserId) return res.status(404).send({ status: false, msg: "user not found" })

        if ((Object.keys(updateData).length == 0) && (!formData)) return res.status(400).send({ status: false, msg: "please provide data to update" })

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
            let address1 = JSON.parse(address)
            console.log(address1);

            const findAddress = await userModel.findOne({ _id: userId })

            if (address1.shipping) {
                const { street, city, pincode } = address1.shipping
                if (street) {
                    if (!isValid(street)) return res.status(400).send({ status: false, msg: "shipping street is not valid " })
                    findAddress.address.shipping.street = street
                }
                if (city) {
                    if (!isValid(city)) return res.status(400).send({ status: false, msg: "shipping city is not valid " })
                    findAddress.address.shipping.city = city
                }
                if (pincode) {
                    if (!isValid(pincode)) return res.status(400).send({ status: false, msg: "shipping pincode is not valid " })
                    findAddress.address.shipping.pincode = pincode
                }
            }
            if (address1.billing) {
                const { street, city, pincode } = address1.billing
                if (street) {
                    if (!isValid(street)) return res.status(400).send({ status: false, msg: "billing street is not valid " })
                    findAddress.address.billing.street = street
                }
                if (city) {
                    if (!isValid(city)) return res.status(400).send({ status: false, msg: "billing city is not valid " })
                    findAddress.address.billing.city = city
                }
                if (pincode) {
                    if (!isValid(pincode)) return res.status(400).send({ status: false, msg: "billing pincode is not valid " })
                    findAddress.address.billing.pincode = pincode
                }
            }
            updateData.address = findAddress.address
        }
        const updateDetails = await userModel.findByIdAndUpdate({ _id: userId }, updateData, { new: true })
        return res.status(200).send({ status: true, message: "User profile updated successfully", data: updateDetails })
    }
    catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}

module.exports = { createUser, loginUser, getUserDetails, updateUserDetails }

