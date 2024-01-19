const jwt = require("jsonwebtoken");
require("dotenv").config();

const isAuthenticated = async (req, res, next) => {
    const token = req.headers.authorization || req.body.token || req.query.token;
    if (!token) {
        return res.status(401).json({ status: "error", error: "Invalid token or Token expired" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        console.log(err);
        return res.status(401).json({ status: "error", error: "Authentication error" });
    }
};

module.exports = isAuthenticated;
