// sets up mongoose for the database connection
const mongoose = require("mongoose");
// sets up the schema for the database
const Schema = mongoose.Schema;
// sets up a transaction schema
const transactionSchema = new Schema(
  {
    // a name for the transaction
    name: {
      type: String,
      trim: true,
      required: "Transaction Name"
    },
    // a value for the transaction - it can either be positive or negative
    value: {
      type: Number,
      required: "Amount"
    },
    // "now" as the transaction date
    date: {
      type: Date,
      default: Date.now
    }
  }
);
// sets up the transaction class
const Transaction = mongoose.model("Transaction", transactionSchema);
// exports the transaction module
module.exports = Transaction;
