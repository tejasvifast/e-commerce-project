
const { ConfigurationServicePlaceholders } = require('aws-sdk/lib/config_service_placeholders')
const cartModel = require('../models/cartModel')
const productModel = require('../models/productModel')
const userModel = require('../models/userModel')

//********************************************************CREATE PRODUCT************************************************************ */

const addToCart = async function (req, res) {
    try {
        
        let userId = req.params.userId
        let requestBody = req.body
        let productId = req.body.productId
        let items = req.body.items
        const isValidUser = await userModel.findById({_id: userId})
        if(! isValidUser) return res.status(404).send({ status: false, message: "user not found" })
        const isAlreadyCart = await cartModel.findOne({userId: userId})
        if(!isAlreadyCart) {
            let products=[]
            for(let i=0; i<items.length; i++){ 
            products[i] = items[i].productId
            //let product = await productModel.findById({_id: products[i]})
           }
            console.log(products.length)
            console.log(products)
            // let totalPrice = 
            // requestBody.totalPrice = totalPrice
                 const addInCart = await cartModel.create(requestBody)
                 return res.status(201).send({status:true, message:"cart created successfully", data:addInCart})
        }
        else{

        }
        
    }
    catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}


module.exports = { addToCart }
