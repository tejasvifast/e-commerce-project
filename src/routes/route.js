const express = require('express')
const router = express.Router()

const {createUser, loginUser, getUserDetails, updateUserDetails} = require('../controllers/userController')

router.post('/register',createUser)
router.post('/login', loginUser)
router.get('/user/:userId/profile', getUserDetails)
router.put('/user/:userId/profile',updateUserDetails )

module.exports = router