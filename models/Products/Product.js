const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    //    BASIC INFO
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductCategory",
      required: true,
    },

    description: {
      type: String,
    },

    productType: {
      type: String,
      enum: ["Veg", "Non-Veg"],
      required: true,
    },

    //    IMAGES
    thumbnail: {
      type: String,
      required: true,
    },

    images: [
      {
        type: String,
      },
    ],

    //    PRICING & OFFER
    price: {
      type: Number,
      required: true,
    },

    sellingPrice: {
      type: Number,
      required: true,
    },

    discountType: {
      type: String,
      enum: ["percentage", "flat"],
      default: null,
    },

    discountValue: {
      type: Number,
      default: 0,
    },

    //    STOCK & AVAILABILITY
    stock: {
      type: Number,
      default: 0,
    },

    stockStatus: {
      type: String,
      enum: ["In Stock", "Out of Stock", "Limited"],
      default: "In Stock",
    },

    unlimitedStock: {
      type: Boolean,
      default: false,
    },

    availabilityTime: {
      type: String,
      default: "All Day",
    },

    //VISIBILITY & CONTROL
    isActive: {
      type: Boolean,
      default: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    displayOrder: {
      type: Number,
      default: 0,
    },

    //    VARIANTS & ADDONS
    variants: [
      {
        name: String, // Small / Medium / Large
        price: Number,
      },
    ],

    //    TAX
    taxApplicable: {
      type: Boolean,
      default: false,
    },

    taxPercentage: {
      type: Number,
      default: 0,
    },

    //    AUDIT
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
