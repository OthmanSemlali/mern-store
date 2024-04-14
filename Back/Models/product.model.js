const mongoose = require("mongoose");
const { Schema } = mongoose;
const Category = require("./category.model");
const { ObjectId } = require('bson');


const ProductShcema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    seodescription: { type: String },
    readTime: { type: String },
    image: { type: String, require: true },
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
            const product = await this.findOne({ _id: new mongoose.Types.ObjectId(_id) })
            // .populate('sellerID', 'email')
            // .populate('categoryID', 'name')
            .exec();
            // if(product){
            //     return product;

            // }else{
            //     return null
            // }
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

   

    static createProduct(name, description, seodescription, image, sellerID, categoryID) {
        return this.create({ name, description, seodescription, image, sellerID, categoryID });
    }
    static deleteProductById(_id) {
        return this.findOneAndDelete({ _id });
    }

    static async updateProductById(_id, name, description, seodescription, image) {
        return await this.findOneAndUpdate({ _id }, { name, description, seodescription, image });
    }


}

ProductShcema.loadClass(ProductClass);

const Product = mongoose.model('Product', ProductShcema);
module.exports = Product;