const express = require("express")
const router = express.Router()
const userController = require("../controller/userController")
const middleware = require("../middleware/middleware")
const productController = require("../controller/productController")
const cartController = require("../controller/cartController")
const orderContoller = require("../controller/orderController")




//USER
router.post("/register",userController.register)

router.post("/login",userController.login)

router.get("/user/:userId/profile",middleware.authentication,middleware.authorization,userController.getProfile)

router.put("/user/:userId/profile",middleware.authentication,middleware.authorization,userController.updateProfile)


//PRODUCT
router.post("/products",productController.createProduct)

router.get("/products",productController.getProductbyQuery)

router.get("/products/:productId",productController.getProduct)

router.put("/products/:productId",productController.updateProduct)

router.delete("/products/:productId",productController.deleteProduct)


//CART
router.post("/users/:userId/cart",middleware.authentication,middleware.authorization,cartController.createCart)

router.put("/users/:userId/cart",middleware.authentication,middleware.authorization,cartController.updateCart)

router.get("/users/:userId/cart",middleware.authentication,middleware.authorization,cartController.getCart)

router.delete("/users/:userId/cart",middleware.authentication,middleware.authorization,cartController.deleteCart)



//ORDER
router.post("/users/:userId/orders",middleware.authentication,middleware.authorization,orderContoller.createOrder)

router.put("/users/:userId/orders",middleware.authentication,middleware.authorization,orderContoller.updateOrder)


module.exports = router



