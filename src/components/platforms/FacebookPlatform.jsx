// src/components/platforms/FacebookPlatform.jsx
import React, { useState, useEffect } from 'react';

const FacebookPlatform = ({ isSelected, onToggle, onPost }) => {
  const [connected, setConnected] = useState(false);
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState('');

  // Load connection and pages — fully inside this component
  useEffect(() => {
    const loadFacebookData = async () => {
      try {
        const res = await fetch('/auth/facebook/status', { credentials: 'include' });
        const data = await res.json();
        setConnected(data.connected);

        if (data.connected) {
          const pagesRes = await fetch('/auth/facebook/pages', { credentials: 'include' });
          const pagesData = await pagesRes.json();
          setPages(pagesData);
        }
      } catch (err) {
        console.error('Facebook load error:', err);
      }
    };
    loadFacebookData();
  }, []);

  // Validation: ready to post?
  const isValid = isSelected && connected && selectedPage;

  // Expose posting function to parent
  useEffect(() => {
    if (onPost) {
      onPost(async (formData) => {
        if (!isValid) throw new Error('Facebook not ready');
        formData.append('pageId', selectedPage);
        const res = await fetch('/auth/facebook/media', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error || 'Facebook post failed');
      });
    }
  }, [isSelected, connected, selectedPage, isValid, onPost]);

  return (
    <label>
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onToggle}
        disabled={!connected}
      />
      <span>Facebook {connected ? '✓' : '(Connect in Settings)'}</span>

      {isSelected && connected && pages.length > 0 && (
        <div className="mt-4">
          <label>Select Facebook Page</label>
          <select
            value={selectedPage}
            onChange={(e) => setSelectedPage(e.target.value)}
            className="platform-select"
          >
            <option value="">-- Choose Page --</option>
            {pages.map(p => (
              <option key={p.page_id} value={p.page_id}>
                {p.page_name}
              </option>
            ))}
          </select>
        </div>
      )}
    </label>
  );
};

export default FacebookPlatform;