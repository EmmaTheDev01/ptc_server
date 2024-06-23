import jwt, { verify } from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "You are not authorised to access this page",
    });
  }
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
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
  verifyToken(req, res, next, () => {
    const { id, role } = req.user;
    if (id === req.params.id || role === "admin") {
      next();
    } else {
      return res.status(401).json({
        success: false,
        message: "You are not authenticated",
      });
    }
  });
};

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.role === "admin") {
      return next();
    }

    return res.status(401).json({
      success: false,
      message: "You are not authorized only admin can access this route",
    });
  });
};
