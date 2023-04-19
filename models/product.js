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
    reviews: [
      {
        name: {
          type: String,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        date: {
          type: Date,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

productSchema.virtual("sale_price").get(function () {
  if (this.onsale) {
    return ((this.price * (100 - this.salePercent)) / 100).toFixed(2);
  }
  return this.price.toFixed(2);
});

productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

mongoose.model("Product", productSchema);
