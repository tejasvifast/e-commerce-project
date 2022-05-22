const express = require('express')
const router = express.Router()

const {createUser, loginUser, getUserDetails, updateUserDetails} = require('../controllers/userController')

router.post('/register',createUser)
router.post('/login', loginUser)
router.get('/user/:userId/profile', getUserDetails)
router.put('/user/:userId/profile',updateUserDetails )

//****************************************************************************************************

const { createProduct, getProduct, getProductById, deleteProductById } = require('../controllers/productController')


router.post('/products', createProduct)
router.get('/products', getProduct)
router.get('/products/:productId', getProductById)
router.delete('/products/:productId', deleteProductById)





module.exports = router