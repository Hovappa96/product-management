const cartModel = require("../models/cartModel")
const validator = require("../validator/validator")
const userModel = require("../models/userModel")
const productModel = require("../models/productModel")
const orderModel = require("../models/orderModel")




const createOrder = async function (req, res) {
    try {
        let id = req.params.userId;
        let data = req.body;

        let { userId, items } = data

        if (!validator.isValidobjectId(id)) {
            return res.status(400).send({ status: false, msg: "Please enter a valid userId" })
        }

        if (!validator.isValidReqBody(data)) {
            return res.status(400).send({ status: false, msg: "Please enter some data" })
        }

        if (!validator.isValid(userId)) {
            return res.status(400).send({ status: false, msg: "UserId is required" })
        }

        if (!validator.isValidobjectId(userId)) {
            return res.status(400).send({ status: false, msg: "Please enter a valid userId" })
        }

        let findUser = await userModel.findById(id)
        if (!findUser) {
            return res.status(404).send({ status: false, msg: "User not Found" })
        }

        if (id !== userId) {
            return res.status(400).send({ status: false, msg: "UserId Should Match" })
        }

        let findCart = await cartModel.findOne({ userId: id })

        let productId = items.productId

        let findProduct = await productModel.findOne({ productId, isDeleted: false })
        console.log(findProduct)
        if (!findProduct) {
            return res.status(404).send({ status: false, msg: "Product not found" })
        }
        let getPrice = findProduct.price;

        for (i = 0; i < items.length; i++) {
            if (items[i].quantity > 0)
                var storePrice = (items[i].quantity * getPrice)
            var Qty = items[i].quantity
        }
        // console.log(items.quantity)

        let cartDetails = {
            userId: userId,
            items: items,
            totalPrice: storePrice,
            totalItems: items.length,
            totalQuantity: Qty

        }
        let document = await orderModel.create(cartDetails)
        return res.status(201).send({ status: true, msg: "Order Created Successfully", data: document })
    }

    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }

}





const updateOrder = async function (req, res) {
    try {
        let id = req.params.userId;
        let data = req.body;

        let { orderId, userId } = data

        if (!validator.isValidobjectId(id)) {
            return res.status(400).send({ status: false, msg: "Please enter a valid userId" })
        }

        if (!validator.isValidReqBody(data)) {
            return res.status(400).send({ status: false, msg: "Please enter some data" })
        }

        if (!validator.isValid(userId)) {
            return res.status(400).send({ status: false, msg: "UserId is required" })
        }

        if (!validator.isValidobjectId(userId)) {
            return res.status(400).send({ status: false, msg: "Please enter a valid userId" })
        }

        let findUser = await userModel.findById(id)
        if (!findUser) {
            return res.status(404).send({ status: false, msg: "User not Found" })
        }

        if (id !== userId) {
            return res.status(400).send({ status: false, msg: "UserId Should Match" })
        }

        if (!validator.isValid(orderId)) {
            return res.status(400).send({ status: false, msg: "OrderId is required" })
        }

        if (!validator.isValidobjectId(orderId)) {
            return res.status(400).send({ status: false, msg: "Please enter a valid orderId" })
        }

        let checkOrder = await orderModel.findOne({ userId: userId })
        if (!checkOrder) {
            return res.status(404).send({ status: false, msg: "Order not Found for this User" })
        }

        let alterStatus = await orderModel.findOneAndUpdate({ _id: orderId, cancellable: true }, { status: "Cancelled" }, { new: true })
        if (!alterStatus) {
            return res.status(400).send({ status: false, msg: "Unable to change the status" })
        }
        return res.status(200).send({ status: true, msg: "Order Updated Successfully", data: alterStatus })
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}



module.exports = { createOrder, updateOrder }


