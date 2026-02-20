const { default: slugify } = require("slugify");
const ProductCategory = require("../../models/Products/ProductCategory");
const cloudinary = require("../../config/cloudinary");
//create categories
const CreateProductCategory = async (req, res) => {
  try {
    const { name, parentCategory, isActive, displayOrder, visibility } =
      req.body;
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Name is required" });
    }
    const slug = slugify(name + "-", { lower: true });
    const existSlug = await ProductCategory.findOne({ slug });

    if (existSlug) {
      return res
        .status(400)
        .json({ success: false, message: "Category already exist" });
    }
    let level = 0;
    if (parentCategory) {
      let parent = await ProductCategory.findById(parentCategory);
      if (!parent) {
        return res
          .status(404)
          .json({ success: false, message: "Parent category not found" });
      }
      level = parent.level + 1;
    }
    // let imageData = null;
    // if (req.file) {
    //   const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
    //     folder: "ProductCategories",
    //   });

    //   imageData = {
    //     url: uploadedImage.secure_url,
    //     public_id: uploadedImage.public_id,
    //   };
    // }

    const productCategory = await ProductCategory.create({
      name,
      slug,
      // image: imageData,
      parentCategory: parentCategory || null,
      level,
      isActive,
      displayOrder,
      visibility,
    });
    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: productCategory,
    });
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong during adding category",
      error: error.message,
    });
  }
};

//get all categories
const ProductCategories = async (req, res) => {
  try {
    const categories = await ProductCategory.find()
      .sort({
        displayOrder: 1,
      })
      .populate("parentCategory", "name");
    if (!categories) {
      return res.status(200).json({ message: "Category not found" });
    }
    return res.status(200).json({
      success: true,
      message: "All categories",
      Categories: categories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong during found categories",
      error: error.message,
    });
  }
};

//getbyid
const GetProductCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const productCategory = await ProductCategory.findById(id);
    if (!productCategory) {
      return res
        .status(400)
        .json({ success: false, message: "Product category not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Product category get successfully",
      Category: productCategory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong during get product category",
      error: error.message,
    });
  }
};

//edit category
const EditProductCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, parentCategory, isActive, displayOrder, visibility } =
      req.body;

    if (!name) {
      return res
        .status(404)
        .json({ success: false, message: "Name is required" });
    }

    if (parentCategory && parentCategory.toString() === id) {
      return res.status(400).json({
        success: false,
        message: "Category cannot be its own parent",
      });
    }

    const category = await ProductCategory.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // IMAGE UPDATE
    if (req.file) {
      if (category.image?.public_id) {
        await cloudinary.uploader.destroy(category.image.public_id);
      }
      category.image = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    // UPDATE DATA
    const updateData = {
      name,
      slug: slugify(name, { lower: true }),
    };

    let level = 0;

    if (parentCategory) {
      const parent = await ProductCategory.findById(parentCategory);
      level = parent ? parent.level + 1 : 0;
    }

    updateData.level = level;

    if (parentCategory) {
      updateData.parentCategory = parentCategory;
    } else {
      updateData.parentCategory = null;
    }

    if (isActive !== undefined) updateData.isActive = isActive;
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;
    if (visibility !== undefined) updateData.visibility = visibility;

    category.set(updateData);
    await category.save();

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong during edit product category",
      error: error.message,
    });
  }
};

const GetLeafProductCategories = async (req, res) => {
  try {
    const parentIds = await ProductCategory.distinct("parentCategory");

    const leafCategories = await ProductCategory.find({
      _id: { $nin: parentIds },
      isActive: true,
    }).sort({ displayOrder: 1 });

    return res.status(200).json({
      success: true,
      Categories: leafCategories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch leaf categories",
    });
  }
};

module.exports = {
  CreateProductCategory,
  ProductCategories,
  EditProductCategory,
  GetProductCategory,
  GetLeafProductCategories,
};
