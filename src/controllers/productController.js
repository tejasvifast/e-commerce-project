
const productModel = require('../models/productModel')
const {uploadFile} = require('../utils/aws')

const { isValid, isValidObjectType, isValidBody, validString, validMobileNum, validEmail, validPwd, isValidObjectId, validSize, isValidEnum } = require('../utils/validation')



//******************************************CREATE PRODUCT************************************************************ */

const createProduct = async function (req, res) {
    try {
        let requestBody = req.body
        let productCreated = await productModel.create(requestBody)
        return res.status(201).send({ status: true, message: "User created successfully", data: productCreated })
    }
    catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}

//***********************************************GET PRODUCT****************************************************** */

const getProduct = async function (req, res) {
    try {
        const requestQuery = req.query
        const { size, name, priceGreaterThan, priceLessThan } = requestQuery
        const filterQuery = { isDeleted: false }

        if (Object.keys(requestQuery).length > 0) {
            if (size) { filterQuery.availableSizes = { $in: size.split(",").map(x => x.trim()) } }// {$in:["X","S"]}
            if (name) { filterQuery.title = name.trim() }
            if (priceGreaterThan && priceLessThan) { filterQuery.price = { $gte: priceGreaterThan, $lte: priceLessThan } }
            if (priceGreaterThan) { filterQuery.price = { $gte: priceGreaterThan } }
            if (priceLessThan) { filterQuery.price = { $lte: priceLessThan } }
        }
    
        const findProducts = await productModel.find(filterQuery).sort({ price: 1 })
        if (!findProducts) return res.status(404).send({ status: false, message: "products not found or may be deleted" })
        return res.status(200).send({ status: true, message: "products details", data: findProducts })
    }
    catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}

//****************************************************GET BY ID************************************************************************************* */

const getProductById = async function (req, res) {
    try {
        const productId = req.params.productId
        const findProduct = await productModel.findById({ _id: productId, isDeleted: false })
        if (!findProduct) return res.status(404).send({ status: false, message: "product details not found or may be deleted" })
        return res.status(200).send({ status: true, message: "product details", data: findProduct })
    }
    catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}

///**************************************************UPDATE PRODUCTS******************************************************************************** */


const updateProductDetails = async function (req, res) {
    try {
        const productId = req.params.productId
        if(! isValidObjectId(productId)) return res.status(400).send({ status: false, message: "invalid product Id" })
        let isProductExist = await productModel.findById({_id: productId, isDeleted: false})
        if(!isProductExist) return res.status(404).send({ status: false, message: "product details not found or may be deleted" })

        const formData = req.files
        let imageUrl = await uploadFile(formData[0])

        const data = req.body
        if(! isValidBody(data)) return res.status(400).send({ status: false, message: "please provide details to update your product" })

        const {title,description,price,isFreeShipping,style,availableSizes,installments} = data //destructuring

        if(title){
            if(validString(title)) return res.status(400).send({ status: false, message: "title should not contain number" })
        }
        if(description){
            if(validString(description)) return res.status(400).send({ status: false, message: "description should not contain number" })
        }
        if(price){
            if(! validString(price)) return res.status(400).send({ status: false, message: "price should contain only number" })
        }
        if(style){
            if(validString(style)) return res.status(400).send({ status: false, message: "style should not contain number" })
        }
        if (!(isValid(data.availableSizes))) { return res.status(400).send({ status: false, message: "Please provide available size for your product" }) }

        if (data.availableSizes.trim().split(',').map(value=>isValidEnum(value)).filter(item => item==false).length!==0) { return res.status(400).send({ status: false, message: 'Size should be between [S, XS,M,X, L,XXL, XL] ' }) }

        const availableSizes1 = data.availableSizes.trim().split(',').map(value=> value.trim());
    
        if(installments){
            if(! validString(installments)) return res.status(400).send({ status: false, message: "installments should only contain number" })
        }

        let updateProduct = await productModel.findByIdAndUpdate({_id: productId}, {$set:{title:title,description: description, price: price,
        isFreeShipping: isFreeShipping, productImage: imageUrl, style: style, installments: installments,availableSizes: availableSizes1}}, {new: true})

        return res.status(200).send({ status: true, message: "product details updated successfully", data: updateProduct })


    }
    catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}

//****************************************************DELETE BY ID************************************************************************************ */

const deleteProductById = async function (req, res) {
    try {
        const productId = req.params.productId
        const deleteProduct = await productModel.findByIdAndUpdate({ _id: productId }, { isDeleted: true }, { new: true })
        if (!deleteProduct) return res.status(404).send({ status: false, message: "product not found or may be already deleted" })
        return res.status(200).send({ status: true, message: "product deleted successfully" })
    }
    catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------

module.exports = { createProduct, getProduct, getProductById,updateProductDetails, deleteProductById }