// src/pages/AdminPage.jsx
import React from 'react';
import './AdminPage.css';

const AdminPage = () => {
  return (
    <div className="admin-container">
      <h1 className="admin-title">ADMIN PANEL</h1>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <h3>Pending Reviews</h3>
            <span className="stat-icon">||</span>
          </div>
          <div className="stat-big">45</div>
          <div className="stat-change positive">+5 from yesterday</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3>Approvals Today</h3>
            <span className="stat-icon dropdown">▼</span>
          </div>
          <div className="stat-big">+210</div>
          <div className="stat-change positive">+12.5% from last 24h</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3>Rejections Today</h3>
            <span className="stat-icon close">×</span>
          </div>
          <div className="stat-big">+12</div>
          <div className="stat-change positive">+5% from last 24h</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3>Avg. Review Time</h3>
            <span className="stat-icon clock">⏱</span>
          </div>
          <div className="stat-big">2m 15s</div>
          <div className="stat-change negative">+10s from yesterday</div>
        </div>
      </div>

      {/* Moderation Queue */}
      <div className="queue-section">
        <h2>Moderation Queue</h2>
        <p className="queue-subtitle">
          A list of items pending review. This is a placeholder.
        </p>

        <table className="queue-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Content</th>
              <th>Status</th>
              <th>Submitted</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="type">Content Flag</td>
              <td>New project announcement</td>
              <td><span className="status-pending">Pending</span></td>
              <td>10 minutes ago</td>
            </tr>
            <tr>
              <td className="type">Ad Approval</td>
              <td>Youth empowerment campaign</td>
              <td><span className="status-pending">Pending</span></td>
              <td>30 minutes ago</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPage;
