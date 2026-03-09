import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    // track where token was issued
    userAgent: String,
    ip: String,

    // mark old tokens as used
    isRevoked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// auto-delete expired tokens from DB
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);
export default RefreshToken;
