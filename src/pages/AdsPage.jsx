// src/pages/AdsPage.jsx
import React, { useState, useEffect } from 'react';
import './AdsPage.css';

const AdsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/post/posts", { credentials: "include" });

        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        } else if (res.status === 401) {
          alert("Please log in to view your posts.");
        } else {
          alert("Failed to load posts.");
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
        alert("Network error. Check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="page-content ads-page">
        <h1>Loading your posts...</h1>
        <p>Please wait while we fetch your history.</p>
      </div>
    );
  }

  return (
    <div className="page-content ads-page">
      <h1>Post History & Ads Management</h1>

      {posts.length === 0 ? (
        <div className="empty-state">
          <h3>No posts yet!</h3>
          <p>Go to <strong>Create Post</strong> and publish your first content.</p>
        </div>
      ) : (
        <div className="posts-grid">
          {posts.map(post => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <h3>{post.title || "Untitled Post"}</h3>
                <small className="post-date">
                  Created: {formatDate(post.created_at)}
                </small>
              </div>

              {/* Media Preview */}
              {post.media_url && (
                <div className="media-preview">
                  {post.media_type === "video" ? (
                    <video
                      src={post.media_url}
                      controls
                      preload="metadata"
                      style={{ width: "100%", borderRadius: "8px" }}
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={post.media_url}
                      alt="Post media"
                      style={{ width: "100%", borderRadius: "8px" }}
                    />
                  )}
                </div>
              )}

              {/* Caption */}
              <div className="post-content">
                <strong>Caption:</strong>
                <p>{post.content || "No caption"}</p>
              </div>

              {/* Platforms Status */}
              <div className="platforms-section">
                <strong>Published to:</strong>
                {post.platforms && post.platforms.length > 0 ? (
                  <div className="platforms-list">
                    {post.platforms.map(plat => (
                      <div
                        key={plat.id}
                        className={`platform-item ${plat.status}`}
                      >
                        <span className="platform-name">
                          {plat.platform.toUpperCase()}
                          {plat.target_name && ` – ${plat.target_name}`}
                        </span>

                        <span className="platform-status">
                          {plat.status === "success" && "✅ Success"}
                          {plat.status === "pending" && "⏳ Pending"}
                          {plat.status === "error" && "❌ Failed"}
                        </span>

                        {/* Actions: View + Boost */}
                        <div className="platform-actions">
                          {plat.permalink && (
                            <a
                              href={plat.permalink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="view-link"
                            >
                              View Post →
                            </a>
                          )}

                          {/* 🚀 Boost Post Button - Only for successful Facebook posts */}
                          {plat.platform === "facebook" &&
                           plat.status === "success" &&
                           plat.external_post_id && (
                            <a
                              href={`https://www.facebook.com/${plat.external_post_id}/boost`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="boost-btn"
                            >
                              🚀 Boost Post
                            </a>
                          )}
                        </div>

                        {plat.error_message && (
                          <small className="error-msg">
                            ({plat.error_message})
                          </small>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No platforms selected</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdsPage;