import { Schema, model } from "mongoose";

const GroupSchema = new Schema({
  vaultAddress: { type: String, required: true, unique: true },
  name:         { type: String, required: true },
  emoji:        { type: String, default: "💸" },
  admin:        { type: String, required: true },
  members:      [{ type: String }],
  createdAt:    { type: Date, default: Date.now },
});

export default model("Group", GroupSchema);
