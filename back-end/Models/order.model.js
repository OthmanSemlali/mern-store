const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        id: {
          type: String,
          ref: "Product",
        },
        name:{
          type: String
        },
        optionColor:{
          type: String
        },
        amount:{
          type: Number
        },
        price:{
          type: Number
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    shipping: {
      type:Object,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["succeeded", "failed"],
      default: "succeeded",
    },
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

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
