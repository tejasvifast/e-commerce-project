
const productModel = require('../models/productModel')
const { uploadFile } = require('../utils/aws')
const { isValid, isValidObjectType, isValidBody, isValidSize, isValidString, isValidMobileNum, isValidEmail, validPwd, isValidObjectId, isValidPrice, isValidNum } = require('../utils/validation')

//******************************************CREATE PRODUCT*************************************************************/

const createProduct = async function (req, res) {
    try {
        let requestBody = req.body
        let files = req.files
        let { title, description, price, currencyId, style, availableSizes, installments } = requestBody

        if (!title) return res.status(400).send({ status: false, message: "title is mandatory" })
        if (!isValid(title)) return res.status(400).send({ status: false, message: "title Should be Valid" })
        if (await productModel.findOne({ title })) return res.status(400).send({ status: false, message: "title Should be Unique" })

        if (!description) return res.status(400).send({ status: false, message: "description is mandatory" })
        if (!isValid(description)) return res.status(400).send({ status: false, message: "title Should be Valid" })

        if (!price) return res.status(400).send({ status: false, message: "price is mandatory" })
        if (!isValidPrice(price)) return res.status(400).send({ status: false, message: "price Should be Valid" })

        if (!currencyId) return res.status(400).send({ status: false, message: "currencyId is mandatory" })
        if (currencyId.toUpperCase() != "INR") return res.status(400).send({ status: false, message: "currencyId Should be Valid" })
        requestBody.currencyId = currencyId.toUpperCase()
        requestBody.currencyFormat = "₹"

        if (!style) return res.status(400).send({ status: false, message: "style is mandatory" })
        if (!isValid(style)) return res.status(400).send({ status: false, message: "style Should be Valid" })
        if (!isValidString(style)) return res.status(400).send({ status: false, message: "style Should Not Contain Numbers" })

        if (!availableSizes) return res.status(400).send({ status: false, message: "availableSizes is mandatory" })
        availableSizes = availableSizes.split(",").map(x => x.trim())
        if (availableSizes.map(x => isValidSize(x)).filter(x => x === false).length !== 0) return res.status(400).send({ status: false, message: "Size Should be Among  S,XS,M,X,L,XXL,XL" })
        requestBody.availableSizes = availableSizes

        if (!installments) return res.status(400).send({ status: false, message: "installments is mandatory" })
        if (!isValidNum(installments)) return res.status(400).send({ status: false, message: "installments Should be whole Number Only" })

        if (!(files && files.length > 0)) return res.status(400).send({ status: false, message: "profile image is mandatory" })
        let imageUrl = await uploadFile(files[0])
        requestBody.productImage = imageUrl

        let productCreated = await productModel.create(requestBody)
        return res.status(201).send({ status: true, message: "User created successfully", data: productCreated })
    }
    catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}

//***********************************************GET PRODUCT***********************************************************/

const getProduct = async function (req, res) {
    try {
        const requestQuery = req.query
        const { size, name, priceGreaterThan, priceLessThan } = requestQuery
        const filterQuery = { isDeleted: false }

        if (Object.keys(requestQuery).length > 0) {
            if (size) { filterQuery.availableSizes = { $in: size.split(",").map(x => x.trim()) } }// {$in:["X","S"]}/////////////////////////////
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
const updateProductDetals = async function (req, res) {
    try {
        const productId = req.params.productId
        const image = req.files
        const updateData = req.body

        let { title, description, price, currencyId, style, availableSizes, installments } = updateData

        if (!isValidObjectId(productId)) return res.status(400).send({ status: false, msg: "invalid user Id" })
        let findProductId = await productModel.findById({ _id: productId, isDeleted: false })
        if (!findProductId) return res.status(404).send({ status: false, msg: "Product not found" })

        if ((Object.keys(updateData).length == 0)) return res.status(400).send({ status: false, msg: "please provide data to update" })

        if (image&&image.length>0) {
            let updateProductImage = await uploadFile(image[0])
            updateData.productImage = updateProductImage
        }
        if (title) {
            if (!isValid(title)) return res.status(400).send({ status: false, message: "title Should be Valid" })
            if (await productModel.findOne({ title })) return res.status(400).send({ status: false, message: "title Should be Unique" })
        }
        if (description) {
            if (!isValid(description)) return res.status(400).send({ status: false, message: "title Should be Valid" })
        }
        if (price) {
            if (!isValidPrice(price)) return res.status(400).send({ status: false, message: "price Should be Valid" })
        }
        if (style) {
            if (!isValid(style)) return res.status(400).send({ status: false, message: "style Should be Valid" })
            if (!isValidString(style)) return res.status(400).send({ status: false, message: "style Should Not Contain Numbers" })
        }
        if (availableSizes) {
            availableSizes = availableSizes.split(",").map(x => x.trim())
            if (availableSizes.map(x => isValidSize(x)).filter(x => x === false).length !== 0) return res.status(400).send({ status: false, message: "Size Should be Among  S,XS,M,X,L,XXL,XL" })
            updateData.availableSizes = availableSizes 
        }
        if (installments) {
            if (!isValidNum(installments)) return res.status(400).send({ status: false, message: "installments Should be whole Number Only" })
        }

        const updateDetails = await productModel.findByIdAndUpdate({ _id: productId }, updateData, { new: true })
        return res.status(200).send({ status: true, message: "User profile updated successfully", data: updateDetails })
    }
    catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}

// const updateProductDetals = async function (req, res) {
//     try {
//         const productId = req.params.productId
//         const formData = req.files
//         let imageUrl = await uploadFile(formData[0])
//         const data = req.body
//         let filterQuery = { isDeleted: false }
//         const { title, description, price, currencyId, currencyFormat, isFreeShipping, productImage, style, availableSizes, installments } = data //destructuring
//         if (title) { filterQuery.title = title }
//         if (description) { filterQuery.description = description }
//         if (price) { filterQuery.price = price }
//         if (currencyId) { filterQuery.currencyId = currencyId }
//         if (currencyFormat) { filterQuery.currencyFormat = currencyFormat }
//         if (isFreeShipping) { filterQuery.isFreeShipping = isFreeShipping }
//         if (productImage) { filterQuery.productImage = imageUrl }
//         if (style) { filterQuery.style = style }
//         if (availableSizes) { filterQuery.availableSizes = availableSizes }
//         if (installments) { filterQuery.installments = installments }

//         const updateDetails = await productModel.findByIdAndUpdate({ _id: productId }, filterQuery, { new: true })
//         return res.status(200).send({ status: true, message: "product details updated successfully", data: updateDetails })


//     }
//     catch (err) {
//         return res.status(500).send({ status: false, error: err.message })
//     }
// }

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

module.exports = { createProduct, getProduct, getProductById, updateProductDetals, deleteProductById }