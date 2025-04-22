import express from "express";
import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";
import cors from "cors";

// Load environment variables
dotenv.config({ path: ".env" });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Database and Collections
let db;
let donationLogs;
let charityTransfers;

async function connectToMongo() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas!");

    db = client.db("charity-dapp");
    donationLogs = db.collection("donationlogs");
    charityTransfers = db.collection("charitytransfers");

    // Create indexes
    await donationLogs.createIndex({ txHash: 1 }, { unique: true });
    await charityTransfers.createIndex({ txHash: 1 }, { unique: true });
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

connectToMongo();

// Routes
app.post("/api/logs/donation", async (req, res) => {
  try {
    const { donor, amount, txHash } = req.body;
    const donation = {
      donor,
      amount,
      txHash,
      timestamp: new Date(),
    };
    const result = await donationLogs.insertOne(donation);
    res.status(201).json({ success: true, data: donation });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post("/api/logs/charity-transfer", async (req, res) => {
  try {
    const { recipient, totalTransferred, txHash } = req.body;
    const transfer = {
      recipient,
      totalTransferred,
      txHash,
      timestamp: new Date(),
    };
    const result = await charityTransfers.insertOne(transfer);
    res.status(201).json({ success: true, data: transfer });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get("/api/logs/all", async (req, res) => {
  try {
    const donations = await donationLogs
      .find()
      .sort({ timestamp: -1 })
      .toArray();
    const transfers = await charityTransfers
      .find()
      .sort({ timestamp: -1 })
      .toArray();
    res.status(200).json({ success: true, donations, transfers });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Graceful shutdown
process.on("SIGINT", async () => {
  try {
    await client.close();
    console.log("MongoDB connection closed.");
    process.exit(0);
  } catch (err) {
    console.error("Error during shutdown:", err);
    process.exit(1);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
