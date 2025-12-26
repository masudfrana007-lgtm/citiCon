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

  // const connect = () => {
  //   const popup = window.open(
  //     platform.loginUrl,
  //     platform.key,
  //     "width=600,height=700,scrollbars=yes"
  //   );
  //   const timer = setInterval(() => {
  //     if (popup.closed) {
  //       clearInterval(timer);
  //       refreshStatus();
  //       loadItems();
  //     }
  //   }, 500);
  // };
const connect = async () => {
  // Special handling ONLY for X (Twitter)
  if (platform.key === "twitter") {
    const base64urlEncode = (arrayBuffer) => {
      return btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
    };

    const encoder = new TextEncoder();
    const verifierBytes = crypto.getRandomValues(new Uint8Array(32));
    const verifier = base64urlEncode(verifierBytes);

    const challengeData = await crypto.subtle.digest("SHA-256", encoder.encode(verifier));
    const challenge = base64urlEncode(challengeData);

    const state = crypto.randomUUID();

    sessionStorage.setItem("x_pkce_verifier", verifier);
    sessionStorage.setItem("x_pkce_state", state);

    const params = new URLSearchParams({
      response_type: "code",
      client_id: "VW9mOFhrWXZiLWZMckRmVEp1MEs6MTpjaQ",
      redirect_uri: "https://ucext.com/auth/x/callback",
      scope: "tweet.read tweet.write users.read offline.access",
      state: state,
      code_challenge: challenge,
      code_challenge_method: "S256",
    });

    const popup = window.open(
      `https://twitter.com/i/oauth2/authorize?${params.toString()}`,
      "twitter-auth",
      "width=600,height=700,scrollbars=yes"
    );

    // === ADD THIS ENTIRE BLOCK HERE ===
    const handleMessage = async (event) => {
      if (event.data?.type === "x_auth_success") {
        const { code } = event.data;
        const verifier = sessionStorage.getItem("x_pkce_verifier");

        if (!verifier) {
          alert("Authentication failed: verifier missing");
          return;
        }

        try {
          const tokenResponse = await fetch("https://api.twitter.com/2/oauth2/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              grant_type: "authorization_code",
              code,
              redirect_uri: "https://ucext.com/auth/x/callback",
              client_id: "VW9mOFhrWXZiLWZMckRmVEp1MEs6MTpjaQ",
              code_verifier: verifier,
            }),
          });

          const tokenData = await tokenResponse.json();

          if (tokenData.access_token) {
            const meRes = await fetch("https://api.twitter.com/2/users/me", {
              headers: { Authorization: `Bearer ${tokenData.access_token}` },
            });
            const me = await meRes.json();

            if (me.data?.id) {
              await fetch("/auth/x/save-token", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  access_token: tokenData.access_token,
                  external_user_id: me.data.id,
                }),
              });

              refreshStatus();
              loadItems();
              alert("X (Twitter) connected successfully! ✓");
            }
          } else {
            alert("X auth failed: " + JSON.stringify(tokenData));
          }
        } catch (err) {
          alert("Error during authentication: " + err.message);
        }

        // Cleanup
        sessionStorage.removeItem("x_pkce_verifier");
        sessionStorage.removeItem("x_pkce_state");
        window.removeEventListener("message", handleMessage);
      } else if (event.data?.type === "x_auth_error") {
        alert("X authentication failed: " + (event.data.error || "Unknown error"));
        sessionStorage.removeItem("x_pkce_verifier");
        sessionStorage.removeItem("x_pkce_state");
        window.removeEventListener("message", handleMessage);
      }
    };

    window.addEventListener("message", handleMessage);

    return; // Important: stop here for Twitter
  }

  // === ORIGINAL FLOW FOR ALL OTHER PLATFORMS ===
  const popup = window.open(
    platform.loginUrl,
    platform.key,
    "width=600,height=700,scrollbars=yes"
  );

  const timer = setInterval(() => {
    if (popup.closed) {
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
