const User = require('../Components/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// Create new user
exports.createUser = async (req, res) => {
  const { username,email,password,age } = req.body;
  try {
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ error: 'Username already exists' });
     // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username,email,  password: hashedPassword,age });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Follow another user
// Follow a user
exports.followUser = async (req, res) => {
  try {
    const currentUserId = req.body.currentUserId; // ID of user doing the follow
    const userToFollowId = req.params.id;         // ID of user to be followed

    if (currentUserId === userToFollowId) {
      return res.status(400).json({ error: "You cannot follow yourself" });
    }

    const currentUser = await User.findById(currentUserId);
    const userToFollow = await User.findById(userToFollowId);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if already following
    if (currentUser.following.includes(userToFollowId)) {
      return res.status(400).json({ error: "Already following this user" });
    }

    currentUser.following.push(userToFollowId);
    userToFollow.followers.push(currentUserId);  // optional

    await currentUser.save();
    await userToFollow.save();

    res.json({ message: "User followed successfully" });
  } catch (err) {
    console.error('Follow user error:', err);
    res.status(500).json({ error: "Server error" });
  }
};

// Unfollow a user
exports.unfollowUser = async (req, res) => {
  try {
    const currentUserId = req.body.currentUserId; // ID of user doing unfollow
    const userToUnfollowId = req.params.id;

    if (currentUserId === userToUnfollowId) {
      return res.status(400).json({ error: "You cannot unfollow yourself" });
    }

    const currentUser = await User.findById(currentUserId);
    const userToUnfollow = await User.findById(userToUnfollowId);

    if (!userToUnfollow || !currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Remove userToUnfollowId from currentUser.following
    currentUser.following = currentUser.following.filter(
      id => id.toString() !== userToUnfollowId
    );
    // Remove currentUserId from userToUnfollow.followers (optional)
    userToUnfollow.followers = userToUnfollow.followers.filter(
      id => id.toString() !== currentUserId
    );

    await currentUser.save();
    await userToUnfollow.save();

    res.json({ message: "User unfollowed successfully" });
  } catch (err) {
    console.error('Unfollow user error:', err);
    res.status(500).json({ error: "Server error" });
  }
};


// Login controller
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Check inputs
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Create JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        age: user.age,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};