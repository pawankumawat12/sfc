const express = require("express");
const {
  adminLogin,
  CreateUserByAdminOrSubadmin,
} = require("../controllers/Auth/Admin");
const {
  CreateProductCategory,
  ProductCategories,
  EditProductCategory,
  GetProductCategory,
  GetLeafProductCategories,
} = require("../controllers/Products/category");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  CreateProduct,
  GetAllProducts,
  GetProducts,
} = require("../controllers/Products/product");
const { authMiddleware } = require("../middleware/Auth");
const { SignUpUser } = require("../controllers/Auth/User");
const { verify } = require("../controllers/Auth/Verify");
const { RefreshToken } = require("../controllers/Auth/RefreshToken");
const { logout } = require("../controllers/Auth/Logout");

//admin create owner/ subadmins
router.post("/signIn", adminLogin);
router.post("/admin/create", authMiddleware, CreateUserByAdminOrSubadmin);
router.post("/signUp", SignUpUser);
router.post("/signout", logout);
//verify user who has login
router.post("/verify", verify);

//refresh token api here
router.post("/refresh", RefreshToken);

//product categories
router.get("/product/category", ProductCategories);

router.post(
  "/product/category/create",
  upload.single("image"),
  CreateProductCategory
);

router.put(
  "/product/category/update/:id",
  upload.single("image"),
  EditProductCategory
);

router.get("/product/category/leaf", GetLeafProductCategories);
// router.get("/product/category/children/:parentId", GetChildCategories);
router.get("/product/category/:id", GetProductCategory);

//products
router.post(
  "/product/create",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  CreateProduct
);

router.get("/product", GetAllProducts);
router.get("/product/:slug", GetProducts);

module.exports = { router };
