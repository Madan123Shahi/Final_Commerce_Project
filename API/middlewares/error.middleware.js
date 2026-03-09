import { AppError } from "../utils/AppError.js";

// ─── MongoDB error handlers ────────────────────────────────
const handleCastError = (err) =>
  new AppError(`Invalid ${err.path}: ${err.value}`, 400);

const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  return new AppError(
    `${field} already exists. Please use a different value.`,
    400,
  );
};

const handleValidationError = (err) => {
  const messages = Object.values(err.errors).map((e) => e.message);
  return new AppError(`Validation failed: ${messages.join(". ")}`, 400);
};

// ─── JWT error handlers ────────────────────────────────────
// ✅ only here — auth.middleware throws raw JWT errors
// and these handlers catch + convert them
const handleJWTError = () =>
  new AppError("Invalid token. Please log in again.", 401);

const handleJWTExpiredError = () =>
  new AppError("Your session has expired. Please log in again.", 401);

// ─── Dev response — full details ──────────────────────────
const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

// ─── Prod response — safe details only ────────────────────
const sendProdError = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
    });
  } else {
    // unknown error — don't leak internals to client
    console.error("UNEXPECTED ERROR:", err);
    res.status(500).json({
      success: false,
      status: "error",
      message: "Something went wrong. Please try again later.",
    });
  }
};

// ─── Global Error Handler ─────────────────────────────────
export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendDevError(err, res);
  } else {
    let error = { ...err, message: err.message };

    // MongoDB errors
    if (err.name === "CastError") error = handleCastError(err);
    if (err.code === 11000) error = handleDuplicateKeyError(err);
    if (err.name === "ValidationError") error = handleValidationError(err);

    // JWT errors — raw errors thrown by jwt.verify() in auth.middleware
    if (err.name === "JsonWebTokenError") error = handleJWTError();
    if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendProdError(error, res);
  }
};

// ─── 404 Handler ──────────────────────────────────────────
export const notFound = (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
};
