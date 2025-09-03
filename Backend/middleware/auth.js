const jwt = require("jsonwebtoken");
const User = require("../models/User");


async function auth(req, res, next) {
  try {
    const hdr = req.headers.authorization || "";
    const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const user = await User.findById(payload.id);
    if (!user || user.active === false) {
      return res.status(401).json({ message: "Invalid user or inactive account" });
    }


    req.user = {
      id: user._id.toString(),
      role: user.role,
      name: user.name,
      email: user.email,
    };

    return next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

function permit(...roles) {
  return function (req, res, next) {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    }
    return next();
  };
}

module.exports = { auth, permit };
