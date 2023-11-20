const jwt = require("jsonwebtoken");
const { User } = require('../models');
const asyncHandler = require("express-async-handler");
const config = require('../config/config.json')

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      // Decodes token id
      const decoded = jwt.verify(token, config.auth.jwt_secret);
      // Assuming you are using Sequelize and the User model
      req.user = await User.findByPk(decoded.id, { attributes: { exclude: ['password'] } });

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = protect;

