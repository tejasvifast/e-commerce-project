const cartModel = require('../models/cartModel')
const productModel = require('../models/productModel')
const userModel = require('../models/userModel')
const { isValid, isValidObjectType, isValidBody, isValidObjectId } = require('../utils/validation')

//********************************************************CREATE PRODUCT************************************************************ */

const createCart = async function (req, res) {
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
                let updatedCart = await cartModel.findOneAndUpdate({ "items.productId": productId, userId: userId }, { $inc: { "items.$.quantity": requestBody.quantity, totalPrice: productPrice * requestBody.quantity } }, { new: true })
                return res.status(200).send({ status: true, message: "updated", data: updatedCart })
            }
            else {
                let updatedCart = await cartModel.findOneAndUpdate({ userId: userId }, { $push: { items: requestBody }, $inc: { totalItems: 1, totalPrice: productPrice * requestBody.quantity } }, { new: true })
                return res.status(200).send({ status: true, message: "updated 2", data: updatedCart })
            }
        }
        const cartCreate = {
            userId: userId,
            items: [requestBody],
            totalItems: 1,
            totalPrice: (requestBody.quantity) * productPrice
        }
        const cartCreated = await cartModel.create(cartCreate)
        return res.status(201).send({ status: true, message: "cart created successfully", data: cartCreated })
    }
    catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}

//**********************************************************************UPDATE CART************************************************************************************************** */

const updateCart = async function (req, res) {
    try {
        let userId = req.params.userId
        let productId = req.body.productId
        let cartId = req.body.cartId
        let removeProduct = req.body.removeProduct
        const findCart = await cartModel.findById({ userId: userId })
        const items = findCart.items
        const findProduct = await productModel.findOne({ _id: productId })
        let removedProductPrice = findProduct.price
        if (removeProduct == 0) {
            let cart = await cartModel.findOne({ "items.productId": productId, userId: userId })
            let quantity = cart.items[0].quantity
            let deleteProduct = await cartModel.findOneAndUpdate({ "items.productId": productId }, { $pull: { items: { productId: productId } }, $inc: { totalItems: -1, totalPrice: -removedProductPrice/*quantity*/ } }, { new: true })
            return res.status(200).send({ status: true, messsage: "item removed successfully", data: deleteProduct })
        }
        if (removeProduct == 1) {
            let reduceProduct = await cartModel.findOneAndUpdate({ "items.productId": productId }, { $inc: { /*"items.$.quantity":/* -items.quantity,*/  totalPrice: -removedProductPrice } }, { new: true })
            return res.status(200).send({ status: true, messsage: "product removed successfully", data: reduceProduct })
        }
    }
    catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}

//***********************************************************************GET CART********************************************************************************************* */

const getCart = async function (req, res) {
    try {
        let userId = req.params.userId
        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "invalid user Id.." })
        let isCartExist = await cartModel.findOne({ userId: userId })
        if (!isCartExist) return res.status(404).send({ status: false, message: "cart does not exist, create first.." })
        return res.status(200).send({ status: true, message: "your cart summary", data: isCartExist })
    }
    catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}

//**********************************************************************DELETE CART************************************************************************************* */


const deleteCart = async function (req, res) {
    try {
        let userId = req.params.userId
        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "invalid user Id.." })
        let isCartExist = await cartModel.findOne({ userId: userId })
        if (!isCartExist) return res.status(404).send({ status: false, message: "cart does not exist..." })
        let cartDeleted = await cartModel.findOneAndUpdate({ _id: isCartExist._id }, { items: [], totalPrice: 0, totalItems: 0 }, { new: true })
        return res.status(200).send({ status: true, message: "your cart is empty..continue shopping", data: cartDeleted })
    }
    catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}






module.exports = { createCart, updateCart, getCart, deleteCart }
