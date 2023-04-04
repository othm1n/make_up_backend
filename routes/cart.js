const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = mongoose.model("Product");
const User = mongoose.model("User");

router.post("/user/:userId/cart", async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).lean().populate("cart.product");

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    const cartProductIndex = user.cart.findIndex((cartProduct) =>
      cartProduct.product._id.equals(productId)
    );

    if (cartProductIndex > -1) {
      user.cart[cartProductIndex].quantity += quantity;
      await User.updateOne(
        { _id: userId, "cart.product": productId },
        { $inc: { "cart.$.quantity": quantity } }
      );
    } else {
      user.cart.push({
        product: product._id,
        quantity,
      });
      await User.updateOne(
        { _id: userId },
        { $push: { cart: { product: productId, quantity } } }
      );
    }

    const updatedUser = await User.findById(userId).populate("cart.product");

    return res.status(200).json({
      message: "Product added to cart",
      user: updatedUser,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Server error",
    });
  }
});

module.exports = router;
