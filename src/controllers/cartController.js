
const cartModel = require('../models/cartModel')
const productModel = require('../models/productModel')
const userModel = require('../models/userModel')

//********************************************************CREATE PRODUCT************************************************************ */

const addToCart = async function (req, res) {
    try {
        let userId = req.params.userId
        let requestBody = req.body
        let productId = req.body.productId

        const isValidUser = await userModel.findById({ _id: userId })
        if (!isValidUser) return res.status(404).send({ status: false, message: "user not found" })

        const product = await productModel.findOne({ _id: productId })
        const productPrice = product.price

        const isAlreadyCart = await cartModel.findOne({ userId: userId })
        if (isAlreadyCart) {
            let alreadyProductsId = isAlreadyCart.items.map(x => x.productId.toString())
            if (alreadyProductsId.includes(productId)) {
                console.log(requestBody.quantity)
                let updatedCart = await cartModel.findOneAndUpdate({ "items.productId": productId,userId:userId}, { $inc: { "items.$.quantity":  requestBody.quantity,totalPrice:productPrice*requestBody.quantity } }, { new: true })
                return res.status(200).send({ status: true, message: "updated", data: updatedCart })
            }
            else{
                let updatedCart = await cartModel.findOneAndUpdate({ userId: userId }, { $push: { items:requestBody },$inc:{totalItems:1,totalPrice:productPrice * requestBody.quantity} }, { new: true }) 
                return res.status(200).send({ status: true, message: "updated 2", data: updatedCart })
            }
        }
        const cartCreate={
            userId:userId,
            items:[requestBody],
            totalItems:1,
            totalPrice:(requestBody.quantity) * productPrice
        }
        const cartCreated = await cartModel.create(cartCreate)
        return res.status(201).send({ status: true, message: "cart created successfully", data: cartCreated })
    }
    catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}


module.exports = { addToCart }
