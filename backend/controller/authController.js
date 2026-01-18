const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });

    if (!user) {
      return res.status(400).json({ message: "Invalid user data" });
    }

    const token = generateToken(user._id);

    return res.status(201).json({
      message: "User registered successfully",
      token,
    });
  } catch (error) {
    console.error("registerUser error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

//@desc  login User
// Broute POST /ap/auth/login
// @access Public
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
   const user = await User.findOne({ email }).select("+password");
  console.log("USER FOUND:", user);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.status(200).json({
      message: "Login successful",
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};


//@desc  Get current logged-in user
//@route  GET/api/auth/profile
// @access Private

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
     res.json({
      _id : user._id,
      name : user.name,
      email : user.email,
      avatar: user.avatar,
      isPro: user.isPro,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//@desc Update user profile
//@route PUT/ap1/auth/me
// @access Private
exports.updateUserProfile = async (req, res) => {
  try {
     const user = await User.findById(req.user.id);
     if(user) {
      user.name = req.body.name || user.name;

      const updatedUser = await user.save();
      res.json({
        _id : updatedUser._id,
        name : updatedUser.name,
      });
     }else{
      res.status(404).json({message : "user not found"});
     }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
