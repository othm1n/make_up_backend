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

    const cartProductIndex = user.cart.findIndex((cartProduct) => {
      return cartProduct.product._id == productId;
    });

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

router.put("/user/:userId/cart/:productId", async (req, res) => {
  const { userId, productId } = req.params;

  try {
    const user = await User.findById(userId).lean().populate("cart.product");

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const cartProductIndex = user.cart.findIndex((cartProduct) => {
      return cartProduct.product._id == productId;
    });

    if (cartProductIndex === -1) {
      return res.status(404).json({
        error: "Product not found in cart",
      });
    }

    user.cart.splice(cartProductIndex, 1);
    await User.updateOne(
      { _id: userId },
      { $pull: { cart: { product: productId } } }
    );

    const updatedUser = await User.findById(userId).populate("cart.product");

    return res.status(200).json({
      message: "Product removed from cart",
      user: updatedUser,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Server error",
    });
  }
});

router.put("/user/:userId/cart/:productId/quantity", async (req, res) => {
  const { userId, productId } = req.params;
  const { quantity } = req.body;

  try {
    const user = await User.findById(userId).lean().populate("cart.product");

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const cartProductIndex = user.cart.findIndex((cartProduct) => {
      return cartProduct.product._id == productId;
    });

    if (cartProductIndex === -1) {
      return res.status(404).json({
        error: "Product not found in cart",
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        error: "Quantity should be greater than 0",
      });
    }

    user.cart[cartProductIndex].quantity = quantity;
    await User.updateOne(
      { _id: userId, "cart.product": productId },
      { $set: { "cart.$.quantity": quantity } }
    );

    const updatedUser = await User.findById(userId).populate("cart.product");

    return res.status(200).json({
      message: "Cart quantity updated",
      user: updatedUser,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Server error",
    });
  }
});

router.post("/user/:userId/cart/checkout", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).lean().populate("cart.product");

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    if (user.cart.length === 0) {
      return res.status(400).json({
        error: "Cart is empty",
      });
    }

    await User.updateOne({ _id: userId }, { $set: { cart: [] } });

    const updatedUser = await User.findById(userId).populate("cart.product");

    return res.status(200).json({
      message: "Checkout completed successfully",
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
