const { validationResult } = require("express-validator");
const Category = require("../Models/category.model");

class CategoryController {
  async fetchCategories(req, res) {
    const {name,page,perPage} = req.query
    const search = {}

        
    if(name){
      search.name = {
        $regex: name,
        $options: 'i'
      }
    }
    try {
      const pageNumber = parseInt(page) || 1;
      const itemsPerPage = parseInt(perPage) || 7;
      const categories = await Category.fetchCategories(search,pageNumber,itemsPerPage);
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  }

  async createCategory(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("errors: ", errors);
      return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;

    try {
      const category = await Category.createCategory(name);
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  }
  async deleteCategoryById(req, res) {
    const { id } = req.params;

    try {
      const category = await Category.deleteCategoryById(id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  }

  async updateCategoryById(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("errors: ", errors);
      return res.status(400).json({ errors: errors.array() });
    }
    console.log("req.body", req.body);

    const { name } = req.body;
    const { id } = req.params;

    try {
      const category = await Category.updateCategoryById(id, name);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  }
}

module.exports = CategoryController;
