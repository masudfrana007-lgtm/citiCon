// src/components/platforms/InstagramPlatform.jsx
import React from 'react';

const InstagramPlatform = ({
  connected,
  accounts,
  selectedAccount,
  onSelectAccount,
  checked,
  onToggle
}) => {
  return (
    <label>
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        disabled={!connected}
      />
      <span>Instagram {connected ? '✓' : '(Connect in Settings)'}</span>

      {checked && connected && accounts.length > 0 && (
        <div className="mt-4">
          <label>Select Instagram Account</label>
          <select
            value={selectedAccount}
            onChange={(e) => onSelectAccount(e.target.value)}
            className="platform-select"
          >
            <option value="">-- Choose Account --</option>
            {accounts.map(a => (
              <option key={a.ig_id} value={a.ig_id}>
                {a.username}
              </option>
            ))}
          </select>
        </div>
      )}
    </label>
  );
};

export default InstagramPlatform;