import jwt from "jsonwebtoken";
import { logger } from "../../config/index.js";
import AuthService from "../../services/auth.service.js";

export const verifyToken = async (req, res, next) => {
    const authService = new AuthService();
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).send("Unauthorized");
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).send("Unauthorized");
        }
        logger.info(`decoded: ${JSON.stringify(decoded)}`);

        const user = await authService.getUserById(decoded.userId);
        if (!user) {
            return res.status(401).send("Unauthorized");
        }
        req.user = user;
        next();
    } catch (error) {
        logger.error(`Error in verifyToken: ${error.message}`);
        return res.status(401).send("Unauthorized");
    }
};