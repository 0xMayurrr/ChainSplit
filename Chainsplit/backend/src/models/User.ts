import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  address:     { type: String, required: true, unique: true },
  displayName: { type: String, default: "" },
  groups:      [{ type: String }],
  createdAt:   { type: Date, default: Date.now },
});

export default model("User", UserSchema);
