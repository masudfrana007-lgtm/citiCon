import React, { useEffect, useState } from 'react';
import './SettingsPage.css'; // Optional - create for styling

const PLATFORMS = [
  {
    key: "facebook",
    name: "Facebook Pages",
    color: "blue",
    loginUrl: "/auth/facebook/connect",
    statusUrl: "/auth/facebook/status",
    logoutUrl: "/auth/facebook/logout",
    listUrl: "/auth/facebook/pages",
    successMessage: "fb_connected",
    idField: "page_id",
    nameField: "page_name",
    imageField: "page_image",
  },
  {
    key: "instagram",
    name: "Instagram",
    color: "pink",
    loginUrl: "/auth/facebook/connect", // Keep for re-connect
    statusUrl: "/auth/instagram/status",
    logoutUrl: "/auth/instagram/logout",
    listUrl: "/auth/instagram/accounts",
    successMessage: "instagram_connected",
    idField: "ig_id",
    nameField: "username",
    imageField: "profile_picture",

  },
  {
    key: "youtube",
    name: "YouTube",
    color: "red",
    loginUrl: "/auth/youtube/login",
    statusUrl: "/auth/youtube/status",
    logoutUrl: "/auth/youtube/logout",
    listUrl: "/auth/youtube/channels",
    successMessage: "youtube_connected",
    idField: "channel_id",
    nameField: "channel_name",
    imageField: "channel_image",
  },
  {
    key: "linkedin",
    name: "LinkedIn",
    color: "linkedin",
    loginUrl: "/auth/linkedin/connect",
    statusUrl: "/auth/linkedin/status",
    logoutUrl: "/auth/linkedin/logout",  
    // LinkedIn personal posting has no sub-accounts
    listUrl: null,
    successMessage: "linkedin_connected",
  },
  {
    key: "twitter",
    name: "X (Twitter)",
    color: "black",
    loginUrl: "/auth/x/connect",
    statusUrl: "/auth/x/status",
    logoutUrl: "/auth/x/logout",
    listUrl: null,
    successMessage: "x_connected",
  },


];

const PlatformCard = ({ platform }) => {
  const [linked, setLinked] = useState(false);
  const [items, setItems] = useState([]);

  const refreshStatus = async () => {
    try {
      const res = await fetch(platform.statusUrl, { credentials: "include" });
      const data = await res.json();
      setLinked(data.connected === true);
    } catch {
      setLinked(false);
    }
  };

  const loadItems = async () => {
    if (!platform.listUrl) return;
    try {
      const res = await fetch(platform.listUrl, { credentials: "include" });
      const data = await res.json();
      setItems(data);
    } catch {
      setItems([]);
    }
  };

const connect = async () => {
  // 🔹 X (Twitter) needs init first
  if (platform.key === "twitter") {
    const res = await fetch("/auth/x/init", {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      alert("Please login again");
      return;
    }
  }

  const popup = window.open(
    platform.loginUrl,
    platform.key,
    "width=600,height=700,scrollbars=yes"
  );

  const timer = setInterval(() => {
    if (!popup || popup.closed) {
      clearInterval(timer);
      refreshStatus();
      loadItems();
    }
  }, 500);
};



  const disconnect = async () => {
    await fetch(platform.logoutUrl, { method: "POST", credentials: "include" });
    setLinked(false);
    setItems([]);
  };

  useEffect(() => {
    refreshStatus();
    loadItems();
  }, [platform]);

  return (
    <div className="platform-card">
      <div className="platform-header">
        <h3>{platform.name}</h3>
        
        {/* Instagram hint — always visible */}
        {platform.key === "instagram" && (
          <p style={{ 
            fontSize: "0.85em", 
            color: "#666", 
            margin: "8px 0 12px", 
            lineHeight: "1.4" 
          }}>
            Connects via Facebook<br />
            Requires Business or Creator account linked to a Facebook Page
          </p>
        )}
        
        <span className="status">
          {linked ? "Connected ✓" : "Not connected"}
        </span>
      </div>

      {/* Instagram: no Connect button + helpful message */}
      {platform.key === "instagram" && !linked && (
        <div style={{
          backgroundColor: "#fdf8f9",
          border: "1px dashed #ffb3c6",
          borderRadius: "8px",
          padding: "16px",
          textAlign: "center",
          color: "#555",
          fontSize: "0.94em",
          margin: "12px 0"
        }}>
          <strong>Instagram accounts appear automatically</strong> after connecting Facebook Pages.<br /><br />
          Make sure your Instagram account is:<br />
          • Professional (Business or Creator)<br />
          • Linked to one of your Facebook Pages
        </div>
      )}

      {/* Connect button for every platform EXCEPT Instagram */}
      {!linked && platform.key !== "instagram" && (
        <button onClick={connect} className={`connect-btn ${platform.color}`}>
          Connect
        </button>
      )}

      {/* Disconnect button for every platform EXCEPT Instagram */}
      {linked && platform.key !== "instagram" && (
        <button onClick={disconnect} className="disconnect-btn">
          Disconnect
        </button>
      )}

      {/* Connected Accounts List */}
      {linked && items.length > 0 && (
        <div className="accounts-list">
          <p className="accounts-title">
            {platform.key === "instagram" ? "Connected Instagram Account:" : "Connected Accounts/Pages:"}
          </p>
          {items.map((item) => (
            <div key={item[platform.idField]} className="account-item">
              {item[platform.imageField] && (
                <img
                  src={item[platform.imageField]}
                  alt={item[platform.nameField]}
                  className="account-img"
                />
              )}
              <div>
                <div className="account-name">
                  {platform.key === "instagram" ? "@" : ""}{item[platform.nameField]}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Remove the "No accounts found" message completely — it was showing under LinkedIn/X */}
    </div>
  );  
};

const SettingsPage = () => {
  return (
    <div className="settings-container">
      <h1>Platform Connections</h1>
      <p>Connect your social media accounts to publish posts from Citizen Connect.</p>

      <div className="platforms-grid">
        {PLATFORMS.map((platform) => (
          <PlatformCard key={platform.key} platform={platform} />
        ))}
      </div>

      <div className="settings-note">
        <p>Tip: After connecting, return to Create Post to select pages/accounts.</p>
      </div>
    </div>
  );
};

export default SettingsPage;
