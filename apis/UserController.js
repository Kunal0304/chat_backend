const { Op } = require('sequelize');
const { User } = require('../models');
const bcrypt = require('bcrypt');
const generateToken = require("../config/generateToken");

//@description     Get or Search all users
//@route           GET /api/user?search=
//@access          Public
exports.allUsers = async (req, res) => {
  const { search } = req.query;

  const whereCondition = search
    ? {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
        ],
      }
    : {};

  const users = await User.findAll({
    where: {
      [Op.and]: [
        whereCondition,
        { id: { [Op.ne]: req.user.id } },
      ],
    },
    attributes: { exclude: ['password'] },
  });

  res.send(users);
};


//@description     Register new user
//@route           POST /api/user/
//@access          Public

exports.registerUser = async (req, res) => {
  const { name, email, password, pic, mobile, gender } = req.body;

  if (!name || !email || !password || !mobile || !gender) {
    return res.status(400).json({ message: "Please Enter all the Fields" });
  }

  try {
    // Check if the user already exists
    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the hashed password
    const user = await User.create({
      name,
      email,
      password: hashedPassword, // Store the hashed password
      mobile,
      gender,
      pic,
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        pic: user.pic,
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//@description     Auth the user
//@route           POST /api/users/login
//@access          Public


exports.authUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("aaaaaaaaaaaaaaaaaaaa")
  try {
    // Find the user using the Sequelize model
    const user = await User.findOne({ where: { email:email } });
console.log(user,"======")
    if (!user) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }

    // Compare the hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin || false,
        pic: user.pic,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: "Invalid Email or Password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
