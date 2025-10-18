const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../Model/registerModel'); 

const registerUser = async (req, res) => {
  try {
    const { firstname, lastname, username, emailaddress, password, country } = req.body;

  
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) return res.status(409).json({ message: "Username already taken" });

    const existingEmail = await User.findOne({ where: { emailaddress } });
    if (existingEmail) return res.status(409).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstname: firstname.trim(),
      lastname: lastname.trim(),
      username: username.trim(),
      emailaddress: emailaddress.trim().toLowerCase(),
      password: hashedPassword,
      country: country.trim()
    });

    const userSafe = user.toJSON();
    delete userSafe.password; 

    const token = jwt.sign(
      { id: user.id, emailaddress: user.emailaddress },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,      
      user: userSafe
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { emailaddress, password } = req.body;

    const user = await User.findOne({ where: { emailaddress: emailaddress.trim().toLowerCase() } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign(
      { id: user.id, emailaddress: user.emailaddress },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const userSafe = {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      emailaddress: user.emailaddress,
      username: user.username,
      country: user.country
    };

    res.json({ message: "Login successful", token, user: userSafe });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] } 
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: ["id", "firstname", "lastname", "emailaddress", "country"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "✅ User profile fetched successfully",
      user,
    });
  } catch (error) {
    console.error("❌ Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, country } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.firstname = firstName || user.firstname;
    user.lastname = lastName || user.lastname;
    user.country = country || user.country;

    await user.save();

    res.json({
      message: "✅ Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  registerUser,
  loginUser,
  getUsers,
  updateUserProfile,
  getUserProfile
};
