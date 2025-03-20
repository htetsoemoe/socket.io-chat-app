import { logger } from "../../config/index.js";

export const errorHandler = (err, req, res, next) => {
    logger.error(`Error Handler: ${JSON.stringify(err)}`);
    const statusCode = err.statusCode || 500;
    const responseBody = {
        success: false,
        error: err,
        message: err.message || "Internal Server Error",
    };
    res.status(statusCode).json(responseBody);
};

export const notFoundHandler = (req, res, next) => {
    const error = new Error("API Route Not Found");
    error.statusCode = 404;
    next(error);
};
