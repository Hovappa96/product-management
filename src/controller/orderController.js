const cartModel = require("../models/cartModel")
const validator = require("../validator/validator")
const userModel = require("../models/userModel")
const productModel = require("../models/productModel")
const orderModel = require("../models/orderModel")




const createOrder = async function (req, res) {
    try {
        let userId = req.params.userId;
        let data = req.body;

        let { cartId } = data

        if (!validator.isValidobjectId(userId)) {
            return res.status(400).send({ status: false, msg: "Please enter a valid userId" })
        }

        if (!validator.isValidReqBody(data)) {
            return res.status(400).send({ status: false, msg: "Please enter some data" })
        }

        let findUser = await userModel.findOne({ _id: userId, isDeleted: false })
        if (!findUser) {
            return res.status(404).send({ status: false, msg: "User not Found" })
        }

        if (!validator.isValid(cartId)) {
            return res.status(400).send({ status: false, msg: "cartId is required" })
        }

        if (!validator.isValidobjectId(cartId)) {
            return res.status(400).send({ status: false, msg: "Please enter a valid cartId" })
        }

        let checkCart = await cartModel.findOne({ _id: cartId, userId: userId })
        if (!checkCart) {
            return res.status(404).send({ status: false, msg: "this user does not have any cart" })
        }

        let totalQuantity = 0
        for (i = 0; i < checkCart.items.length; i++) {
            totalQuantity = totalQuantity + checkCart.items[i].quantity
        }

        const cartDetails = {
            userId: userId,
            items: checkCart.items,
            totalPrice: checkCart.totalPrice,
            totalItems: checkCart.totalItems,
            totalQuantity: totalQuantity,
        }

        let document = await orderModel.create(cartDetails)

        //making cart empty when order created 
        const makeCartEmpty = await cartModel.findOneAndUpdate({ _id: cartId }, { $set: { items: [], totalPrice: 0, totalItems: 0 } }, { new: true })

        return res.status(201).send({ status: true, message: "Success", data: document })
    }

    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }

}





const updateOrder = async function (req, res) {
    try {
        let userId = req.params.userId;
        let data = req.body;

        let { orderId, status } = data

        if (!validator.isValidReqBody(data)) {
            return res.status(400).send({ status: false, msg: "Please enter some data" })
        }

        let findUser = await userModel.findOne({ _id: userId, isDeleted: false })
        if (!findUser) {
            return res.status(404).send({ status: false, msg: "User not Found" })
        }

        if (!validator.isValid(orderId)) {
            return res.status(400).send({ status: false, msg: "OrderId is required" })
        }

        if (!validator.isValidobjectId(orderId)) {
            return res.status(400).send({ status: false, msg: "Please enter a valid orderId" })
        }

        if (!validator.isValid(status)) {
            return res.status(400).send({ status: false, msg: "status is required" })
        }

        let checkOrder = await orderModel.findOne({ _id: orderId, userId: userId })
        if (!checkOrder) {
            return res.status(404).send({ status: false, msg: "Order not Found for this User" })
        }
        if (checkOrder.cancellable == true) {

            if (checkOrder.status == 'pending') {

                if (!validator.isStatus(status)) {
                    return res.status(400).send({ status: false, msg: "Please enter a valid status" })

                }
                let alterStatus = await orderModel.findOneAndUpdate({ _id: orderId }, { $set: { status: status } }, { new: true })
                if (!alterStatus) {
                    return res.status(400).send({ status: false, msg: "Unable to change the status" })
                }
                return res.status(200).send({ status: true, message: "Order Updated Successfully", data: alterStatus })
            }

            if (checkOrder.status == 'completed') {
                return res.status(400).send({ status: false, message: "its Completed unable to change status" })
            }

        }

        if (checkOrder.cancellable == false) {

            if (checkOrder.status == 'pending') {

                if (!validator.isStatus(status)) {
                    return res.status(400).send({ status: false, msg: "Please enter a valid status" })
                }

                if (status == 'cancelled') {
                    return res.status(400).send({ status: false, msg: "its not cancellable" })
                }

                let alterStatus = await orderModel.findOneAndUpdate({ _id: orderId }, { $set: { status: status } }, { new: true })
                if (!alterStatus) {
                    return res.status(400).send({ status: false, msg: "Unable to change the status" })
                }

                return res.status(200).send({ status: true, message: "Order Updated Successfully", data: alterStatus })
            }

            if (checkOrder.status == 'completed') {
                return res.status(400).send({ status: false, message: "its Completed unable to change status" })
            }

        }
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

module.exports = { createOrder, updateOrder }


