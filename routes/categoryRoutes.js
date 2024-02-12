const express = require("express");

const router = express.Router();
const checkAuth = require("../middleware/authMiddleware");
const categoryController = require("../controllers/categoryController");

//routes
//create category
router.post(
  "/create-category",
  checkAuth.requireSignIn,
  checkAuth.isAdmin,
  categoryController.createCategoryController
);

//update category
router.put(
  "/update-category/:id",
  checkAuth.requireSignIn,
  checkAuth.isAdmin,
  categoryController.updateCategoryController
);

//getALl category
router.get("/get-category", categoryController.getCategoryControlller);

//single category
router.get(
  "/single-category/:slug",
  categoryController.singleCategoryController
);

//delete category
router.delete(
  "/delete-category/:id",
  checkAuth.requireSignIn,
  checkAuth.isAdmin,
  categoryController.deleteCategoryCOntroller
);

module.exports = router;
