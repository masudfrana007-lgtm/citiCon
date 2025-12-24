// src/pages/CreatePostPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import './CreatePostPage.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const CreatePostPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [division, setDivision] = useState('');
  const [district, setDistrict] = useState('');
  const [upazila, setUpazila] = useState('');
  const [union, setUnion] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [platforms, setPlatforms] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);

  // Platform connections
  const [fbConnected, setFbConnected] = useState(false);
  const [fbPages, setFbPages] = useState([]);
  const [selectedFbPage, setSelectedFbPage] = useState('');

  const [igConnected, setIgConnected] = useState(false);
  const [igAccounts, setIgAccounts] = useState([]);
  const [selectedIg, setSelectedIg] = useState('');

  const [ytConnected, setYtConnected] = useState(false);
  const [ytChannels, setYtChannels] = useState([]);
  const [selectedYt, setSelectedYt] = useState('');

  const [liConnected, setLiConnected] = useState(false);
  const [showLinkedinMediaWarning, setShowLinkedinMediaWarning] = useState(false);
  const [linkedinMediaConfirmed, setLinkedinMediaConfirmed] = useState(false);


  const isVideo = file && file.type.startsWith('video/');

  const mapRef = useRef();

  const [isPosting, setIsPosting] = useState(false);
  const [postSteps, setPostSteps] = useState([]);
  const [postFinished, setPostFinished] = useState(false);
  const [postSummary, setPostSummary] = useState([]);

  // Fix leaflet icon issue
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });

  const redPinIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  // Bangladesh location data (dummy but realistic)
  const locationData = {
    Dhaka: {
      districts: {
        Dhaka: { upazilas: { Dhanmondi: ['Ward 47', 'Ward 48'], Gulshan: ['Banani', 'Gulshan-1'], Mirpur: ['Mirpur-10'], Uttara: ['Sector-7'] } },
        Gazipur: { upazilas: { Kaliakoir: ['Chandra'], Sreepur: ['Barmi'] } }
      }
    },
    Chattogram: {
      districts: {
        Chattogram: { upazilas: { Kotwali: ['Anderkilla'], Panchlaish: ['Khulshi'], 'Double Mooring': ['Agrabad'] } },
        "Cox’s Bazar": { upazilas: { 'Cox’s Bazar Sadar': ['Jhilongja'], Ukhiya: ['Raja Palong'] } }
      }
    },
    Rajshahi: { districts: { Rajshahi: { upazilas: { Boalia: ['Boalia'], Matihar: ['Matihar'] } } } },
    Khulna: { districts: { Khulna: { upazilas: { Sonadanga: ['Sonadanga'], 'Khulna Sadar': ['Atra Gilatala'] } } } },
    Sylhet: { districts: { Sylhet: { upazilas: { 'Sylhet Sadar': ['Tultikar'], 'Dakshin Surma': ['Moglabazar'] } } } }
  };

  const coordinates = {
    '': { lat: 23.6850, lon: 90.3563, zoom: 7 },
    'Dhaka': { lat: 23.8103, lon: 90.4125, zoom: 8 },
    'Dhaka_Dhaka': { lat: 23.8103, lon: 90.4125, zoom: 10 },
    'Dhaka_Dhaka_Dhanmondi': { lat: 23.7461, lon: 90.3760, zoom: 13 },
    'Dhaka_Dhaka_Dhanmondi_Ward 47': { lat: 23.7461, lon: 90.3760, zoom: 15 },
    'Dhaka_Dhaka_Dhanmondi_Ward 48': { lat: 23.7461, lon: 90.3760, zoom: 15 },
    'Dhaka_Dhaka_Gulshan': { lat: 23.7925, lon: 90.4155, zoom: 13 },
    'Dhaka_Dhaka_Gulshan_Banani': { lat: 23.7938, lon: 90.4053, zoom: 15 },
    'Dhaka_Dhaka_Gulshan_Gulshan-1': { lat: 23.7925, lon: 90.4155, zoom: 15 },
    'Dhaka_Dhaka_Mirpur': { lat: 23.8093, lon: 90.3609, zoom: 13 },
    'Dhaka_Dhaka_Mirpur_Mirpur-10': { lat: 23.8069, lon: 90.3681, zoom: 15 },
    'Dhaka_Dhaka_Uttara': { lat: 23.8769, lon: 90.4026, zoom: 13 },
    'Dhaka_Dhaka_Uttara_Sector-7': { lat: 23.8678, lon: 90.3969, zoom: 15 },
    'Dhaka_Gazipur': { lat: 24.0023, lon: 90.4267, zoom: 10 },
    'Chattogram': { lat: 22.3569, lon: 91.7832, zoom: 8 },
    'Rajshahi': { lat: 24.3745, lon: 88.6042, zoom: 8 },
    'Khulna': { lat: 22.8456, lon: 89.5403, zoom: 8 },
    'Sylhet': { lat: 24.8949, lon: 91.8687, zoom: 8 },
  };

  const getLocationKey = () => {
    let key = '';
    if (division) key += division;
    if (district) key += '_' + district;
    if (upazila) key += '_' + upazila;
    if (union) key += '_' + union;
    return key;
  };

  useEffect(() => {
    if (mapRef.current) {
      const loc = coordinates[getLocationKey()] || coordinates[''];
      mapRef.current.flyTo([loc.lat, loc.lon], loc.zoom, { duration: 1.5 });
    }
  }, [division, district, upazila, union]);

  useEffect(() => {
    setLinkedinMediaConfirmed(false);
  }, [file]);


  // Load platform connections
  useEffect(() => {
    const loadConnections = async () => {
      // Facebook
      try {
        const res = await fetch('/auth/facebook/status', { credentials: 'include' });
        const data = await res.json();
        setFbConnected(data.connected);
        if (data.connected) {
          const pagesRes = await fetch('/auth/facebook/pages', { credentials: 'include' });
          const pagesData = await pagesRes.json();
          setFbPages(pagesData);
        }
      } catch (err) { console.error(err); }

      // Instagram
      try {
        const res = await fetch('/instagram/status', { credentials: 'include' });
        const data = await res.json();
        setIgConnected(data.connected);
        if (data.connected) {
          const accRes = await fetch('/instagram/accounts', { credentials: 'include' });
          const accData = await accRes.json();
          setIgAccounts(accData);
        }
      } catch (err) { console.error(err); }

      // YouTube
      try {
        const res = await fetch('/auth/youtube/status', { credentials: 'include' });
        const data = await res.json();
        setYtConnected(data.connected);
        if (data.connected) {
          const chRes = await fetch('/auth/youtube/channels', { credentials: 'include' });
          const chData = await chRes.json();
          setYtChannels(chData);
        }
      } catch (err) { console.error(err); }

      // LinkedIn
      try {
        const res = await fetch('/linkedin/status', { credentials: 'include' });
        const data = await res.json();
        setLiConnected(data.connected);
      } catch (err) {
        console.error(err);
      }


    };

    loadConnections();
  }, []);

  const handleFileDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.size <= 50 * 1024 * 1024) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size <= 50 * 1024 * 1024) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handlePostNow = () => {
    if (!file) return alert("Please upload a media file.");
    if (platforms.length === 0) return alert("Select at least one platform.");

    if (platforms.includes("facebook") && !selectedFbPage) return alert("Please select a Facebook Page.");
    if (platforms.includes("instagram") && !selectedIg) return alert("Please select an Instagram account.");
    if (platforms.includes("youtube") && !selectedYt) return alert("Please select a YouTube channel.");
    if (platforms.includes("youtube") && !isVideo) return alert("YouTube only accepts video files.");

    setShowConfirm(true);
  };

const resetForm = () => {
  setTitle("");
  setContent("");
  setDivision("");
  setDistrict("");
  setUpazila("");
  setUnion("");
  setFile(null);
  setPreview("");
  setPlatforms([]);
  setSelectedFbPage("");
  setSelectedIg("");
  setSelectedYt("");
  setPostSteps([]);
  setPostSummary([]);
  setPostFinished(false);
  setIsPosting(false);
};

  const updateStep = (platform, name, status) => {
    setPostSteps(prev => {
      const filtered = prev.filter(p => p.platform !== platform);
      return [...filtered, { platform, name, status }];
    });
  };

const addStep = (platform, name, status) => {
  setPostSteps(prev => {
    const idx = prev.findIndex(
      s => s.platform === platform && s.name === name
    );

    if (idx === -1) {
      return [...prev, { platform, name, status }];
    }

    const copy = [...prev];
    copy[idx] = { ...copy[idx], status };
    return copy;
  });
};

const confirmPost = async () => {
  setShowConfirm(false);
  setIsPosting(true);
  setPostSteps([]);

  /* =======================
     FACEBOOK
  ======================= */
  if (platforms.includes("facebook")) {
    const fbPage = fbPages.find(p => p.page_id === selectedFbPage);
    const fbName = fbPage?.page_name || "Facebook Page";

    addStep("facebook", fbName, "pending");

    try {
      if (!file) {
        const res = await fetch("/auth/facebook/post", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            pageId: selectedFbPage,
            message: content || title || "",
          }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
      } else {
        const fbForm = new FormData();
        fbForm.append("file", file);
        fbForm.append("caption", content);
        fbForm.append("pageId", selectedFbPage);

        const res = await fetch("/auth/facebook/media", {
          method: "POST",
          body: fbForm,
          credentials: "include",
        });
        const data = await res.json();
        if (data.error || !data.id) {
          throw new Error(data.error?.message || "Facebook upload failed");
        }
      }

      addStep("facebook", fbName, "success");
      setPostSummary(prev => [...prev, { platform: "Facebook", target: fbName }]);
    } catch (err) {
      console.error(err);
      addStep("facebook", fbName, "error");
      setPostFinished(true);
    }
  }

  /* =======================
     YOUTUBE
  ======================= */
  if (platforms.includes("youtube")) {
    const ytChannel = ytChannels.find(c => c.channel_id === selectedYt);
    const ytName = ytChannel?.channel_name || "YouTube Channel";

    addStep("youtube", ytName, "pending");

    try {
      const ytForm = new FormData();
      ytForm.append("file", file);
      ytForm.append("title", title || content.slice(0, 90));
      ytForm.append("description", content);
      ytForm.append("channelId", selectedYt);

      const res = await fetch("/auth/youtube/upload", {
        method: "POST",
        body: ytForm,
        credentials: "include",
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      addStep("youtube", ytName, "success");
      setPostSummary(prev => [...prev, { platform: "YouTube", target: ytName }]);
    } catch (err) {
      console.error(err);
      addStep("youtube", ytName, "error");
      setPostFinished(true);
    }
  }

/* =======================
   LINKEDIN
======================= */
if (platforms.includes("linkedin")) {
  const liName = "LinkedIn Profile";

  addStep("linkedin", liName, "pending");

  try {
    const res = await fetch("/linkedin/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        message: content || title || "",
      }),
    });

    const data = await res.json();
    if (data.error) throw new Error(data.error);

    addStep("linkedin", liName, "success");
    setPostSummary(prev => [
      ...prev,
      { platform: "LinkedIn", target: liName }
    ]);
  } catch (err) {
    console.error(err);
    addStep("linkedin", liName, "error");
    setPostFinished(true);
    return;
  }
}
  

//  setIsPosting(false);
  setPostFinished(true);

};



  return (
    <div className="create-post-container">
      <div className="create-post-card">
        <h2>Create a New Post</h2>

        <div className="form-group">
          <label>Title</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter a catchy title" />
        </div>

        <div className="form-group">
          <label>Content / Caption</label>
          <textarea rows="7" value={content} onChange={e => setContent(e.target.value)} placeholder="Write your post caption..." />
        </div>

        {/* Location Section */}
        <div className="location-section">
          <h3>Location</h3>
          <div className="location-grid">
            <select value={division} onChange={e => { setDivision(e.target.value); setDistrict(''); setUpazila(''); setUnion(''); }}>
              <option>Select Division</option>
              {Object.keys(locationData).map(d => <option key={d}>{d}</option>)}
            </select>
            <select value={district} onChange={e => { setDistrict(e.target.value); setUpazila(''); setUnion(''); }} disabled={!division}>
              <option>Select District</option>
              {division && Object.keys(locationData[division].districts).map(d => <option key={d}>{d}</option>)}
            </select>
            <select value={upazila} onChange={e => { setUpazila(e.target.value); setUnion(''); }} disabled={!district}>
              <option>Select Upazila</option>
              {district && Object.keys(locationData[division].districts[district].upazilas).map(u => <option key={u}>{u}</option>)}
            </select>
            <select value={union} onChange={e => setUnion(e.target.value)} disabled={!upazila}>
              <option>Select Union/Ward</option>
              {upazila && locationData[division].districts[district].upazilas[upazila].map(u => <option key={u}>{u}</option>)}
            </select>
          </div>

          <div className="map-container">
            <MapContainer center={[23.6850, 90.3563]} zoom={7} style={{ height: '400px', width: '100%' }} ref={mapRef}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {union && (
                <Marker position={[coordinates[getLocationKey()].lat, coordinates[getLocationKey()].lon]} icon={redPinIcon}>
                  <Popup>
                    <strong>{union}</strong><br />
                    {upazila}, {district}, {division}
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
        </div>

        {/* Media Upload */}
        <div className="media-section">
          <h3>Media (Image/Video)</h3>
          <div
            className="drop-zone"
            onDrop={handleFileDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => document.getElementById('file-input').click()}
          >
            {preview ? (
              isVideo ? (
                <video src={preview} controls className="media-preview" />
              ) : (
                <img src={preview} alt="Preview" className="media-preview" />
              )
            ) : (
              <>
                <p>Click to upload or drag and drop</p>
                <p>PNG, JPG or MP4 (MAX. 50MB)</p>
              </>
            )}
            <input id="file-input" type="file" accept="image/*,video/*" onChange={handleFileSelect} hidden />
          </div>
        </div>

        {/* Platform Selection */}
        <div className="publish-section">
          <h3>Publish to</h3>
          <div className="platforms-grid">
            <label>
              <input
                type="checkbox"
                checked={platforms.includes('facebook')}
                onChange={e => setPlatforms(e.target.checked ? [...platforms, 'facebook'] : platforms.filter(p => p !== 'facebook'))}
                disabled={!fbConnected}
              />
              <span>Facebook {fbConnected ? '✓' : '(Connect in Settings)'}</span>
            </label>

            <label>
              <input
                type="checkbox"
                checked={platforms.includes('instagram')}
                onChange={e => setPlatforms(e.target.checked ? [...platforms, 'instagram'] : platforms.filter(p => p !== 'instagram'))}
                disabled={!igConnected}
              />
              <span>Instagram {igConnected ? '✓' : '(Connect in Settings)'}</span>
            </label>

            <label>
              <input
                type="checkbox"
                checked={platforms.includes('youtube')}
                onChange={e => setPlatforms(e.target.checked ? [...platforms, 'youtube'] : platforms.filter(p => p !== 'youtube'))}
                disabled={!ytConnected || !isVideo}
              />
              <span>YouTube {ytConnected && isVideo ? '✓' : '(Connect + Video)'}</span>
            </label>

            <label>
              <input
                type="checkbox"
                checked={platforms.includes('linkedin')}
                onChange={e => {
                  const checked = e.target.checked;

                  if (checked && file && !linkedinMediaConfirmed) {
                    setShowLinkedinMediaWarning(true);
                    return;
                  }

                  setPlatforms(
                    checked
                      ? [...platforms, 'linkedin']
                      : platforms.filter(p => p !== 'linkedin')
                  );
                }}
                disabled={!liConnected}
              />
              <span>LinkedIn {liConnected ? '✓' : '(Connect in Settings)'}</span>
            </label>


          </div>

          {/* Facebook Page Dropdown */}
          {platforms.includes('facebook') && fbConnected && (
            <div className="mt-4">
              <label>Select Facebook Page</label>
              <select value={selectedFbPage} onChange={e => setSelectedFbPage(e.target.value)} className="platform-select">
                <option value="">-- Choose Page --</option>
                {fbPages.map(p => (
                  <option key={p.page_id} value={p.page_id}>{p.page_name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Instagram Account Dropdown */}
          {platforms.includes('instagram') && igConnected && (
            <div className="mt-4">
              <label>Select Instagram Account</label>
              <select value={selectedIg} onChange={e => setSelectedIg(e.target.value)} className="platform-select">
                <option value="">-- Choose Account --</option>
                {igAccounts.map(a => (
                  <option key={a.ig_id} value={a.ig_id}>{a.username}</option>
                ))}
              </select>
            </div>
          )}

          {/* YouTube Channel Dropdown */}
          {platforms.includes('youtube') && ytConnected && isVideo && (
            <div className="mt-4">
              <label>Select YouTube Channel</label>
              <select value={selectedYt} onChange={e => setSelectedYt(e.target.value)} className="platform-select">
                <option value="">-- Choose Channel --</option>
                {ytChannels.map(c => (
                  <option key={c.channel_id} value={c.channel_id}>{c.channel_name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

<button
  className="submit-btn"
  onClick={handlePostNow}
  disabled={isPosting || showConfirm || !file || platforms.length === 0}
>
  Submit Post
</button>


        {/* Confirmation Modal */}
        {showConfirm && (
          <div className="confirm-modal-overlay">
            <div className="confirm-modal">
              <h3>Confirm Post</h3>
              <p>Are you sure you want to publish this post to the selected platforms?</p>
              <div className="modal-buttons">
                <button onClick={() => setShowConfirm(false)}>Cancel</button>
                <button onClick={confirmPost} className="confirm-btn">Yes, Post Now</button>
              </div>
            </div>
          </div>
        )}

{showLinkedinMediaWarning && (
  <div className="confirm-modal-overlay">
    <div className="confirm-modal">
      <h3>LinkedIn Notice</h3>
      <p>
        You have attached media.
        <br /><br />
        <strong>LinkedIn will post only the text.</strong><br />
        Media will not be included.
      </p>

      <div className="modal-buttons">
        <button
          className="confirm-btn"
          onClick={() => {
            setShowLinkedinMediaWarning(false);
            setLinkedinMediaConfirmed(true);
            setPlatforms(prev => [...prev, 'linkedin']);
          }}
        >
          Continue
        </button>

        <button onClick={() => setShowLinkedinMediaWarning(false)}>
          Cancel
        </button>
      </div>
    </div>
  </div>
)}



{isPosting && (
  <div className="posting-overlay">
    <div className={`posting-box ${postFinished ? "success" : ""}`}>
      {!postFinished ? (
        <>
          <h3>Publishing your post</h3>

          {postSteps.map(step => (
            <div key={step.platform + step.name} className="posting-row">
              <strong>{step.platform.toUpperCase()}</strong> – {step.name}
              <span>
                {step.status === "pending" && " ⏳"}
                {step.status === "success" && " ✅"}
                {step.status === "error" && " ❌"}
              </span>
            </div>
          ))}

          <p className="posting-note">
            Please don’t close this page while posting…
          </p>
        </>
      ) : (
        <>
          <h3>Post Published Successfully 🎉</h3>

          {postSummary.map((p, i) => (
            <div key={i} className="posting-row">
              <strong>{p.platform}</strong> – {p.target} ✅
            </div>
          ))}

          <button
            className="confirm-btn"
            style={{ marginTop: "20px" }}
            onClick={() => resetForm()}
          >
            Done
          </button>
        </>
      )}
    </div>
  </div>
)}

      </div>
    </div>
  );
};

export default CreatePostPage;