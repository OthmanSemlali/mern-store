const { validationResult } = require("express-validator");
const Product = require("../Models/product.model.js");
const { default: mongoose } = require("mongoose");
const Category = require("../Models/category.model.js");

class ProductController {
  async fetchProductBySlug(req, res) {
    const slug = req.params.slug;
    try {
      const product = await Product.fetchSingleProductBySlug(slug);
      res.json(product);
    } catch (error) {
      if (error instanceof Error) {
        // res.status(500).json({ message: error.message });
        console.error("fetchSingleProductBySlug ", error.message);
      } else {
        res.status(500).json({ message: "Server Error" });
      }
    }
  }
  async fetchProductsByName(req, res) {
    const name = req.params.name;

    console.log("name", name); return
    try {
      const product = await Product.fetchProductsByName(name);
      res.json(product);
    } catch (error) {
      if (error instanceof Error) {
        // res.status(500).json({ message: error.message });
        console.error("fetchProductsByName ", error.message);
      } else {
        res.status(500).json({ message: "Server Error" });
      }
    }
  }

  async getRelatedProducts(req, res) {
    const { categoryID } = req.body;
    try {
      const products = await Product.getRelatedProducts(categoryID);
      res.json(products);
    } catch (error) {
      if (error instanceof Error) {
        console.error("getRelatedProducts ", error.message);
      } else {
        res.status(500).json({ message: "Server Error" });
      }
    }
  }

  async getFeaturedProducts(req, res) {
    console.log("req.params.id");
    try {
      const products = await Product.getFeaturedProducts();
      res.json(products);
    } catch (error) {
      if (error instanceof Error) {
        console.error("getFeaturedProducts ", error.message);
      } else {
        res.status(500).json({ message: "Server Error" });
      }
    }
  }

  async fetchPaginatedProducts(req, res) {
    const {
      page = 1,
      pageSize = 6,
      category,
      // minPrice,
      maxPrice,
      style,
      tileUse,
      materials,
      searchQuery
    } = req.query;
    console.log("req.query", req.query);

    const filters = {};

    if (category) {
      //   filters.category = category;

      try {
        const foundCategory = await Category.findOne({ name: category });
        if (foundCategory) {
          filters.categoryID = foundCategory.id;
        }
      } catch (error) {
        console.error("Error finding category:", error);
        res.status(500).json({ error: "Internal server error" });
        return;
      }
    }
    if (maxPrice) {
      filters.price = { $gte: 1, $lte: parseInt(maxPrice) };
    }
    if (style) {
      filters.style = style;
    }
    if (tileUse) {
      filters.tileUse = tileUse;
    }
    if (materials) {
      filters.materials = materials;
    }

    if(searchQuery !== 'undefined'){

      filters.name = {$regex: searchQuery, $options: 'i'}
    }
    try {
      const response = await Product.fetchPaginatedProducts(
        parseInt(page),
        parseInt(pageSize),
        filters
      );
      //   const totalProducts = await Product.countDocuments();
      res.json({ response });
    } catch (error) {
      if (error instanceof Error) {
        console.error("fetchPaginatedProducts ", error.message);
      } else {
        res.status(500).json({ message: "Server Error" });
      }
    }
  }

  async getCategoriesWithProductsCounts(req, res) {
    try {
      const categoriesWithCount =
        await Product.getCategoriesWithProductCounts();

      res.json(categoriesWithCount);
    } catch (error) {
      if (error instanceof Error) {
        console.error("getCategoriesWithProductsCounts ", error.message);
      } else {
        res.status(500).json({ message: "Server Error" });
      }
    }
  }


  async fetchProductById(req, res) {
    const _id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    try {
      const product = await Product.fetchProductById(_id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  }
  async createProduct(req, res) {
    console.log("create new product", req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(" validation errors create pro: ", errors);
      return;
      // return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      description,
      image,
      price,
      stock,
      size,
      options,
      style,
      tileUse,
      materials,
      featured,
      published,
      categoryID,
    } = req.body;

    console.log('req.body create pro', req.body)

    try {
      const product = await Product.createProduct(
        name,
        description,
        image,
        price,
        stock,
        size,
        options,
        style,
        tileUse,
        materials,
        featured,
        published,
        req.user.id,
        categoryID
      );
      res.status(201).json(product);
    } catch (error) {
     
        res.status(500).json({ message: "Server Error" });
     
    }
  }
  async deleteProductById(req, res) {
    const { id } = req.params;
    try {
      const product = await Product.deleteProductById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  }

  async updateProductById(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }
    const {
      name,
      description,
      seoDescription,
      image,
      price,
      stock,
      size,
      options,
      style,
      tileUse,
      materials,
      featured,
      published,
    } = req.body;
    try {
      const product = await Product.updateProductById(
        id,
        name,
        description,
        seoDescription,
        image,
        price,
        stock,
        size,
        options,
        style,
        tileUse,
        materials,
        featured,
        published
      );
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  }

  updateProductStock = async (products) => {
    try {
      for (const productItem of products) {
        const product = await Product.findById(productItem.id);
        if (!product) {
          throw new Error("Product not found");
        }
        // Update product stock
        product.stock -= productItem.amount;
        await product.save();
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };

  toggleVisibility = async (req, res) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }
      const product = await Product.toggleProductVisibility(id);
      res.json(product.modifiedCount);
    } catch (error) {
      if (error instanceof Error) {
        console.error("toggleVisibility ", error.message);
      } else {
        res.status(500).json({ message: "Server Error" });
      }
    }
  };


  distinctFilters = async (req, res) => {
    try {
      const distinctStyles = await Product.distinct('style');
      const distinctMaterials = await Product.distinct('materials');
      const distinctTileUses = await Product.distinct('tileUse');

      res.json({
        styles: distinctStyles,
        materials: distinctMaterials,
        tileUse: distinctTileUses
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }


}
module.exports = new ProductController();
