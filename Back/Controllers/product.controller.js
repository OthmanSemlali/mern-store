const { validationResult } = require('express-validator');
const Product = require('../Models/product.model.js');
const { default: mongoose } = require('mongoose');


class ProductController {

    async fetchSingleProductByName(req, res) {
        const name = req.params.name;
        try {
            const product = await Product.fetchSingleProductByName(name);
            res.json(product)
        } catch (error) {

            if (error instanceof Error) {
                // res.status(500).json({ message: error.message });
                console.error('fetchSingleProductByName ', error.message)

            } else {
                res.status(500).json({ message: 'Server Error' });

            }
        }
    }

     async getRelatedProducts(req, res) {
        const { categoryID } = req.body
        try {
            const products = await Product.getRelatedProducts(categoryID)
            res.json(products)
        } catch (error) {
            if (error instanceof Error) {
                console.error('getRelatedProducts ', error.message)

            } else {
                res.status(500).json({ message: 'Server Error' });

            }
        }
    }

    async getFeaturedProducts(req, res){
        console.log('req.params.id')
        try {
            const products = await Product.getFeaturedProducts()
            res.json(products)
        } catch (error) {
            if (error instanceof Error) {
                console.error('getFeaturedProducts ', error.message)

            } else {
                res.status(500).json({ message: 'Server Error' });

            }
        }
    }
     async fetchPaginatedProducts(req, res) {

        const page = parseInt(req.params.page);
        const pageSize = parseInt(req.params.pageSize);


        try {
            const products = await Product.fetchPaginatedProducts(page, pageSize);

            const totalProducts = await Product.countDocuments();

            // console.log('fetchPaginatedPosts: ', posts);
            res.json({ products, totalProducts });
        } catch (error) {
            if (error instanceof Error) {
                console.error('fetchPaginatedProducts ', error.message)

            } else {
                res.status(500).json({ message: 'Server Error' });
            }
        }
    }


     async getCategoriesWithProductsCounts(req, res) {


        try {
            const categoriesWithCount = await Product.getCategoriesWithProductCounts()

            res.json(categoriesWithCount)
        } catch (error) {
            if (error instanceof Error) {
                console.error('getCategoriesWithProductsCounts ', error.message)

            } else {
                res.status(500).json({ message: 'Server Error' });

            }
        }
    }

     async fetchPaginatedProductsByCategory(req, res) {
        const categoryName = req.params.categoryName;
        const page = parseInt(req.params.page);
        const pageSize = parseInt(req.params.pageSize);
        try {

            const productsByCategory = await Product.fetchProductsByCategory(categoryName, page, pageSize);

            res.json(productsByCategory);
        } catch (error) {
            if (error instanceof Error) {
                console.error('fetchPaginatedProductsByCategory ', error.message)

            } else {
                res.status(500).json({ message: 'Server Error' });

            }
        }
    }


    async fetchProductsByPriceRange(req, res) {
        const minPrice = req.params.minPrice;
        const maxPrice = req.params.maxPrice;
        const page = parseInt(req.params.page);
        const pageSize = parseInt(req.params.pageSize);
        try {

            const productsByPriceRange = await Product.fetchProductsByPriceRange(page, pageSize, minPrice, maxPrice);

            res.json(productsByPriceRange);
        } catch (error) {
            if (error instanceof Error) {
                console.error('fetchProductsByPriceRange ', error.message)

            } else {
                res.status(500).json({ message: 'Server Error' });

            }
        }
    }

    
    

    async fetchProductById(req, res) {
        const _id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({ error: 'Invalid product ID' });
          }

        try {
            const product = await Product.fetchProductById(_id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.json(product);
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    }
     async createProduct(req, res) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('errors: ', errors);
            return res.status(400).json({ errors: errors.array() });
        }

        
        const { name, description, seoDescription, image,price, stock, size, options, style, tileUse, materials,featured,published, categoryID } = req.body;
        
        try {
            const product = await Product.createProduct(name, description, seoDescription, image,price, stock, size, options, style, tileUse, materials,featured,published, req.user.id, categoryID);
            res.status(201).json(product);
        } catch (error) {
            if (error instanceof Error) {
                console.error('createProduct ', error.message)
            } else {
                res.status(500).json({ message: 'Server Error' });

            }
        }
    }
     async deleteProductById(req, res) {
        const { id } = req.params;


        try {
            const product = await Product.deleteProductById(id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            res.json(product);
        } catch (error) {

            res.status(500).json({ message: 'Server Error' });
        }
    }

     async updateProductById(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid product ID' });
          }
        const { name, description, seoDescription, image,price, stock, size, options, style, tileUse, materials,featured,published} = req.body;
        try {
            const product = await Product.updateProductById(id, name, description, seoDescription, image,price, stock, size, options, style, tileUse, materials,featured,published);
            res.status(201).json(product);

        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    }


    updateProductStock = async (products) => {
        try {
          for (const productItem of products) {
            const product = await Product.findById(productItem.productID);
            if (!product) {
              throw new Error('Product not found');
            }
            // Update product stock
            product.stock -= productItem.quantity;
            await product.save();
          }
        } catch (error) {
          throw new Error(error.message);
        }
      };

      toggleVisibility = async (req, res) => {
        try {
            const {id} = req.params

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ error: 'Invalid product ID' });
              }
            const product = await Product.toggleProductVisibility(id)
            res.json(product.modifiedCount)
        } catch (error) {
            if (error instanceof Error) {
                console.error('toggleVisibility ', error.message)

            } else {
                res.status(500).json({ message: 'Server Error' });

            }
            
        }
      }
      
}
module.exports = new ProductController();
