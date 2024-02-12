const express = require("express");

const router = express.Router();
const checkAuth = require("../middleware/authMiddleware");
const authController = require("../controllers/authController");

//register||method POST
router.post("/register", authController.registerController);
router.post("/login", authController.loginController);
//forgot password
router.post("/forgot-password", authController.forgotPasswordController);

//protected route users
router.get("/user-auth", checkAuth.requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});
//protected route admin
router.get(
  "/admin-auth",
  checkAuth.requireSignIn,
  checkAuth.isAdmin,
  (req, res) => {
    res.status(200).send({ ok: true });
  }
);

//test router
router.get(
  "/test",
  checkAuth.requireSignIn,
  checkAuth.isAdmin,
  authController.testController
);

//update profile
router.put(
  "/profile",
  checkAuth.requireSignIn,
  authController.updateProfileController
);

//orders
router.get(
  "/orders",
  checkAuth.requireSignIn,
  authController.getOrdersController
);

//all orders
router.get(
  "/all-orders",
  checkAuth.requireSignIn,
  checkAuth.isAdmin,
  authController.getAllOrdersController
);

// order status update
router.put(
  "/order-status/:orderId",
  checkAuth.requireSignIn,
  checkAuth.isAdmin,
  authController.orderStatusController
);

module.exports = router;
