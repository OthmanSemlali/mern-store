const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user:{
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    

      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
      email: {
        type: String,
      }
    },
    products: [
      {
        id: {
          type: String,
          ref: "Product",
        },
        name: {
          type: String,
        },
        optionColor: {
          type: String,
        },
        amount: {
          type: Number,
        },
        price: {
          type: Number,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    shipping: {
      type: Object,
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

orderSchema.statics.fetchOrders = async function (page, pageSize, filters) {
  const skip = (page - 1) * pageSize;
  console.log("skip", skip);
  

  // console.log("filters ", filters);

  const getOrdersQuery = this.find(filters)
    // .sort()
    .skip(skip)
    .limit(pageSize)
    // .select("slug name seodescription description image price");

  const getOrdersCount = this.countDocuments(filters);

  const [orders, totalOrders] = await Promise.all([
    getOrdersQuery.exec(),
    getOrdersCount.exec(),
  ]);

  return { orders, totalOrders };
};

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
