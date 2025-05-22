const jwt = require("jsonwebtoken");

const secretKey = "kajdsfafkgfaka344*(&^&^%^^*&(*(&"; // Store this in environment variables


const authMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        return res.status(401).json({ status: false, message: "Access denied. No token provided." });
    }

    // Extract token from "Bearer <token>"
    const tokenParts = authHeader.split(' ');
    const token = tokenParts.length === 2 ? tokenParts[1] : authHeader;

    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ status: false, message: "Invalid token." });
    }
};

module.exports = authMiddleware;