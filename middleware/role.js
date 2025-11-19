// backend/middleware/role.js
module.exports = (...allowed) => {
  return (req, res, next) => {
    const role = req.user?.role;
    if (!allowed.includes(role)) return res.status(403).json({ message: "Access denied" });
    next();
  };
};
