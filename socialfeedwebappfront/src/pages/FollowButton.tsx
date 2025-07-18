import { Console } from 'console';
import React, { useState, useEffect } from 'react';
import '../components/shared/ProfilePage.css';

interface FollowButtonProps {
  profileUsername: string;  // user whose profile is shown (target)
  currentUsername: string;  // logged-in user
}

const FollowButton: React.FC<FollowButtonProps> = ({ profileUsername, currentUsername }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [targetUserId, setTargetUserId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Fetch user IDs for profileUsername and currentUsername'
  // 
  useEffect(() => {
    const fetchUserIds = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch current user ID by username
        const currentRes = await fetch(`http://localhost:5000/api/users/by-username/${currentUsername}`);
        if (!currentRes.ok) throw new Error('Failed to fetch current user');
        const currentUserData = await currentRes.json();
      

        // Fetch target user ID by username
        const targetRes = await fetch(`http://localhost:5000/api/users/by-username/${profileUsername}`);
        if (!targetRes.ok) throw new Error('Failed to fetch target user');
        const targetUserData = await targetRes.json();

        setCurrentUserId(currentUserData._id);
        setTargetUserId(targetUserData._id);

        // Check if current user follows target user
        const followStatusRes = await fetch(`http://localhost:5000/api/users/${currentUserData._id}`);
        if (!followStatusRes.ok) throw new Error('Failed to fetch follow status');
        const followStatusData = await followStatusRes.json();

        setIsFollowing(followStatusData.following.includes(targetUserData._id));
      } catch (err: any) {
        console.error('FollowButton error:', err);
        setError(err.message || 'Error');
      } finally {
        setLoading(false);
      }
    };

    if (profileUsername && currentUsername && profileUsername !== currentUsername) {
      fetchUserIds();
    } else {
      // If profile is current user, no follow button needed
      setLoading(false);
    }
  }, [profileUsername, currentUsername]);

  const handleFollowToggle = async () => {
    if (!currentUserId || !targetUserId) return;

    try {
      setLoading(true);
      setError(null);

      const endpoint = isFollowing ? 'unfollow' : 'follow';
      const res = await fetch(`http://localhost:5000/api/users/${targetUserId}/${endpoint}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ UserId: currentUserId }),
      });
      console.log(res)
      if (!res.ok) throw new Error('Failed to toggle follow status');

      setIsFollowing(!isFollowing);
    } catch (err: any) {
      setError(err.message || 'Action failed');
      console.error('Toggle follow error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <button disabled style={{ padding: '8px 16px', marginTop: '8px' }}>Loading...</button>;

  if (error) return <button disabled style={{ padding: '8px 16px', marginTop: '8px', color: 'red' }}>Error</button>;

  // Don't show button if user views their own profile
  if (profileUsername === currentUsername) return null;

  return (
    <button onClick={handleFollowToggle} className="follow-button">
      {isFollowing ? 'Unfollow' : 'Follow'} {profileUsername}
    </button>
  );
};

export default FollowButton;
