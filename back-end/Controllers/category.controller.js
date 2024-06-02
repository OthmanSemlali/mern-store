const { validationResult } = require("express-validator");
const Category = require("../Models/category.model");

class CategoryController {

  async fetchCategories (req, res){
    const categories = await Category.find()

    console.log('categories', categories)
    res.json(categories)
  }
  async fetchPaginatedCategories(req, res) {
    const {searchQuery,page,perPage} = req.query
    const search = {}

        
    if(searchQuery && searchQuery != 'undefined'){
      search.name = {
        $regex: searchQuery,
        $options: 'i'
      }
    }
    try {
      const pageNumber = parseInt(page) || 1;
      const itemsPerPage = parseInt(perPage) || 6;
  
      const response = await Category.fetchPaginatedCategories(
        search,
        pageNumber,
        itemsPerPage
        
      );
      res.json({ response });
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

    const { name, imageUrl } = req.body;

    console.log('iiii req.body', req.body)

    try {
      const category = await Category.createCategory(name, imageUrl);
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ message: "add category Server Error" });
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

    const { name, imageUrl } = req.body;
    const { id } = req.params;

    try {
      const category = await Category.updateCategoryById(id, name, imageUrl);
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
