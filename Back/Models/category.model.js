const mongoose = require("mongoose");
const { Schema } = mongoose;


const CategorySchema = new Schema(
  {
    name: { type: String, required: true },
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

CategorySchema.statics.fetchCategories = async function () {
  return this.find();
};

CategorySchema.statics.createCategory = async function (name) {
  return this.create({ name });
};

CategorySchema.statics.deleteCategoryById = async function (id) {
  return this.findByIdAndDelete(id);
};

CategorySchema.statics.updateCategoryById = async function (id, name) {
  return this.findByIdAndUpdate(id, { name }, { new: true });
};

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;
