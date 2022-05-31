const orderModel = require('../models/orderModel')
const cartModel = require('../models/cartModel')
const productModel = require('../models/productModel')
const userModel = require('../models/userModel')
const { isValid, isValidObjectId, isValidString, isValidNum } = require('../utils/validation')


const createOrder = async function (req, res) {
    try {
        let userId = req.params.userId
        let requestBody = req.body

        if(!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "invalid user Id.." })

        const { cancellable, status } = requestBody

        const searchCart = await cartModel.findOne({userId: userId})
        if(! searchCart) return res.status(404).send({ status: false, message: "cart not found to place an order.." })
        let items = searchCart.items
        let count = 0
        for(let i=0; i<items.length; i++){
            count = count + items[i].quantity
        } 
        requestBody.items =  searchCart.items
        requestBody.totalPrice = searchCart.totalPrice
        requestBody.totalItems = searchCart.totalItems
        requestBody.totalQuantity = count
        requestBody.userId = userId

        const orderCreated = await orderModel.create(requestBody)
        return res.status(201).send({ status: true, message: "Order placed successfully", data: orderCreated })
        
    }

    catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}

//*********************************************************************************************************************************************************************** */


module.exports = {createOrder}