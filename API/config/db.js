import mongoose from "mongoose";
import env from "../config/env.js";

const mongoOptions = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
};

const RETRY_CONFIG = {
  retries: 5,
  initialDelay: 2000,
  maxDelay: 30000,
};

const uri = env.MONGO_URI;

//  Helper
const wait = (ms) => new Promise((res) => setTimeout(res, ms));

const getDelay = (attempt, initialDelay, maxDelay) => {
  const exponential = initialDelay * Math.pow(2, attempt);
  const jitter = Math.random() * 1000;
  return Math.min(exponential + jitter, maxDelay);
};

//  Event Listeners
const registerConnectionEvents = () => {
  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected");
  });

  mongoose.connection.on("reconnected", () => {
    console.log("MongoDB reconnected");
  });

  mongoose.connection.on("error", (err) => {
    console.error(` MongoDB error: ${err.message}`);
  });
};

// Graceful Shutdown
const registerShutdownHooks = () => {
  const shutdown = async (signal) => {
    console.log(`\n${signal} received. Closing MongoDB connection...`);
    await mongoose.connection.close();
    console.log("MongoDB connection closed. Exiting.");
    process.exit(0);
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
};

// Connection with retry
const connectWithRetry = async (uri, retries, initialDelay, maxDelay) => {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const conn = await mongoose.connect(uri, mongoOptions);
      console.log(`MongoDB connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      const attemptsLeft = retries - attempt - 1;
      const isLastAttempt = attemptsLeft === 0;

      if (isLastAttempt) {
        console.error(
          `All ${retries} connection attempts failed. Shutting down.`,
        );
        process.exit(1);
      }

      const delay = getDelay(attempt, initialDelay, maxDelay);
      console.warn(
        `Connection attempt ${attempt + 1}/${retries} failed: ${error.message}`,
      );
      console.warn(
        `   Retrying in ${(delay / 1000).toFixed(1)}s... (${attemptsLeft} attempts left)`,
      );

      await wait(delay);
    }
  }
};

const connectDB = async () => {
  const { retries, initialDelay, maxDelay } = RETRY_CONFIG;

  console.log(` Connecting to MongoDB (max ${retries} attempts)...`);

  await connectWithRetry(uri, retries, initialDelay, maxDelay);

  registerConnectionEvents();
  registerShutdownHooks();
};

export default connectDB;
