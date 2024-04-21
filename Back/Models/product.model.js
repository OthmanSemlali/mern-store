const mongoose = require("mongoose");
const { Schema } = mongoose;
const Category = require("./category.model");
const { ObjectId } = require('bson');


const ProductShcema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    seodescription: { type: String },
    image: { type: String, require: true },
    price:{type: Number, reqiured:true },
    stock:{type: Number,  reqiured:true },
    size:{type: Object,  reqiured:true },

    // options: dispo colors with images each
    options:{type:Object, required:true},
    // color:{type:Object, required:true},

    //modern/classic etc..
    style:{type:String, required:true},
    // shower/bathroom..
    tileUse:{type:String, required:true},
    materials:{type:String, required:true},
    featured:{type:Boolean, required:true},
    published:{type:Boolean, required:true},
    sellerID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    categoryID: { type: Schema.Types.ObjectId, ref: 'Category', required: true }


},
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: function (doc, ret, options) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
                return ret;
            }
        }
    });



ProductShcema.index({ name: 1 });


class ProductClass {

    static async fetchProductById(_id){
        try {
            const product = await this.findOne({ _id: _id })
            // .populate('sellerID', 'email')
            // .populate('categoryID', 'name')
            .exec();
       
            return product;
        } catch (error) {
            console.error("Error fetching product by id:", error);
            throw new Error("Failed to fetch post by id");
        }
    }
     static async fetchSingleProductByName(name) {

        // console.log('name', name)
        try {
            const product = await this.findOne({ name }).populate('sellerID', 'username').populate('categoryID', 'name').exec();
            return product;
        } catch (error) {
            console.error("Error fetching product by name:", error);
            throw new Error("Failed to fetch post by name");
        }
    }

     static async getRelatedProducts(categoryID) {

        const relatedPosts = await this.find({
            categoryID: categoryID
        }).limit(3).select('name');

        return relatedPosts;
    }

    static async getFeaturedProducts() {
        return await this.find({ featured: true }).select('name seodescription image').exec();;
    }
    

    static async toggleProductVisibility(_id) {
        const product = await this.findOne({_id});
        const updatedVisibility = !product.published;
        return await this.updateOne({_id}, { $set: { 'published': updatedVisibility } });
    }
    

     static async getCategoriesWithProductCounts() {
        try {
            const categoriesWithCounts = await this.aggregate([
                {
                    $group: {
                        _id: '$categoryID',
                        count: { $sum: 1 }
                    }
                },
                {
                    $lookup: {
                        from: 'categories',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'category'
                    }
                },
                {
                    $project: {
                        _id: 0,
                        category: { $arrayElemAt: ['$category.name', 0] },
                        count: 1
                    }
                }
            ]);

            return categoriesWithCounts;
        } catch (error) {
            console.error('Error retrieving categories with product counts:', error);
            throw error;
        }
    }
 

     static async fetchPaginatedProducts(page, pageSize) {
        const skip = (page - 1) * pageSize;

       
        return await this.find()
            .skip(skip)
            .limit(pageSize)
            // .populate('categoryID', 'name')
            // .populate('sellerID', 'username')
            .select('name seodescription image')
            .exec();
    }

     static async fetchProductsByCategory(categoryName, page, pageSize) {
        const category = await Category.findOne({ name: categoryName });
        if (!category) {
            console.log("category not found");

            // throw new Error('Category not found');

            return null

        }

        console.log("category found", category);


        const skip = (page - 1) * pageSize;

        // First query to fetch paginated posts
        const productsQuery = this.find({ categoryID: category._id })
            .skip(skip)
            .limit(pageSize)
            // .populate('sellerID', 'username')
            .select('name seodescription image');

        const countQuery = this.countDocuments({ categoryID: category._id });

        const [products, totalPosts] = await Promise.all([productsQuery.exec(), countQuery.exec()]);

        // console.log('posts by cat ', posts)
        return { products, totalPosts };

    }

    static async fetchProductsByPriceRange(page, pageSize, minPrice, maxPrice) {
        const skip = (page - 1) * pageSize;
    
        const productsQuery = this.find({
            price: { $gte: minPrice, $lte: maxPrice }
        })
            .skip(skip)
            .limit(pageSize)
            .select('name seodescription image price'); // Adjust the fields selected as needed
    
        const countQuery = this.countDocuments({
            price: { $gte: minPrice, $lte: maxPrice }
        });
    
        const [products, totalProducts] = await Promise.all([productsQuery.exec(), countQuery.exec()]);
    
        return { products, totalProducts };
    }
    

    static createProduct(name, description, seodescription, image,price, stock, size, options, style, tileUse, materials,featured,published, sellerID, categoryID) {
        return this.create({ name, description, seodescription, image,price, stock, size, options, style, tileUse, materials,featured,published, sellerID, categoryID });
    }
    static deleteProductById(_id) {
        return this.findOneAndDelete({ _id });
    }

    static async updateProductById(_id, name, description, seodescription, image,price, stock, size, options, style, tileUse, materials,featured,published) {
        return await this.findOneAndUpdate({ _id }, { name, description, seodescription, image,price, stock, size, options, style, tileUse, materials,featured,published });
    }


}

ProductShcema.loadClass(ProductClass);

const Product = mongoose.model('Product', ProductShcema);
module.exports = Product;