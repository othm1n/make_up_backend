const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    onsale: {
      type: Boolean,
      required: true,
    },
    salePercent: {
      type: Number,
      required: false,
    },
    colors: [
      {
        type: String,
        required: true,
      },
    ],
    sizes: [
      {
        type: String,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

mongoose.model("Product", productSchema);
