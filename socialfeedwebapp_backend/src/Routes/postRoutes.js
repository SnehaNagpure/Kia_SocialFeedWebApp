const express = require('express');
const router = express.Router();
const upload = require('../Middlewares/upload');

const {
  createPost,
  getPaginatedPosts,
  getPostById,
  likePost,
  addComment,
  Post
} = require('../Controllers/postcontroller');

// Upload max 4 files in form field 'media' (3 images + 1 video max)
router.post('/create', upload.array('media', 4), createPost);

router.get('/', getPaginatedPosts);

router.get('/:id', getPostById);
router.put('/:id/like', likePost);
router.put('/:id/comment', addComment);

module.exports = router;
