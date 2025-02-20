const express = require('express');
const router = express.Router();
const Product = require('../models/product.model');
const { auth, isAdmin } = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Add new product (Admin only)
router.post("/admin/products", auth, isAdmin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      stock,
      imageUrl,
      benefits,
      ingredients,
      dosage,
      manufacturer
    } = req.body;

    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({ 
        success: false,
        message: "Please provide all required fields" 
      });
    }

    const newProduct = new Product({
      name,
      description,
      price: Number(price),
      category,
      stock: Number(stock),
      imageUrl,
      benefits,
      ingredients,
      dosage,
      manufacturer
    });

    await newProduct.save();
    
    res.status(201).json({ 
      success: true,
      message: "Product added successfully!",
      product: newProduct 
    });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ 
      success: false,
      message: "Failed to add product",
      error: error.message 
    });
  }
});

// Get all products
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ 
      success: true,
      products 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch products",
      error: error.message 
    });
  }
});

// Get single product
router.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: "Product not found" 
      });
    }
    res.status(200).json({ 
      success: true,
      product 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch product",
      error: error.message 
    });
  }
});

// Update product
router.put("/admin/products/:id", auth, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: "Product not found" 
      });
    }
    res.status(200).json({ 
      success: true,
      message: "Product updated successfully",
      product 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Failed to update product",
      error: error.message 
    });
  }
});

// Delete product
router.delete("/admin/products/:id", auth, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: "Product not found" 
      });
    }
    res.status(200).json({ 
      success: true,
      message: "Product deleted successfully" 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Failed to delete product",
      error: error.message 
    });
  }
});

module.exports = router;
