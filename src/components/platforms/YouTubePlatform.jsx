// src/components/platforms/YouTubePlatform.jsx
import React from 'react';

const YouTubePlatform = ({
  connected,
  channels,
  selectedChannel,
  onSelectChannel,
  checked,
  onToggle,
  requiresVideo
}) => {
  return (
    <label>
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        disabled={!connected || !requiresVideo}
      />
      <span>YouTube {connected && requiresVideo ? '✓' : '(Connect + Video)'}</span>

      {checked && connected && requiresVideo && channels.length > 0 && (
        <div className="mt-4">
          <label>Select YouTube Channel</label>
          <select
            value={selectedChannel}
            onChange={(e) => onSelectChannel(e.target.value)}
            className="platform-select"
          >
            <option value="">-- Choose Channel --</option>
            {channels.map(c => (
              <option key={c.channel_id} value={c.channel_id}>
                {c.channel_name}
              </option>
            ))}
          </select>
        </div>
      )}
    </label>
  );
};

export default YouTubePlatform;