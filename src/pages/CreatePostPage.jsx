import { useState } from "react";
import AdministrativeMap from "../components/AdministrativeMap";
import "./CreatePostPage.css";

export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isVideo, setIsVideo] = useState(false);

  const [platforms, setPlatforms] = useState([]);

  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");
  const [union, setUnion] = useState("");

  const [showConfirm, setShowConfirm] = useState(false);

  // replace with real backend status
  const connected = {
    facebook: true,
    instagram: true,
    youtube: true,
  };

  const handleFile = e => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setIsVideo(f.type.startsWith("video/"));
    setPreview(URL.createObjectURL(f));
  };

  const togglePlatform = p => {
    setPlatforms(prev =>
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    );
  };

  const canSubmit =
    title.trim() &&
    content.trim() &&
    platforms.length > 0 &&
    (!platforms.includes("instagram") || !connected.instagram || file) &&
    (!platforms.includes("youtube") || !connected.youtube || isVideo);

  return (
    <div className="create-post-container">
      <div className="create-post-card">
        <h2>Create Post</h2>

        {/* Title */}
        <div className="form-group">
          <label>Title *</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Enter post title"
          />
        </div>

        {/* Content */}
        <div className="form-group">
          <label>Content *</label>
          <textarea
            rows={5}
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Write your post content"
          />
        </div>

        {/* Location */}
        <div className="location-section">
          <h3>Location (Optional)</h3>

          <div className="location-grid">
            <select value={division} onChange={e => setDivision(e.target.value)}>
              <option value="">Select Division</option>
              <option value="Dhaka">Dhaka</option>
            </select>

            <select
              value={district}
              disabled={!division}
              onChange={e => setDistrict(e.target.value)}
            >
              <option value="">Select District</option>
              <option value="Dhaka">Dhaka</option>
            </select>

            <select
              value={upazila}
              disabled={!district}
              onChange={e => setUpazila(e.target.value)}
            >
              <option value="">Select Upazila</option>
              <option value="Savar">Savar</option>
            </select>

            <select
              value={union}
              disabled={!upazila}
              onChange={e => setUnion(e.target.value)}
            >
              <option value="">Select Union</option>
              <option value="Tetuljhora">Tetuljhora</option>
            </select>
          </div>

          <AdministrativeMap
            division={division}
            district={district}
            upazila={upazila}
            union={union}
          />
        </div>

        {/* Media */}
        <div className="media-section">
          <h3>Media (Optional)</h3>

          <div className="drop-zone">
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFile}
            />
            <p>Drag & drop or click to upload image/video</p>
          </div>

          {preview && (
            <div style={{ marginTop: 20 }}>
              {isVideo ? (
                <video src={preview} controls className="media-preview" />
              ) : (
                <img src={preview} alt="Preview" className="media-preview" />
              )}
            </div>
          )}
        </div>

        {/* Platforms */}
        <div className="publish-section">
          <h3>Publish To</h3>

          <div className="platforms-grid">
            <label>
              <input
                type="checkbox"
                disabled={!connected.facebook}
                checked={platforms.includes("facebook")}
                onChange={() => togglePlatform("facebook")}
              />
              Facebook
            </label>

            <label>
              <input
                type="checkbox"
                disabled={!connected.instagram || !file}
                checked={platforms.includes("instagram")}
                onChange={() => togglePlatform("instagram")}
              />
              Instagram <small>(Media required)</small>
            </label>

            <label>
              <input
                type="checkbox"
                disabled={!connected.youtube || !isVideo}
                checked={platforms.includes("youtube")}
                onChange={() => togglePlatform("youtube")}
              />
              YouTube <small>(Video only)</small>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div style={{ textAlign: "right", marginTop: 40 }}>
          <button
            className="submit-btn"
            disabled={!canSubmit}
            onClick={() => setShowConfirm(true)}
          >
            Review & Submit
          </button>
        </div>

        {/* Confirm Modal */}
        {showConfirm && (
          <div className="confirm-modal-overlay">
            <div className="confirm-modal">
              <h3>Confirm Post</h3>

              <p><b>Title:</b> {title}</p>
              <p><b>Platforms:</b> {platforms.join(", ")}</p>
              <p><b>Location:</b> {union || upazila || district || division || "N/A"}</p>

              <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
                <button onClick={() => setShowConfirm(false)}>Cancel</button>
                <button className="submit-btn">Post Now</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
