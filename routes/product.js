const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = mongoose.model("Product");

router.post("/addproduct", async ({ body }, res) => {
  const {
    name,
    description,
    category,
    price,
    rating,
    images,
    onsale,
    salePercent,
    colors,
    sizes,
  } = body;

  if (
    ![
      name,
      description,
      category,
      price,
      rating,
      images,
      onsale,
      salePercent,
      colors,
      sizes,
    ].every(Boolean)
  ) {
    return res.status(422).json({
      error: "Please add all the fields",
    });
  }

  try {
    const product = new Product({
      name,
      description,
      category,
      price,
      rating,
      images,
      onsale,
      salePercent,
      colors,
      sizes,
    });
    const result = await product.save();
    res.json({
      product: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/products/search", async (req, res) => {
  try {
    const { query } = req.query;
    const products = await Product.find({
      name: { $regex: query, $options: "i" },
    });
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/products", async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const relatedProducts = await Product.find({ category: product.category })
      .where("_id")
      .ne(product._id)
      .limit(4);

    const response = {
      product,
      relatedProducts,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/products/:id/reviews", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const { name, comment, rating } = req.body;
    const review = { name, comment, rating, date: Date.now() };
    product.reviews.push(review);
    await product.save();

    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
