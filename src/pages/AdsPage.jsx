import React, { useEffect, useState } from "react";
import "./AdsPage.css";

/* ---------------------------------
   MEDIA PRIORITY
---------------------------------- */

const VIDEO_PRIORITY = ["youtube", "facebook", "instagram", "linkedin", "twitter"];
const IMAGE_PRIORITY = ["facebook", "instagram", "linkedin", "twitter"];

const getMediaCandidates = (post) => {
  if (!post.platforms) return [];

  const priority =
    post.media_type === "video" ? VIDEO_PRIORITY : IMAGE_PRIORITY;

  return priority
    .map(name =>
      post.platforms.find(
        p =>
          p.platform === name &&
          p.status === "success" &&
          (p.external_post_id || p.media_url)
      )
    )
    .filter(Boolean);
};

/* ---------------------------------
   MEDIA RENDERER (WITH FALLBACK)
---------------------------------- */

const MediaRenderer = ({ post }) => {
  const candidates = getMediaCandidates(post);
  const [index, setIndex] = useState(0);

  if (!candidates.length) {
    return <div className="media-fallback">No media</div>;
  }

  const current = candidates[index];

  const tryNext = () => {
    if (index < candidates.length - 1) {
      setIndex(index + 1);
    }
  };

  // ---------- VIDEO ----------
  if (post.media_type === "video") {
    // YouTube (iframe only – required)
    if (current.platform === "youtube") {
      return (
        <iframe
          src={`https://www.youtube.com/embed/${current.external_post_id}`}
          title="YouTube video"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onError={tryNext}
        />
      );
    }

    // Facebook / Instagram / LinkedIn / Twitter (best effort)
    return (
      <video
        src={current.media_url}
        controls
        preload="metadata"
        muted
        onError={tryNext}
      />
    );
  }

  // ---------- IMAGE ----------
  return (
    <img
      src={current.media_url}
      alt="Post media"
      onError={tryNext}
    />
  );
};

/* ---------------------------------
   MAIN PAGE
---------------------------------- */

const AdsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/post/posts", { credentials: "include" })
      .then(res => res.json())
      .then(data => setPosts(data))
      .finally(() => setLoading(false));
  }, []);

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

          {/* LEFT: MEDIA */}
          <div className="meta-media">
            <MediaRenderer post={post} />
          </div>

          {/* CENTER: CONTENT */}
          <div className="meta-content">
            <h3 className="meta-title">
              {post.title || "Untitled post"}
            </h3>

            <p className="meta-text">{post.content}</p>

            <div className="meta-meta">
              <span>
                {post.media_type === "video" ? "🎬 Video" : "🖼️ Image"}
              </span>
              <span>
                Published: {new Date(post.created_at).toLocaleDateString()}
              </span>
            </div>

            <div className="meta-platforms">
              {post.platforms.map(p => (
                <div key={p.id} className={`platform-badge ${p.status}`}>
                  <span>
                    {p.platform.toUpperCase()}
                    {p.target_name && ` · ${p.target_name}`}
                  </span>

                  {p.status === "success" && p.permalink && (
                    <a href={p.permalink} target="_blank" rel="noreferrer">
                      View
                    </a>
                  )}

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

          {/* RIGHT */}
          <div className="meta-side">
            <div className="meta-metrics">
              <div><strong>{post.reach || 0}</strong><span>Reach</span></div>
              <div><strong>{post.views || 0}</strong><span>Views</span></div>
              <div><strong>{post.viewers || 0}</strong><span>Viewers</span></div>
              <div><strong>{post.follows || 0}</strong><span>Follows</span></div>
            </div>

            <div className="meta-actions">
              <button className="btn-danger">Delete</button>

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
