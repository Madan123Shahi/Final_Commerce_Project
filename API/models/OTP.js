import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    otpHash: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["emailVerification", "phoneVerification", "passwordReset"],
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      expires: 0, // TTL index (auto delete after expiry)
    },

    attempts: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const OTP = mongoose.model("OTP", otpSchema);

export default OTP;
