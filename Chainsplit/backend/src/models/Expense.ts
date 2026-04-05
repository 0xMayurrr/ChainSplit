import { Schema, model } from "mongoose";

const ExpenseSchema = new Schema({
  vaultAddress: { type: String, required: true },
  expenseId:    { type: Number, required: true },
  name:         { type: String, required: true },
  amount:       { type: String, required: true },
  paidBy:       { type: String, required: true },
  category:     { type: Number, default: 0 },
  splitAmong:   [{ type: String }],
  shares:       [{ type: String }],
  isEqual:      { type: Boolean, default: true },
  isDeleted:    { type: Boolean, default: false },
  timestamp:    { type: Date, default: Date.now },
  ipfsCid:      { type: String, default: null },
});

export default model("Expense", ExpenseSchema);
