import React, { useEffect, useState } from "react";
import "./AdsPage.css";

const AdsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/post/posts", { credentials: "include" })
      .then(res => res.json())
      .then(data => setPosts(data))
      .finally(() => setLoading(false));
  }, []);

  // Placeholder – backend retry will be added later
  const retryPlatform = (postId, platform) => {
    alert(
      `Retry not implemented yet.\nPost ID: ${postId}\nPlatform: ${platform.platform}`
    );
  };

  if (loading) {
    return <div className="ads-page">Loading posts…</div>;
  }

  return (
    <div className="ads-page">
      <h1>Published Posts</h1>

      {posts.map(post => (
        <div key={post.id} className="meta-card">
          
          {/* LEFT: Media */}
          <div className="meta-media">
            {post.media_type === "video" ? (
              <video
                src={post.media_url}
                controls
                preload="metadata"
                muted
              />
            ) : (
              <img src={post.media_url} alt="Post media" />
            )}
          </div>

          {/* CENTER: Content */}
          <div className="meta-content">
            <h3 className="meta-title">
              {post.title || "Untitled post"}
            </h3>

            <p className="meta-text">
              {post.content}
            </p>

            <div className="meta-meta">
              <span>
                {post.media_type === "video" ? "🎬 Video" : "🖼️ Image"}
              </span>
              <span>
                Published: {new Date(post.created_at).toLocaleDateString()}
              </span>
            </div>

            {/* Platforms */}
            <div className="meta-platforms">
              {post.platforms.map(p => (
                <div
                  key={p.id}
                  className={`platform-badge ${p.status}`}
                >
                  <span>
                    {p.platform.toUpperCase()}
                    {p.target_name && ` · ${p.target_name}`}
                  </span>

                  {/* SUCCESS → VIEW */}
                  {p.status === "success" && p.permalink && (
                    <a
                      href={p.permalink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View
                    </a>
                  )}

                  {/* FAILED → RETRY */}
                  {p.status === "error" && (
                    <button
                      className="retry-btn"
                      onClick={() => retryPlatform(post.id, p)}
                    >
                      Retry
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Metrics + Actions */}
          <div className="meta-side">
            <div className="meta-metrics">
              <div>
                <strong>{post.reach || 0}</strong>
                <span>Reach</span>
              </div>
              <div>
                <strong>{post.views || 0}</strong>
                <span>Views</span>
              </div>
              <div>
                <strong>{post.viewers || 0}</strong>
                <span>Viewers</span>
              </div>
              <div>
                <strong>{post.follows || 0}</strong>
                <span>Follows</span>
              </div>
            </div>

            <div className="meta-actions">
              <button className="btn-danger">Delete</button>

              {/* Boost only if Facebook success */}
              {post.platforms.some(
                p => p.platform === "facebook" && p.status === "success"
              ) && (
                <a
                  className="btn-primary"
                  href={`https://www.facebook.com/${
                    post.platforms.find(p => p.platform === "facebook")
                      ?.external_post_id
                  }/boost`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Boost
                </a>
              )}
            </div>
          </div>

        </div>
      ))}
    </div>
  );
};

export default AdsPage;
