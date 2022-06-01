const orderModel = require("../models/orderModel")
const cartModel = require('../models/cartModel')
const productModel = require('../models/productModel')
const userModel = require('../models/userModel')
const { isValid, isValidObjectId, isValidString, isValidNum } = require('../utils/validation')
const { createCollection } = require("../models/productModel")

const createOrder = async function (req, res) {
    const userId = req.params.userId
    const { cancellable } = req.body

    if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "invalid user Id.." })
    const user = await userModel.findOne({ userId: userId, isDeleted: false })
    if (!user) return res.status(404).send({ status: false, message: "user not found" })

    const cart = await cartModel.findOne({ userId: userId }).lean().select({ updatedAt: 0, createdAt: 0, __v: 0, _id: 0 })
    if (!cart) return res.status(404).send({ status: false, message: "cart not found to place an order.." })
    if (cart.items.length == 0) return res.status(404).send({ status: false, message: "Cart is empty... First add Product to Cart." })

    if ( typeof cancellable != "boolean" ) return res.status(400).send({ status: false, message: "cancellable should be true or false only" })

    cart.totalQuantity = cart.items.map(x => x.quantity).reduce((x, y) => x + y)
    cart.cancellable = cancellable

    const orderCreated = await orderModel.create(cart)
    res.status(201).send({ status: true, message: "cart created successfully", data: orderCreated })

    await cartModel.findOneAndUpdate({ userId: userId }, { $set: { items: [], totalItems: 0, totalPrice: 0 } }, { new: true })

}

//*********************************************************************************************************************************************************************** */


module.exports = { createOrder }
