const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
   username: { type: String },
  text: String,
  createdAt: { type: Date, default: Date.now },
});

const postSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  description: String,
  media: [String], // Array of file paths (images/videos)
  rating: { type: Number, min: 1, max: 5 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [commentSchema],
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
postSchema.virtual('likeCount').get(function () {
  return this.likes.length;
});

postSchema.virtual('commentCount').get(function () {
  return this.comments.length;
});

postSchema.set('toJSON', { virtuals: true });
postSchema.set('toObject', { virtuals: true });