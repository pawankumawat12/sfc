const { default: slugify } = require("slugify");
const ProductCategory = require("../../models/Products/ProductCategory");
const Product = require("../../models/Products/Product");

const CreateProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      productType,
      price,
      discountType,
      discountValue,
      stock,
      unlimitedStock,
      availabilityTime,
      isActive,
      isFeatured,
      displayOrder,
    } = req.body;
    if (!name || !category || !price || !productType) {
      return res.status(404).json({
        success: false,
        message: "Name, Category, productType and price must be required",
      });
    }
    const slug = slugify(name + "-", { lower: true });
    console.log(slug, "slug");
    const Existsproduct = await Product.findOne({ slug });
    if (Existsproduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product already exist" });
    }
    const categoryExists = await ProductCategory.findById(category);

    if (!categoryExists) {
      return res
        .status(404)
        .json({ success: false, message: "Category dose not exists" });
    }
    const hasChildren = await ProductCategory.exists({
      parentCategory: category,
    });

    if (hasChildren) {
      return res.status(400).json({
        success: false,
        message: "Please select a sub category",
      });
    }
    const priceNum = Number(price);
    let sellingPrice = priceNum;

    if (discountType === "percentage") {
      sellingPrice = priceNum - (priceNum * discountValue) / 100;
    }

    if (discountType === "flat") {
      sellingPrice = priceNum - discountValue;
    }

    if (sellingPrice < 0) sellingPrice = 0;
    if (!req.files?.thumbnail) {
      return res.status(400).json({
        success: false,
        message: "Thumbnail is required",
      });
    }

    const thumbnail = req.files?.thumbnail[0].path;
    let images = [];
    if (req.files?.images) {
      images = req.files.images.map((file) => file.path);
    }

    const product = await Product.create({
      name,
      slug,
      category,
      description,
      productType,
      thumbnail,
      images,
      price: priceNum,
      sellingPrice,
      discountType,
      discountValue,
      stock,
      unlimitedStock,
      availabilityTime,
      isActive,
      isFeatured,
      displayOrder,
    });
    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong during create product",
      error: error.message,
    });
  }
};

const GetAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      isActive,
      isFeatured,
      sort = "latest",
    } = req.query;

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    let filter = {
      isDeleted: false,
    };

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (category) {
      const categories = await ProductCategory.find({
        $or: [{ _id: category }, { parentCategory: category }],
      }).select("_id");

      filter.category = {
        $in: categories.map((c) => c._id),
      };
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    if (isFeatured !== undefined) {
      filter.isFeatured = isFeatured === "true";
    }

    let sortOption = {};
    if (sort === "price_low") sortOption.price = 1;
    else if (sort === "price_high") sortOption.price = -1;
    else sortOption.createdAt = -1;

    const products = await Product.find(filter)
      .populate("category")
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    const total = await Product.countDocuments(filter);

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: products,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong during get products",
      error: error.message,
    });
  }
};

const GetProducts = async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({ slug }).populate("category");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let relatedProducts = await Product.find({
      _id: { $ne: product._id },
      category: product.category._id,
      isActive: true,
      isDeleted: false,
    })
      .limit(8)
      .populate("category");

    if (relatedProducts.length < 8 && product.category.parentCategory) {
      const moreProducts = await Product.find({
        _id: { $ne: product._id },
        isActive: true,
        isDeleted: false,
      })
        .populate({
          path: "category",
          match: { parentCategory: product.category.parentCategory },
        })
        .limit(8 - relatedProducts.length);

      relatedProducts = [
        ...relatedProducts,
        ...moreProducts.filter((p) => p.category !== null),
      ];
    }

    return res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      product,
      relatedProducts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong during get product",
      error: error.message,
    });
  }
};

module.exports = { CreateProduct, GetAllProducts, GetProducts };
