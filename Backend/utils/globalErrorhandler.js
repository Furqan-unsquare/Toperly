import { ApiError } from "./ApiError.js";
import { ApiRes } from "./ApiRes.js";

export const globalErrorHandler = (error, req, res, next) => {
  console.log(error);
  if (!(error instanceof ApiError)) {
    return res.status(500).json(
      new ApiRes(
        500,
        null,
        error._message ?? error.message ?? "Internal Server Error"
      )
    );
  }

  // If it is an ApiError but still missing statusCode, fallback to 500
  const statusCode = error.statusCode || 500;
  const message = error.message || "Something went wrong";

  return res
    .status(statusCode)
    .json(new ApiRes(statusCode, error.data, message));
};
