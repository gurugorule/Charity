import axios from "axios";
import { DonationLog, CharityTransfer, LogsResponse } from "../types";

const API_URL = "http://localhost:5173/api";

// Log donation to backend
export const logDonation = async (
  donor: string,
  amount: string,
  txHash: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await axios.post(`${API_URL}/logs/donation`, {
      donor,
      amount,
      txHash,
    });
    return response.data;
  } catch (error) {
    console.error("Error logging donation:", error);
    return { success: false, error: "Failed to log donation" };
  }
};

// Log charity transfer to backend
export const logCharityTransfer = async (
  recipient: string,
  totalTransferred: string,
  txHash: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await axios.post(`${API_URL}/logs/charity-transfer`, {
      recipient,
      totalTransferred,
      txHash,
    });
    return response.data;
  } catch (error) {
    console.error("Error logging transfer:", error);
    return { success: false, error: "Failed to log transfer" };
  }
};

// Get all logs
export const getAllLogs = async (): Promise<LogsResponse> => {
  try {
    const response = await axios.get(`${API_URL}/logs/all`);
    return response.data;
  } catch (error) {
    console.error("Error fetching logs:", error);
    return {
      success: false,
      donations: [],
      transfers: [],
      error: "Failed to fetch logs",
    };
  }
};
