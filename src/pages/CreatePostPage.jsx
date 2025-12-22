import React, { useState, useRef, useEffect } from 'react';
import './CreatePostPage.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const CreatePostPage = () => {
  /* =========================
     BASIC POST DATA
  ========================= */
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');

  /* =========================
     LOCATION (OPTIONAL)
  ========================= */
  const [division, setDivision] = useState('');
  const [district, setDistrict] = useState('');
  const [upazila, setUpazila] = useState('');
  const [union, setUnion] = useState('');

  /* =========================
     PLATFORM SELECTION
  ========================= */
  const [platforms, setPlatforms] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);

  const [fbConnected, setFbConnected] = useState(false);
  const [fbPages, setFbPages] = useState([]);
  const [selectedFbPage, setSelectedFbPage] = useState('');

  const [igConnected, setIgConnected] = useState(false);
  const [igAccounts, setIgAccounts] = useState([]);
  const [selectedIg, setSelectedIg] = useState('');

  const [ytConnected, setYtConnected] = useState(false);
  const [ytChannels, setYtChannels] = useState([]);
  const [selectedYt, setSelectedYt] = useState('');

  const isVideo = file && file.type.startsWith('video/');
  const mapRef = useRef();

  /* =========================
     LEAFLET ICON FIX
  ========================= */
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });

  const redPinIcon = L.icon({
    iconUrl:
      'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  /* =========================
     LOCATION DATA (SAMPLE)
  ========================= */
  const coordinates = {
    '': { lat: 23.685, lon: 90.3563, zoom: 7 },
    Dhaka: { lat: 23.8103, lon: 90.4125, zoom: 10 },
  };

  const getLocationKey = () => {
    let k = '';
    if (division) k += division;
    if (district) k += '_' + district;
    if (upazila) k += '_' + upazila;
    if (union) k += '_' + union;
    return k;
  };

  useEffect(() => {
    if (!mapRef.current) return;
    const loc = coordinates[getLocationKey()] || coordinates[''];
    mapRef.current.flyTo([loc.lat, loc.lon], loc.zoom, { duration: 1.2 });
  }, [division, district, upazila, union]);

  /* =========================
     LOAD PLATFORM CONNECTIONS
  ========================= */
  useEffect(() => {
    (async () => {
      try {
        const fb = await fetch('/auth/facebook/status', { credentials: 'include' }).then(r => r.json());
        setFbConnected(fb.connected);
        if (fb.connected) {
          const pages = await fetch('/auth/facebook/pages', { credentials: 'include' }).then(r => r.json());
          setFbPages(pages);
        }
      } catch {}

      try {
        const ig = await fetch('/instagram/status', { credentials: 'include' }).then(r => r.json());
        setIgConnected(ig.connected);
        if (ig.connected) {
          const acc = await fetch('/instagram/accounts', { credentials: 'include' }).then(r => r.json());
          setIgAccounts(acc);
        }
      } catch {}

      try {
        const yt = await fetch('/auth/youtube/status', { credentials: 'include' }).then(r => r.json());
        setYtConnected(yt.connected);
        if (yt.connected) {
          const ch = await fetch('/auth/youtube/channels', { credentials: 'include' }).then(r => r.json());
          setYtChannels(ch);
        }
      } catch {}
    })();
  }, []);

  /* =========================
     FILE HANDLING
  ========================= */
  const handleFileSelect = e => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 50 * 1024 * 1024) return alert('File too large (50MB max)');
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  /* =========================
     VALIDATION LOGIC (CORE)
  ========================= */
  const validatePost = () => {
    if (!title.trim()) return 'Title is required.';
    if (!content.trim()) return 'Content is required.';
    if (platforms.length === 0) return 'Select at least one platform.';

    if (platforms.includes('facebook') && !selectedFbPage)
      return 'Select a Facebook Page.';

    if (platforms.includes('instagram')) {
      if (!file) return 'Instagram requires an image or video.';
      if (!selectedIg) return 'Select an Instagram account.';
    }

    if (platforms.includes('youtube')) {
      if (!file || !isVideo) return 'YouTube requires a video file.';
      if (!selectedYt) return 'Select a YouTube channel.';
    }

    return null;
  };

  const canSubmit = !validatePost();

  /* =========================
     SUBMIT FLOW
  ========================= */
  const handleReview = () => {
    const err = validatePost();
    if (err) return alert(err);
    setShowConfirm(true);
  };

  const confirmPost = async () => {
    setShowConfirm(false);

    const form = new FormData();
    form.append('file', file);
    form.append('title', title);
    form.append('caption', content);

    if (platforms.includes('facebook')) {
      form.append('pageId', selectedFbPage);
      await fetch('/auth/facebook/media', {
        method: 'POST',
        body: form,
        credentials: 'include',
      });
    }

    if (platforms.includes('youtube')) {
      form.append('channelId', selectedYt);
      await fetch('/auth/youtube/upload', {
        method: 'POST',
        body: form,
        credentials: 'include',
      });
    }

    alert('Post submitted successfully.');
  };

  /* =========================
     UI
  ========================= */
return (
  <div className="create-post-container">
    <div className="create-post-card">
      <h2>Create Post</h2>

      {/* Title */}
      <div className="form-group">
        <label>Title *</label>
        <input
          type="text"
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

      {/* Media */}
      <div className="media-section">
        <h3>Media (Optional)</h3>

        <div className="drop-zone">
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileSelect}
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
              disabled={!fbConnected}
              checked={platforms.includes('facebook')}
              onChange={e =>
                setPlatforms(e.target.checked
                  ? [...platforms, 'facebook']
                  : platforms.filter(p => p !== 'facebook'))
              }
            />
            Facebook
          </label>

          <label>
            <input
              type="checkbox"
              disabled={!igConnected || !file}
              checked={platforms.includes('instagram')}
              onChange={e =>
                setPlatforms(e.target.checked
                  ? [...platforms, 'instagram']
                  : platforms.filter(p => p !== 'instagram'))
              }
            />
            Instagram <small>(Media required)</small>
          </label>

          <label>
            <input
              type="checkbox"
              disabled={!ytConnected || !isVideo}
              checked={platforms.includes('youtube')}
              onChange={e =>
                setPlatforms(e.target.checked
                  ? [...platforms, 'youtube']
                  : platforms.filter(p => p !== 'youtube'))
              }
            />
            YouTube <small>(Video only)</small>
          </label>
        </div>
      </div>

      {/* Submit */}
      <div style={{ marginTop: 40, textAlign: 'right' }}>
        <button
          className="submit-btn"
          disabled={!canSubmit}
          onClick={handleReview}
        >
          Review & Submit
        </button>
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal">
            <h3>Confirm Post</h3>

            <p><strong>Title:</strong> {title}</p>
            <p><strong>Content:</strong> {content.slice(0, 120)}...</p>
            <p><strong>Platforms:</strong> {platforms.join(', ')}</p>
            {file && <p><strong>Media:</strong> {isVideo ? 'Video' : 'Image'}</p>}

            <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
              <button onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className="submit-btn" onClick={confirmPost}>
                Post Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);

export default CreatePostPage;
