import express from "express";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import env from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";
import { errorHandler, notFound } from "./middlewares/error.middleware.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // needed to read req.cookies

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);

// Routes
app.use("/api/auth", authRoutes);

const registerProcessHandlers = (server) => {
  process.on("uncaughtException", (err) => {
    console.error(`Uncaught Exception: ${err.message}`);
    process.exit(1);
  });

  process.on("unhandledRejection", (reason) => {
    console.error(`Unhandled Rejection: ${reason}`);
    process.exit(1);
  });

  const shutdown = (signal) => {
    console.log(`\n${signal} received. Shutting down HTTP server...`);

    server.close(() => {
      console.log("HTTP server closed");
      process.exit(0);
    });

    // force kill if graceful shutdown hangs
    setTimeout(() => {
      console.error("Forced shutdown after timeout");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
};

//
app.use(notFound);
app.use(errorHandler);

const start = async () => {
  try {
    await connectDB();

    const server = app.listen(env.PORT, () => {
      console.log(`Server running on PORT: ${env.PORT}`);
    });

    registerProcessHandlers(server);
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

start();
