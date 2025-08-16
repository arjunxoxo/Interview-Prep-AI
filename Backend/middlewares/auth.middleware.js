const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const protect = async (req, res, next) => {    
    try {
        let token = req.headers.authorization;
        if (token && token.startsWith("Bearer")) {
            token = token.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                return res.status(401).json({ message: "User not found" });
            }
            next();
        }else{
            return res.status(401).json({ message: "Not authorized, no token" });
        }
    } catch (error) {
        return res.status(401).json({ message: "Not authorized, token failed", error: error.message });
    }
}

module.exports = { protect };