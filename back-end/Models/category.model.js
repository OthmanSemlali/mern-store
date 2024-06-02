const mongoose = require("mongoose");
const { Schema } = mongoose;


const CategorySchema = new Schema(
  {
    name: { type: String, required: true },
    imageUrl: {type: String, }
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
      },
    },
  }
);

// CategorySchema.statics.fetchCategories = async function (search = {}, page = 1, perPage = 7) {
//   const skip = (page - 1) * perPage;
//   return this.find(search).skip(skip).limit(perPage);
// };
CategorySchema.statics.fetchPaginatedCategories = async function (search, page = 1, perPage = 6) {
  try {
   const skip = (page - 1) * perPage;
   
 
 
   const getCatgoriesQquery = this.find(search)
     .skip(skip)
     .limit(perPage)
 
   const getCountQuery = this.countDocuments(search)
 
   const [data, totalCategories] = await Promise.all([getCatgoriesQquery.exec(), getCountQuery.exec()]);
 
   return { data, totalCategories };
  } catch (error) {
 
   console.log('error', error)
   
  }
 };

 CategorySchema.statics.createCategory = async function (name, imageUrl) {
  console.log('name, imageUrl', name, imageUrl);
  try {
    return this.create({ name, imageUrl });
  } catch (error) {
    console.log('add cat model error', error);
  }
};

CategorySchema.statics.deleteCategoryById = async function (id) {
  return this.findByIdAndDelete(id);
};

CategorySchema.statics.updateCategoryById = async function (id, name, imageUrl) {
  return this.findByIdAndUpdate(id, { name, imageUrl }, { new: true });
};

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;
