const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String, required: true },
    address: { type: {}, required: true },
    question: { type: String, required: true },
    role: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });
module.exports = mongoose.model("Users", userSchema);
