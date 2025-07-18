const User = require('../Components/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');





exports.createUser = async (req, res) => {
  const { firstName, lastName, username, email, password, age } = req.body;
  const profilePicture = req.file ? '/uploads/' + req.file.filename : '';

  try {
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ error: 'Username already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      age,
      profilePicture
    });

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
    const currentUserId = req.body.UserId; // ID of user doing the follow
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

// Unfollow a userSA  
exports.unfollowUser = async (req, res) => {
  try {
    const currentUserId = req.body.UserId; // ID of user doing unfollow (match followUser)
    const userToUnfollowId = req.params.id;

    if (currentUserId === userToUnfollowId) {
      return res.status(400).json({ error: "You cannot unfollow yourself" });
    }

    const currentUser = await User.findById(currentUserId);
    const userToUnfollow = await User.findById(userToUnfollowId);
    // console.log('user id to be nnofollowed',userToUnfollowId);
    //  console.log('user id',currentUserId);

    if (!userToUnfollow || !currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    currentUser.following = currentUser.following.filter(
      id => id.toString() !== userToUnfollowId
    );
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
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserById  = async (req, res) => {
  try {
        const user = await User.findById(req.params.id).select('_id username following');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Get user by username error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getUserByUsername = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('_id username following');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
