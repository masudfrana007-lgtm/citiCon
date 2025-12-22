// src/pages/AnalyticsPage.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './AnalyticsPage.css';

const AnalyticsPage = () => {
  // Demo data
  const performanceData = [
    { date: 'Jul 1', reach: 3200, engagement: 450 },
    { date: 'Jul 2', reach: 3800, engagement: 520 },
    { date: 'Jul 3', reach: 3600, engagement: 480 },
    { date: 'Jul 4', reach: 4000, engagement: 610 },
    { date: 'Jul 5', reach: 4200, engagement: 720 },
    { date: 'Jul 6', reach: 4800, engagement: 850 },
    { date: 'Jul 7', reach: 4600, engagement: 780 },
  ];

  const campaigns = [
    { name: 'New Infrastructure Projects in Dhaka', status: 'Running', objective: 'Reach', budget: 5000, spend: 3500 },
    { name: 'Youth Employment Initiative', status: 'Pending', objective: 'Engagement', budget: 10000, spend: 0 },
    { name: 'Our Commitment to Green Energy', status: 'Completed', objective: 'Impressions', budget: 2500, spend: 2500 },
  ];

  return (
    <div className="analytics-container">
      <h1>Campaign Analytics</h1>
      <p className="subtitle">Review the performance of your ad campaigns.</p>

      {/* Top Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Reach</div>
          <div className="stat-value">45,231</div>
          <div className="stat-change positive">+20.1% from last month</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Engagement</div>
          <div className="stat-value">+2,350</div>
          <div className="stat-change positive">+80.1% from last month</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Spend</div>
          <div className="stat-value">BDT 12,234</div>
          <div className="stat-change negative">-8.0% from last month</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Campaigns</div>
          <div className="stat-value">+5</div>
          <div className="stat-change positive">+2 since last hour</div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="chart-section">
        <h2>Performance Overview</h2>
        <p className="chart-subtitle">A look at your campaign reach and engagement over the last 7 days.</p>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fill: '#666' }} />
              <YAxis tick={{ fill: '#666' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="reach" stroke="#1976d2" strokeWidth={3} dot={{ fill: '#1976d2' }} name="Reach" />
              <Line type="monotone" dataKey="engagement" stroke="#4caf50" strokeWidth={3} dot={{ fill: '#4caf50' }} name="Engagement" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Campaign Breakdown */}
      <div className="campaign-breakdown">
        <h2>Campaign Breakdown</h2>
        <p className="table-subtitle">Detailed performance of each campaign.</p>
        <table className="campaign-table">
          <thead>
            <tr>
              <th>Campaign</th>
              <th>Status</th>
              <th>Objective</th>
              <th>Budget (BDT)</th>
              <th>Spend (BDT)</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c, i) => (
              <tr key={i}>
                <td className="campaign-name">{c.name}</td>
                <td>
                  <span className={`status-badge ${c.status.toLowerCase()}`}>
                    {c.status}
                  </span>
                </td>
                <td>{c.objective}</td>
                <td className="budget">{c.budget.toLocaleString()}</td>
                <td className="spend">{c.spend.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnalyticsPage;
