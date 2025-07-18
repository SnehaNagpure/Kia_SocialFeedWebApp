const mongoose = require('mongoose');
const Post = require('../Components/Post');
const User = require('../Components/User');
const path = require('path');

exports.createPost = async (req, res) => {
  try {
    const { title, subtitle, description, rating, createdBy } = req.body;
    const files = req.files || [];

    const user = await User.findOne({ email: createdBy });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const images = files
      .filter(f => f.mimetype.startsWith('image'))
      .map(f => '/uploads/' + path.basename(f.path));

    const videos = files
      .filter(f => f.mimetype.startsWith('video'))
      .map(f => '/uploads/' + path.basename(f.path));

    if (images.length > 3) return res.status(400).json({ error: 'Up to 3 images allowed' });
    if (videos.length > 1) return res.status(400).json({ error: 'Only 1 video allowed' });

    const media = [...images, ...videos];

    const post = new Post({
      title,
      subtitle,
      description,
      rating,
      media,
      createdBy: user._id,
    });

    await post.save();

    res.status(201).json(post);

  } catch (err) {
    console.error('Create post error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getPaginatedPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate('createdBy', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Post.countDocuments();
    const enrichedPosts = posts.map(post => {
      return {
        ...post,
        username: post.createdBy?.username || 'Unknown',
        likeCount: post.likes?.length || 0,
        commentCount: post.comments?.length || 0,
      };
    });

    res.json({
      posts:enrichedPosts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error('Pagination error:', err);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Post ID format' });
    }

    const post = await Post.findById(id)
      .populate('createdBy', 'username')
      .lean();

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

       post.likeCount = post.likes ? post.likes.length : 0;
       post.username = post.createdBy.username;
    delete post.createdBy;

    if (!post.comments) {
      post.comments = [];
    }

    res.json(post);
  } catch (err) {
    console.error('❌ Get post by ID error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// New: Like a post
// PUT /api/posts/:id/like
exports.likePost = async (req, res) => {
  
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const index = post.likes.indexOf(userId);
    let liked;

    if (index === -1) {
      post.likes.push(userId); // Like
      liked = true;
    } else {
      post.likes.splice(index, 1); // Unlike
      liked = false;
    }

    await post.save();

    res.json({
      liked,
      likeCount: post.likes.length,
    });
  } catch (err) {
    console.error('Toggle Like Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// New: Add a comment
// PUT /api/posts/:id/comment


exports.addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const { userId, username, text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Comment text is required' });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const newComment = {
      _id: new mongoose.Types.ObjectId(), // manually assign _id
      user: userId,
      username,
      text,
      createdAt: new Date()
    };

    post.comments.push(newComment);
    await post.save();

    res.status(201).json({
      _id: newComment._id,
      text: newComment.text,
      createdAt: newComment.createdAt,
      username: newComment.username
    });
  } catch (err) {
    console.error('Comment update error:', err); // check your server logs here
    res.status(500).json({ error: 'Server error' });
  }
};


