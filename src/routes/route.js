
const express = require('express')
const router = express.Router()


const {authentication, authorization} = require('../middleware/auth')
const {createUser, loginUser, getUserDetails, updateUserDetails} = require('../controllers/userController')

router.post('/register',createUser)
router.post('/login', loginUser)
router.get('/user/:userId/profile', authentication, getUserDetails)
router.put('/user/:userId/profile',authentication, authorization, updateUserDetails )

//********************************************************************************************************************

const { createProduct, getProduct, getProductById,updateProductDetails, deleteProductById } = require('../controllers/productController')


router.post('/products', createProduct)
router.get('/products', getProduct)
router.get('/products/:productId', getProductById)
router.put('/products/:productId', updateProductDetails)
router.delete('/products/:productId', deleteProductById)

//*********************************************************************************************************************** */

const { createCart, updateCart, getCart, deleteCart } = require('../controllers/cartController')



router.post('/users/:userId/cart', createCart)
router.put('/users/:userId/cart', updateCart)
router.get('/users/:userId/cart', getCart)
router.delete('/users/:userId/cart', deleteCart)///users/:userId/orders

//*********************************************************************************************************************** */

const { createOrder, updateOrder} = require('../controllers/orderController')

router.post('/users/:userId/orders', createOrder)
router.put('/users/:userId/orders', updateOrder)








module.exports = router