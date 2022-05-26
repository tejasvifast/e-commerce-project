
const cartModel = require('../models/cartModel')
const userModel = require('../models/userModel')

//********************************************************CREATE PRODUCT************************************************************ */

const addToCart = async function (req, res) {
    try {
        
        let userId = req.params.userId
        let requestBody = req.body
        const isValidUser = await userModel.findById({_id: userId})
        if(! isValidUser) return res.status(404).send({ status: false, message: "user not found" })

        const isAlreadyCart = await cartModel.findOne({userId: userId})
        if(isAlreadyCart) return res.status(200).send({ status: true, message: "product added to cart successfully", data: isAlreadyCart })
        const cartCreated = await cartModel.create(requestBody)
        return res.status(201).send({ status: true, message:  "cart created successfully", data: cartCreated })
    }
    catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}


module.exports = { addToCart }
