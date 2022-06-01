const orderModel = require("../models/orderModel")

const createOrder = async function(req,res){
    const userId=req.params.userId
    const {cancellable,status,isDeleted} =req.body

    const user = await findOne({userId:userId,isDeleted:false})
    if(!user) return res.status(404).send({ status: false, message: "user not found"})

    const cart = await cartModel.findOne({ userId: userId })

    const order ={
        userId:userId,
        items:cart.items,
        totalPrice: cart.totalPrice,
        totalItems: cart.totalItems,
        totalQuantity: cart.items.map(x=>x.quantity).reduce((x,y)=>x+y),
        cancellable: cancellable,
        status: status,
        deletedAt: isDeleted?
        isDeleted: isDeleted,
    }

    const orderCreated = await orderModel.create()
    return res.status(201).send({ status: true, message: "cart created successfully", data: orderCreated })

}

module.exports={createOrder}