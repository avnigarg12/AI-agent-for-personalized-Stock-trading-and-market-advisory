import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    // Adding optional fields relevant to a trading app
    riskTolerance: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    accountBalance: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt fields
  }
);

const User = mongoose.model("User", userSchema);

export default User;
