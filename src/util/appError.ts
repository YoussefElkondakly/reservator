export default class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: Boolean;
  constructor(message: string, statusCod: number) {
    super(message);
    this.statusCode = statusCod;
    this.status = `${statusCod}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
