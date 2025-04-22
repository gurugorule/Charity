import mongoose from "mongoose";

// Donation Log Schema
const donationLogSchema = new mongoose.Schema({
  donor: {
    type: String,
    required: true,
    index: true,
  },
  amount: {
    type: String,
    required: true,
  },
  txHash: {
    type: String,
    required: true,
    unique: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Charity Transfer Schema
const charityTransferSchema = new mongoose.Schema({
  recipient: {
    type: String,
    required: true,
  },
  totalTransferred: {
    type: String,
    required: true,
  },
  txHash: {
    type: String,
    required: true,
    unique: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Create models
export const DonationLog = mongoose.model("DonationLog", donationLogSchema);
export const CharityTransfer = mongoose.model(
  "CharityTransfer",
  charityTransferSchema
);
