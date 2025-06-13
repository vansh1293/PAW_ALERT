import mongoose, { Document, Schema } from "mongoose";

export interface User extends Document {
  username: string;
  password: string;
  email: string;
  isVerified: boolean;
  verifyCode?: string;
  verifyCodeExpires?: Date;
  resetCode?: string;
  resetCodeExpires?: Date;
  EarnedPoints: number;
  rescues?: mongoose.Types.ObjectId[];
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    match: [
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
      "Please use a valid email address",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  verifyCode: {
    type: String,
  },
  verifyCodeExpires: {
    type: Date,
  },
  resetCode: {
    type: String,
  },
  resetCodeExpires: {
    type: Date,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  EarnedPoints: {
    type: Number,
    default: 0,
  },
  rescues: [
    {
      type: Schema.Types.ObjectId,
      ref: "Rescues",
    },
  ],
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);
export default UserModel;
