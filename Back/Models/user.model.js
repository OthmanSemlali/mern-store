const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
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
  static fetchUserById(id) {
    return this.findById(id);
  }

  // static async createUser(email, password, role) {
  //     // const hashedPassword = await bcrypt.hash(password, 10);
  //     return this.create({ email, password });
  // }

  // static async checkCredentials(email, password){
  //     const user = await this.findOne({ email });
  //     if (user && await bcrypt.compare(password, user.password)) {
  //         return user;
  //     } else {
  //         return null;
  //     }
  // }
  static async getUserByEmail(email) {
    return this.findOne({ email });
  }

  // static getUserByGoogleId = async (googleId: string): Promise<IUser | null> => {
  //     return this.findOne({ googleId });
  // }

  static async addUser(user) {
    return this.create(user);
  }
}

UserSchema.statics.getUserByGoogleId = async function (googleId) {
  return this.findOne({ googleId });
};

UserSchema.loadClass(UserClass);

const User = mongoose.model("User", UserSchema);


module.exports = User;
