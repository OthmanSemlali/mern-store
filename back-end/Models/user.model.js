const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: { type: String, require: true },
    password: { type: String, require: true },
    role: { type: String, enum: ["user", "seller", "admin", "no_role"], required: true },
    displayName: { type: String },
    googleId: { type: String },
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

class UserClass {
  static fetchUserById(_id) {
    return this.findById(_id);
  }



  static async getUserByEmail(email) {
    return this.findOne({ email });
  }

  // static getUserByGoogleId = async (googleId: string): Promise<IUser | null> => {
  //     return this.findOne({ googleId });
  // }

  static async addUser(user) {
    const userr =  this.create(user);

    if(userr){
      return {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    }else{
      return null
    }
  }
}

UserSchema.statics.getUserByGoogleId = async function (googleId) {
  return this.findOne({ googleId });
};

UserSchema.statics.fetchUsers = async function (page, pageSize, search) {
  const skip = (page - 1) * pageSize;

  const getUsersQuery = this.find(search)
    .skip(skip)
    .limit(pageSize)
    .select("firstName lastName email role createdAt");

  const getUsersCount = this.countDocuments(search);

  const [users, totalUsers] = await Promise.all([
    getUsersQuery.exec(),
    getUsersCount.exec(),
  ]);

  return { users, totalUsers };
};

UserSchema.loadClass(UserClass);

const User = mongoose.model("User", UserSchema);


module.exports = User;
