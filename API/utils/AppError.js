// Custom error class — carries statusCode with the error
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true; // known errors

    Error.captureStackTrace(this, this.constructor);
  }
}
