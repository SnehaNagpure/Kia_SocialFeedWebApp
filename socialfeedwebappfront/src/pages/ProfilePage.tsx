import React, { useEffect, useState, useRef } from 'react';
import '../components/shared/ProfilePage.css';
import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';

interface Post {
  _id: string;
  title: string;
  subtitle: string;
  description?: string;
  media: string[];
  rating: number;
  username: string;
  likeCount: number;
   commentCount: number;
  comments?: { user: string; text: string }[];
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

    // Update likeCount and isLiked
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
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: username, text: newComment }),
      });
      if (!res.ok) throw new Error('Failed to comment');
      const addedComment = await res.json();
      setSelectedPost((prev) =>
        prev ? { ...prev, comments: [...(prev.comments || []), addedComment] } : prev
      );
      setNewComment('');
    } catch (err) {
      alert('Error adding comment');
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
      <div className="header">
        <h2>{username}'s Posts</h2>
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

      {selectedPost && (
        <div className="modal-overlay" onClick={() => setSelectedPost(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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

            <div className="comments">
              <h4>Comments</h4>
              {selectedPost.comments?.map((c, i) => (
                <p key={i}>
                  <strong>{c.user}:</strong> {c.text}
                </p>
              ))}

              <div style={{ marginTop: '1rem' }}>
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  style={{ padding: '0.5rem', width: '80%' }}
                />
                <button
                  onClick={() => handleComment(selectedPost._id)}
                  style={{ padding: '0.5rem' }}
                >
                  Post
                </button>
              </div>
            </div>

            <div className="like-toggle">
              <button onClick={() => handleLike(selectedPost._id)}>
                {isLiked ? '💔 Unlike' : '❤️ Like'} ({selectedPost.likeCount})
              </button>
              <button onClick={() => setSelectedPost(null)}>Close</button>
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
