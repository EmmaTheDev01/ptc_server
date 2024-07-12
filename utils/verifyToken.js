import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const tokenFromCookie = req.cookies?.token;
  const tokenFromHeader = req.headers.authorization?.split(" ")[1];
  const token = tokenFromCookie || tokenFromHeader;

  console.log('Token from cookie:', tokenFromCookie);
  console.log('Token from header:', tokenFromHeader);
  console.log('Token:', token);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "You are not authorized to access this page",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      console.error('Token verification error:', err);
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
    req.user = user;
    next();
  });
};

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    console.log('User verification:', req.user);
    const { id, role } = req.user;
    if (id === req.params.id || role === "admin") {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this resource",
      });
    }
  });
};

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    console.log('Admin verification:', req.user);
    if (req.user.role === "admin") {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "Only admins can access this route",
      });
    }
  });
};
