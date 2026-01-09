// src/pages/CreatePostPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import './CreatePostPage.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import { postToFacebook } from "../components/platforms/posters/FacebookPoster";
import { postToYouTube } from "../components/platforms/posters/YouTubePoster";
import { postToLinkedIn } from "../components/platforms/posters/LinkedInPoster";
import { postToTwitter } from "../components/platforms/posters/TwitterPoster";
import { postToInstagram } from "../components/platforms/posters/InstagramPoster";

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
//  const [selectedFbPage, setSelectedFbPage] = useState('');
  const [selectedFbPages, setSelectedFbPages] = useState([]);

  const [igConnected, setIgConnected] = useState(false);
  const [igAccounts, setIgAccounts] = useState([]);
  const [selectedIg, setSelectedIg] = useState('');
  const [igValidation, setIgValidation] = useState({ valid: true, reason: "" });
  const [isValidating, setIsValidating] = useState(false);

  const [ytConnected, setYtConnected] = useState(false);
  const [ytChannels, setYtChannels] = useState([]);
  const [selectedYt, setSelectedYt] = useState('');

  const [liConnected, setLiConnected] = useState(false);
  const [showLinkedinMediaWarning, setShowLinkedinMediaWarning] = useState(false);
  const [linkedinMediaConfirmed, setLinkedinMediaConfirmed] = useState(false);

  const [xConnected, setXConnected] = useState(false);


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
  if (liConnected && !platforms.includes("linkedin")) {
    setPlatforms(prev => [...prev, "linkedin"]);
  }
}, [liConnected]);

  // ADD: Re-validate when file changes or Instagram is toggled
  useEffect(() => {
    const validateFile = async () => {
      if (file && platforms.includes('instagram')) {
        setIsValidating(true);
        const validation = await validateInstagramMedia(file);
        setIgValidation(validation);
        setIsValidating(false);
        
        // If invalid, remove Instagram from platforms
        if (!validation.valid) {
          setPlatforms(prev => prev.filter(p => p !== 'instagram'));
        }
      } else {
        setIgValidation({ valid: true, reason: "" });
      }
    };
    
    validateFile();
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
        const res = await fetch('/auth/instagram/status', { credentials: 'include' });
        const data = await res.json();
        setIgConnected(data.connected);
        if (data.connected) {
          const accRes = await fetch('/auth/instagram/accounts', { credentials: 'include' });
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
        const res = await fetch('/auth/linkedin/status', { credentials: 'include' });
        const data = await res.json();
        setLiConnected(data.connected);
      } catch (err) {
        console.error(err);
      }

      // Twitter
      try {
        const res = await fetch('/auth/x/status', { credentials: 'include' });
        const data = await res.json();
        setXConnected(data.connected);        
      } catch (err) {
        console.error(err);
      }


    };

    loadConnections();
  }, []);

  const handleFileDrop = async (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.size <= 50 * 1024 * 1024) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));

      // Validate for Instagram if Instagram is selected
      if (platforms.includes('instagram')) {
        setIsValidating(true);
        const validation = await validateInstagramMedia(droppedFile);
        setIgValidation(validation);
        setIsValidating(false);
        
        // If invalid, remove Instagram from platforms
        if (!validation.valid) {
          setPlatforms(prev => prev.filter(p => p !== 'instagram'));
        }
      }

    }
  };

  const handleFileSelect = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size <= 50 * 1024 * 1024) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));

      // Validate for Instagram if Instagram is selected
      if (platforms.includes('instagram')) {
        setIsValidating(true);
        const validation = await validateInstagramMedia(selectedFile);
        setIgValidation(validation);
        setIsValidating(false);
        
        // If invalid, remove Instagram from platforms
        if (!validation.valid) {
          setPlatforms(prev => prev.filter(p => p !== 'instagram'));
        }
      }

    }
  };

  const handlePostNow = () => {
    if (!file) return alert("Please upload a media file.");
    if (platforms.length === 0) return alert("Select at least one platform.");

    if (platforms.includes("facebook") && selectedFbPages.length === 0) {
          return alert("Please select at least one Facebook Page.");
        }
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
//  setSelectedFbPage("");
  setSelectedFbPages([]);
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

const validateInstagramMedia = async (file) => {
  if (!file) return { valid: false, reason: "No file selected" };

  const isVideo = file.type.startsWith('video/');
  const isImage = file.type.startsWith('image/');

  // Check file type
  if (!isVideo && !isImage) {
    return { valid: false, reason: "Instagram only accepts images and videos" };
  }

  // Check file size (100MB for videos, 8MB for images)
  const maxSize = isVideo ? 100 * 1024 * 1024 : 8 * 1024 * 1024;
  if (file.size > maxSize) {
    return { 
      valid: false, 
      reason: `File too large. Max ${isVideo ? '100MB' : '8MB'} for ${isVideo ? 'videos' : 'images'}` 
    };
  }

  // For images, check dimensions
  if (isImage) {
    try {
      const dimensions = await getImageDimensions(file);
      const aspectRatio = dimensions.width / dimensions.height;
      
      // Instagram aspect ratio: 4:5 to 1.91:1
      if (aspectRatio < 0.8 || aspectRatio > 1.91) {
        return { 
          valid: false, 
          reason: `Image aspect ratio must be between 4:5 and 1.91:1 (current: ${aspectRatio.toFixed(2)}:1)` 
        };
      }

      // Min resolution: 320px
      if (dimensions.width < 320 || dimensions.height < 320) {
        return { 
          valid: false, 
          reason: `Image too small. Minimum 320x320px (current: ${dimensions.width}x${dimensions.height})` 
        };
      }
    } catch (err) {
      console.error("Image validation error:", err);
    }
  }

  // For videos, check duration and dimensions
  if (isVideo) {
    try {
      const videoInfo = await getVideoInfo(file);
      
      // Check duration (3-90 seconds for Reels)
      if (videoInfo.duration < 3) {
        return { 
          valid: false, 
          reason: `Video too short. Minimum 3 seconds (current: ${videoInfo.duration.toFixed(1)}s)` 
        };
      }
      
      if (videoInfo.duration > 90) {
        return { 
          valid: false, 
          reason: `Video too long. Maximum 90 seconds (current: ${videoInfo.duration.toFixed(1)}s)` 
        };
      }

      // -------------------------
      // Resolution: min side ≥ 540px
      // -------------------------
      const minSide = Math.min(videoInfo.width, videoInfo.height);
      if (minSide < 540) {
        return {
          valid: false,
          reason: `Video resolution too low. Minimum side must be ≥ 540px (current: ${videoInfo.width}×${videoInfo.height})`
        };
      }

      // -------------------------
      // Aspect ratio: 4:5 → 9:16
      // -------------------------
      const aspectRatio = videoInfo.width / videoInfo.height;
      const minRatio = 4 / 5;    // 0.8
      const maxRatio = 9 / 16;   // 0.5625

      // Normalize (handles horizontal videos safely)
      const normalizedRatio = Math.min(aspectRatio, 1 / aspectRatio);

      if (normalizedRatio < maxRatio || normalizedRatio > minRatio) {
        return {
          valid: false,
          reason: `Invalid aspect ratio. Supported range: 4:5 to 9:16 (current: ${videoInfo.width}×${videoInfo.height})`
        };
      }
          
    } catch (err) {
      console.error("Video validation error:", err);
      return { 
        valid: false, 
        reason: "Unable to validate video properties. Please try a different file." 
      };
    }
  }

  return { valid: true, reason: "" };
};

// Helper function to get image dimensions
const getImageDimensions = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    
    img.src = url;
  });
};

// Helper function to get video info
const getVideoInfo = (file) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const url = URL.createObjectURL(file);
    
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve({
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight
      });
    };
    
    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load video"));
    };
    
    video.src = url;
  });
};

const confirmPost = async () => {
  setShowConfirm(false);
  setIsPosting(true);
  setPostSteps([]);
  let mediaUrl = null;
  let mediaType = null;

  // 1. First: Upload file and get permanent URL
  if (file) {
    const form = new FormData();
    form.append("file", file);
    form.append("caption", content);
    form.append("platforms", JSON.stringify(platforms));

    const uploadRes = await fetch("/post", {
      method: "POST",
      body: form,
      credentials: "include",
    });

    if (!uploadRes.ok) {
      const text = await uploadRes.text();  // Get raw response
      console.error("Upload failed:", uploadRes.status, text);
      alert(`Upload failed: ${uploadRes.status} ${uploadRes.statusText}\nCheck console for details`);
      setIsPosting(false);
      return;  // Stop everything
    }

    const uploadData = await uploadRes.json();
    mediaUrl = uploadData.mediaUrl;
    mediaType = file.type.startsWith("video/") ? "video" : "image";
  }

  // 2. Build platforms list for DB
  const platformsForDB = [];

  if (platforms.includes("facebook")) {
    selectedFbPages.forEach(pageId => {
      const page = fbPages.find(p => p.page_id === pageId);
      platformsForDB.push({
        platform: "facebook",
        targetId: pageId,
        targetName: page?.page_name,
      });
    });
  }
  if (platforms.includes("instagram") && selectedIg) {
    const ig = igAccounts.find(a => a.ig_id === selectedIg);
    platformsForDB.push({
      platform: "instagram",
      targetId: selectedIg,
      targetName: `@${ig?.username}`,
    });
  }
  if (platforms.includes("youtube") && selectedYt) {
    const ch = ytChannels.find(c => c.channel_id === selectedYt);

    platformsForDB.push({
      platform: "youtube",
      targetId: selectedYt,
      targetName: ch?.channel_name,
    });
  }

  // Add LinkedIn, X similarly...

  // 3. Save main post record
  const saveRes = await fetch("/post/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      title,
      content,
      mediaUrl,
      mediaType,
      originalFilename: file?.name,
      division,
      district,
      upazila,
      union,
      platforms: platformsForDB,
    }),
  });
  const { postId } = await saveRes.json();

  // Helper to update status
  const updateStatus = async (platform, targetName, status, extra = {}) => {
    await fetch("/post/platform/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        postId,
        platform,
        targetName,
        status,
        externalPostId: extra.externalPostId,
        permalink: extra.permalink,
        errorMessage: extra.errorMessage,
      }),
    });
  };

  try {
      if (platforms.includes("facebook")) {
        if (selectedFbPages.length === 0) throw new Error("No Facebook pages selected");

        for (const pageId of selectedFbPages) {
          const page = fbPages.find(p => p.page_id === pageId);
          const pageName = page?.page_name || "Facebook Page";

          // Add pending step for this specific page
          addStep("facebook", pageName, "pending");

          try {
            const result = await postToFacebook({
                    file,
                    content,
                    pageId,
                    fbPages,
                    addStep,
                    setPostSummary
                  });

            await updateStatus("facebook", pageName, "success", {
                  externalPostId: result.postId,
                  permalink: result.permalink,
                });

            // Update to success for this page
            addStep("facebook", pageName, "success");
            setPostSummary(prev => [...prev, { platform: "Facebook", target: pageName }]);
          } catch (err) {
            await updateStatus("facebook", pageName, "error", {
                    errorMessage: err.message || "Failed to post",
                  });

            addStep("facebook", pageName, "error");
            console.error(`Failed to post to Facebook page ${pageName}:`, err);
            // Continue to next page even if one fails
          }
        }
      }

      if (platforms.includes("instagram")) {
        if (!file) throw new Error("Instagram requires media");
        if (!selectedIg) throw new Error("Please select an Instagram account");   

        const igAccount = igAccounts.find(a => a.ig_id === selectedIg);
        const igName = igAccount ? `@${igAccount.username}` : "Instagram Account";

        addStep("instagram", igName, "pending");

        await postToInstagram({
          file, // use Facebook URL
          content,
          igId: selectedIg,
          igAccounts,
          addStep,
          setPostSummary
        });
      }

if (platforms.includes("youtube")) {
  const ch = ytChannels.find(c => c.channel_id === selectedYt);
  const channelName = ch?.channel_name || "YouTube Channel";

  addStep("youtube", channelName, "pending");

  try {
    const result = await postToYouTube({
      file,
      title,
      content,
      channelId: selectedYt,
      ytChannels,
      addStep,
      setPostSummary
    });

    // ✅ DB UPDATE (THIS WAS MISSING / FAILING)
    await updateStatus("youtube", channelName, "success", {
      externalPostId: result.videoId,
      permalink: result.permalink
    });

  } catch (err) {
    await updateStatus("youtube", channelName, "error", {
      errorMessage: err.message
    });

    addStep("youtube", channelName, "error");
  }
}

    if (platforms.includes("linkedin")) {
      await postToLinkedIn({
        content,
        addStep,
        setPostSummary
      });
    }

    if (platforms.includes("twitter")) {
      await postToTwitter({
        content,
        addStep,
        setPostSummary
      });
    }
    
    setPostFinished(true);
  } catch (err) {
    console.error(err);
    setPostFinished(true);
  }
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

  {/* Instagram Validation Warning */}
  {file && !igValidation.valid && (
    <div className="validation-warning" style={{
      marginTop: '10px',
      padding: '12px',
      backgroundColor: '#fff3cd',
      border: '1px solid #ffc107',
      borderRadius: '8px',
      color: '#856404'
    }}>
      <strong>⚠️ Instagram Requirements Not Met:</strong>
      <p style={{ margin: '5px 0 0 0' }}>{igValidation.reason}</p>
    </div>
  )}

  {isValidating && (
    <p style={{ marginTop: '10px', color: '#666' }}>
      ⏳ Validating media for Instagram...
    </p>
  )}
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

            <label style={{
              opacity: !igConnected || !file || !platforms.includes('facebook') || !igValidation.valid ? 0.5 : 1
            }}>
              <input
                type="checkbox"
                checked={platforms.includes('instagram')}
                onChange={async (e) => {
                  const checked = e.target.checked;
                  
                  if (checked && file) {
                    // Validate before allowing selection
                    setIsValidating(true);
                    const validation = await validateInstagramMedia(file);
                    setIgValidation(validation);
                    setIsValidating(false);
                    
                    if (!validation.valid) {
                      alert(`Instagram validation failed:\n${validation.reason}`);
                      return;
                    }
                  }
                  
                  setPlatforms(
                    checked 
                      ? [...platforms, 'instagram'] 
                      : platforms.filter(p => p !== 'instagram')
                  );
                }}
                disabled={
                  !igConnected || 
                  !file || 
                  !igValidation.valid ||
                  isValidating
                }
              />
              <span>
                Instagram{' '}
                {!igConnected && '(Connect in Settings)'}
                {igConnected && !file && '(Requires Media)'}
                {igConnected && file && igValidation.valid && '✓'}
                {igConnected && file && !igValidation.valid && '(Media Invalid)'}
              </span>
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

            <label>
              <input
                type="checkbox"
                checked={platforms.includes("twitter")}
                onChange={e =>
                  setPlatforms(
                    e.target.checked
                      ? [...platforms, "twitter"]
                      : platforms.filter(p => p !== "twitter")
                  )
                }
                disabled={!xConnected}
              />
              <span>X (Twitter) {xConnected ? "✓" : "(Connect in Settings)"}</span>
            </label>


          </div>

          {/* Facebook Page Dropdown */}
          {platforms.includes('facebook') && fbConnected && (
            <div className="mt-4">
              <label>Select Facebook Pages (you can choose multiple)</label>
              <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ddd', padding: '10px', borderRadius: '8px' }}>
                {fbPages.map(page => (
                  <label key={page.page_id} style={{ display: 'block', margin: '8px 0' }}>
                    <input
                      type="checkbox"
                      checked={selectedFbPages.includes(page.page_id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedFbPages(prev => [...prev, page.page_id]);
                        } else {
                          setSelectedFbPages(prev => prev.filter(id => id !== page.page_id));
                        }
                      }}
                    />
                    <span style={{ marginLeft: '8px' }}>{page.page_name}</span>
                  </label>
                ))}
              </div>
              {fbPages.length > 1 && (
                <button
                  type="button"
                  onClick={() => setSelectedFbPages(fbPages.map(p => p.page_id))}
                  style={{ marginTop: '10px', fontSize: '14px', padding: '6px 12px' }}
                >
                  Select All
                </button>
              )}
            </div>
          )}

          {/* Instagram Account Dropdown */}
          {platforms.includes('instagram') && igConnected && file && (
            <div className="mt-4">
              <label>Select Instagram Account</label>
              <select value={selectedIg} onChange={e => setSelectedIg(e.target.value)} className="platform-select">
                <option value="">-- Choose Account --</option>
                {igAccounts.map(a => (
                  <option key={a.ig_id} value={a.ig_id}>@{a.username}</option>
                ))}
              </select>
            </div>
          )}

          {file && !igValidation.valid && (
            <div style={{
              marginTop: '15px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #dee2e6'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>
                📋 Instagram Media Requirements:
              </h4>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#6c757d' }}>
                <li>Videos: 3-90 seconds duration</li>
                <li>Videos: Minimum 540x960px resolution</li>
                <li>Videos: Vertical aspect ratio (4:5 to 9:16)</li>
                <li>Images: Minimum 320x320px resolution</li>
                <li>Images: Aspect ratio between 4:5 and 1.91:1</li>
                <li>Max file size: 100MB (video) / 8MB (image)</li>
              </ul>
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
    <div className={`posting-box ${postFinished ? "finished" : ""}`}>
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
          {/* No headline — just the clean list */}
          {postSteps.map(step => (
            <div
              key={step.platform + step.name}
              className={`posting-row ${step.status}`}
            >
              <strong>{step.platform.toUpperCase()}</strong> – {step.name}
              <span>
                {step.status === "success" && " ✅"}
                {step.status === "error" && " ❌"}
              </span>
            </div>
          ))}

          <button
            className="confirm-btn"
            style={{ marginTop: "30px" }}
            onClick={resetForm}
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