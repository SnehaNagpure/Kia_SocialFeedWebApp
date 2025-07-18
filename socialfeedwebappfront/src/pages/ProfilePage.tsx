import React, { useEffect, useState, useRef } from 'react';
import '../components/shared/ProfilePage.css';
import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import FollowButton from './FollowButton';

interface Post {
  _id: string;
  title: string;
  subtitle: string;
  description?: string;
  media: string[];
  rating: number;
  username: string;
  userId: string;
  likeCount: number;
  commentCount: number;
  comments?: {
    user: string;
    text: string;
    username?: string;
  }[];
}

const ProfilePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [page, setPage] = useState(1);
  const loader = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commentsExpanded, setCommentsExpanded] = useState(false);
  const COMMENTS_PREVIEW_COUNT = 0;

  // Get logged in user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const username = user.username || 'My';

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/posts?page=${page}&limit=10`);
      if (!res.ok) throw new Error('Failed to fetch posts');
      const data = await res.json();
      setPosts((prev) => {
        const newPostIds = new Set(prev.map((p) => p._id));
        const uniqueNewPosts = data.posts.filter((p: Post) => !newPostIds.has(p._id));
        return [...prev, ...uniqueNewPosts];
      });
    } catch (error) {
      console.error('Post fetch error:', error);
    }
    setLoading(false);
  };

  const fetchPostDetail = async (postId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${postId}`);
      if (!res.ok) throw new Error('Failed to fetch post detail');
      const data = await res.json();
      setSelectedPost(data);
      setActiveMediaIndex(0);
      setIsLiked(false);
      setCommentsExpanded(false);
    } catch {
      alert('Failed to load post detail.');
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${postId}/like`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user._id }),
      });

      if (!res.ok) throw new Error('Failed to toggle like');

      const data = await res.json();
      setSelectedPost((prev) =>
        prev ? { ...prev, likeCount: data.likeCount } : prev
      );
      setIsLiked(data.liked);
    } catch (err) {
      console.error('Like error:', err);
      alert('Failed to like/unlike post');
    }
  };

  const handleComment = async (postId: string) => {
    if (!newComment.trim()) return;
    const { _id: userId, username } = JSON.parse(localStorage.getItem('user') || '{}');
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${postId}/comment`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, username, text: newComment }),
      });

      const text = await res.text();

      if (!res.ok) {
        throw new Error(`Failed to comment. Status: ${res.status}`);
      }

      const addedComment = JSON.parse(text);
      const commentWithUser = { ...addedComment, username: username };
      setSelectedPost((prev) =>
        prev
          ? {
              ...prev,
              comments: [...(prev.comments || []), commentWithUser],
              commentCount: (prev.commentCount || 0) + 1,
            }
          : prev
      );

      setNewComment('');
      setCommentsExpanded(true);
    } catch (err) {
      alert('Error adding comment');
      console.error(err);
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (selectedPost && activeMediaIndex < selectedPost.media.length - 1) {
        setActiveMediaIndex((prev) => prev + 1);
      }
    },
    onSwipedRight: () => {
      if (selectedPost && activeMediaIndex > 0) {
        setActiveMediaIndex((prev) => prev - 1);
      }
    },
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  useEffect(() => {
    fetchPosts();
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    const currentLoader = loader.current;
    if (currentLoader) observer.observe(currentLoader);
    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [loader, loading]);

  return (
    <div className="profile-container">
      <div className="profile-layout">

        {/* Left side: Profile details */}
        <div className="profile-details">
          <img
            src={
              user.profilePicture
                ? `http://localhost:5000${user.profilePicture}`
                : '/default-profile.png'
            }
            alt={`${user.firstName || ''} ${user.lastName || ''}`}
            className="profile-picture"
          />
          <h2>{user.firstName} {user.lastName}</h2>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          {user.age && <p><strong>Age:</strong> {user.age}</p>}
        </div>

        {/* Right side: Posts list */}
        <div className="posts-section">
          <div className="header">
            <button className="create-button" onClick={() => navigate('/create-post')}>
              + Create New Post
            </button>
          </div>

          <div className="post-list">
            {posts.map((post) => (
              <div
                key={post._id}
                className="post-card"
                onClick={() => fetchPostDetail(post._id)}
              >
                {post.media[0]?.endsWith('.mp4') ? (
                  <video
                    src={`http://localhost:5000${post.media[0]}`}
                    controls
                    muted
                    className="media"
                  />
                ) : (
                  <img
                    src={`http://localhost:5000${post.media[0]}`}
                    alt={post.title}
                    className="media"
                  />
                )}
                
                <div className="text">
                  <h3>{post.title}</h3>
                  <p>{post.subtitle}</p>
                  <div className="meta">
                    <span>{'★'.repeat(post.rating)}</span>
                    <span>@{post.username}</span>
                    <span>❤️ {post.likeCount}</span>
                    <span>💬 {post.commentCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal for post detail */}
      {selectedPost && (
        <div className="modal-overlay" onClick={() => setSelectedPost(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ position: 'relative', paddingBottom: '60px' }}
          >
            <button
              onClick={() => setSelectedPost(null)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'transparent',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                fontWeight: 'bold',
                lineHeight: 1,
              }}
              aria-label="Close"
            >
              ×
            </button>

            <h2>{selectedPost.title}</h2>
            <p>{selectedPost.description}</p>

            <div {...swipeHandlers} className="carousel">
              {selectedPost.media.length > 0 &&
                (selectedPost.media[activeMediaIndex].endsWith('.mp4') ? (
                  <video
                    key={activeMediaIndex}
                    src={`http://localhost:5000${selectedPost.media[activeMediaIndex]}`}
                    controls
                    className="carousel-media"
                  />
                ) : (
                  <img
                    key={activeMediaIndex}
                    src={`http://localhost:5000${selectedPost.media[activeMediaIndex]}`}
                    alt={`media-${activeMediaIndex}`}
                    className="carousel-media"
                  />
                ))}
            </div>

            <div className="swipe-nav">
              <button
                disabled={activeMediaIndex === 0}
                onClick={() => setActiveMediaIndex((prev) => prev - 1)}
              >
                ‹
              </button>
              <button
                disabled={activeMediaIndex === selectedPost.media.length - 1}
                onClick={() => setActiveMediaIndex((prev) => prev + 1)}
              >
                ›
              </button>
            </div>

            <div  className="buttons-container">
              <button
                className="like-button"
                onClick={() => handleLike(selectedPost._id)}
              >
                {isLiked ? '💔 Unlike' : '❤️ Like'} ({selectedPost.likeCount})
              </button>

              {selectedPost.username !== username && (
                <FollowButton
                  profileUsername={selectedPost.username}
                  currentUsername={username}
                />
                
              )}
              </div>

            {/* Comments Section with collapsible */}
            <div className="comments-popup">
              <h4>Comments</h4>
              <div
                className="comment-list"
                style={{
                  maxHeight: commentsExpanded ? 'none' : '200px',
                  overflowY: 'auto',
                }}
              >
                {(selectedPost.comments && selectedPost.comments.length > 0) ? (
                  <>
                    {(commentsExpanded
                      ? selectedPost.comments
                      : selectedPost.comments.slice(0, COMMENTS_PREVIEW_COUNT)
                    ).map((c, i) => (
                      <div key={i} className="comment-item">
                        <strong>{c.username || 'Anonymous'}:</strong> {c.text}
                      </div>
                    ))}

                    {selectedPost.comments.length > COMMENTS_PREVIEW_COUNT && (
                      <button
                        onClick={() => setCommentsExpanded(!commentsExpanded)}
                        style={{
                          marginTop: '0.5rem',
                          background: 'transparent',
                          border: 'none',
                          color: '#007bff',
                          cursor: 'pointer',
                          padding: 0,
                          fontSize: '0.9rem',
                        }}
                      >
                        {commentsExpanded ? 'Show Less ▲' : 'Show More ▼'}
                      </button>
                    )}
                  </>
                ) : (
                  <p style={{ color: '#777' }}>No comments yet</p>
                )}
              </div>
                            <div className="comment-section">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button onClick={() => handleComment(selectedPost._id)}>Post</button>
              </div>
            
            </div>
            {/* Bottom buttons container: Like and Follow */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                gap: '1rem',
                position: 'absolute',
                bottom: '10px',
                left: '10px',
                width: 'calc(100% - 20px)',
              }}
            >
              
            </div>
          </div>
        </div>
      )}

      <div ref={loader} className="loader">
        {loading ? 'Loading...' : 'Scroll to load more'}
      </div>
    </div>
  );
};

export default ProfilePage;
