import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/Users.js";

/* Register user */
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new User
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 1000),
      impressions: Math.floor(Math.random() * 1000),
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* Loggin in */
export const login = async (req, res) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({email: email});
    if(!user) return res.status(400).json({msg: "User does not exist."})

    const isMatch = await bcrypt.compare(password, user.password) 

    if(!isMatch) return res.status(400).json({msg: "Invalid credentials."})

    const token = jwt.sign({id: user.id}, process.env.JWT_SECRET);

    delete user.password

    res.status(200).json({user, token});

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
