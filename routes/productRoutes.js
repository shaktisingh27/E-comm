const express = require("express");
const checkAuth = require("../middleware/authMiddleware");
const productController = require("../controllers/productController");
const formidable = require("express-formidable");

const router = express.Router();

//routes
router.post(
  "/create-product",
  checkAuth.requireSignIn,
  checkAuth.isAdmin,
  formidable(),
  productController.createProductController
);

//routes update product
router.put(
  "/update-product/:pid",
  checkAuth.requireSignIn,
  checkAuth.isAdmin,
  formidable(),
  productController.updateProductController
);

//get products
router.get("/get-product", productController.getProductController);
//single product
router.get("/get-product/:slug", productController.getSingleProductController);

//get photo
router.get("/product-photo/:pid", productController.productPhotoController);

//
//delete rproduct
router.delete(
  "/delete-product/:pid",
  productController.deleteProductController
);

//filter product
router.post("/product-filters", productController.productFiltersController);

//product count pagination
router.get("/product-count", productController.productCountController);

//product per page
router.get("/product-list/:page", productController.productListController);

//search product
router.get("/search/:keyword", productController.searchProductController);

//similar products
//similar product
router.get(
  "/related-product/:pid/:cid",
  productController.realtedProductController
);

//category wise product
router.get(
  "/product-category/:slug",
  productController.productCategoryController
);
//payment routes

//token
// router.get("/braintree/token", productController.braintreeTokenController);

// //payments
// router.post(
//   "/braintree/payment",
//   checkAuth.requireSignIn,
//   productController.brainTreePaymentController
// );

module.exports = router;
