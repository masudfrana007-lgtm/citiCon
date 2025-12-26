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
    loginUrl: "/auth/facebook/connect", // Uses Facebook login
    statusUrl: "/instagram/status",
    logoutUrl: "/instagram/logout",
    listUrl: "/instagram/accounts",
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
          {platform.key === "instagram" && (
            <p style={{ fontSize: "0.85em", color: "#666", margin: "5px 0 10px" }}>
              Connects via Facebook (requires Business/Creator account linked to a Page)
            </p>
          )}        
        <span className="status">{linked ? "Connected ✓" : "Not connected"}</span>
      </div>

      {linked ? (
        <button onClick={disconnect} className="disconnect-btn">
          Disconnect
        </button>
      ) : (
        <button onClick={connect} className={`connect-btn ${platform.color}`}>
          Connect
        </button>
      )}

      {linked && items.length > 0 && (
        <div className="accounts-list">
          <p className="accounts-title">Connected Accounts/Pages:</p>
          {items.map((item) => (
            <div key={item[platform.idField]} className="account-item">
              {item[platform.imageField] && (
                <img src={item[platform.imageField]} alt="" className="account-img" />
              )}
              <div>
                <div className="account-name">{item[platform.nameField]}</div>
                {/*<div className="account-id">{item[platform.idField]}</div>*/}
              </div>
            </div>
          ))}
        </div>
      )}
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
