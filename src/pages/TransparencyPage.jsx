// src/pages/TransparencyPage.jsx
import React, { useState } from 'react';
import './TransparencyPage.css';

const TransparencyPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCandidate, setFilterCandidate] = useState('All');
  const [filterDistrict, setFilterDistrict] = useState('All');

  // Demo data - exactly like your screenshot
  const promotions = [
    {
      id: 1,
      candidate: 'Anisul Hoque',
      location: 'Dhaka',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      title: 'New Infrastructure Projects in Dhaka',
      spend: 'BDT 2,501 - 5,000',
      dates: '2024-07-20 to 2024-07-30',
      status: 'Ended',
      target: 'Dhaka',
    },
    {
      id: 2,
      candidate: 'Anisul Hoque',
      location: 'Dhaka',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      title: 'Youth Employment Initiative',
      spend: 'BDT 5,001 - 10,000',
      dates: '2024-07-25 to 2024-08-05',
      status: 'Ended',
      target: 'Dhaka',
    },
  ];

  const filteredPromotions = promotions.filter(promo => {
    const matchesSearch = promo.candidate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         promo.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCandidate = filterCandidate === 'All' || promo.candidate === filterCandidate;
    const matchesDistrict = filterDistrict === 'All' || promo.target === filterDistrict;
    return matchesSearch && matchesCandidate && matchesDistrict;
  });

  return (
    <div className="transparency-container">
      <div className="header-section">
        <div>
          <h1>Transparency Center – Election Promotions in Bangladesh</h1>
          <p>This public archive lists all paid political promotions from verified candidates.</p>
        </div>
        <button className="export-btn">
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by candidate, title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select value={filterCandidate} onChange={(e) => setFilterCandidate(e.target.value)}>
          <option>All Candidates</option>
          <option>Anisul Hoque</option>
          <option>Sheikh Hasina</option>
          <option>Khaleda Zia</option>
        </select>
        <select value={filterDistrict} onChange={(e) => setFilterDistrict(e.target.value)}>
          <option>All Districts</option>
          <option>Dhaka</option>
          <option>Chattogram</option>
          <option>Nationwide</option>
        </select>
        <div className="date-range">
          Jan 20, 2024 – Nov 29, 2025
        </div>
      </div>

      {/* Table */}
      <div className="promotions-table">
        <div className="table-header">
          <div>Candidate</div>
          <div>Ad Title</div>
          <div>Spend</div>
          <div>Dates</div>
          <div>Target Region</div>
          <div></div>
        </div>

        {filteredPromotions.map((promo) => (
          <div key={promo.id} className="table-row">
            <div className="candidate-cell">
              <img src={promo.avatar} alt={promo.candidate} className="candidate-avatar" />
              <div>
                <strong>{promo.candidate}</strong>
                <br />
                <small className="location">{promo.location}</small>
              </div>
            </div>
            <div className="title-cell">{promo.title}</div>
            <div className="spend-cell">{promo.spend}</div>
            <div className="dates-cell">
              {promo.dates}
              <br />
              <span className={`status-badge ${promo.status.toLowerCase()}`}>
                {promo.status}
              </span>
            </div>
            <div className="target-cell">{promo.target}</div>
            <div className="action-cell">
              <button className="view-details-btn">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransparencyPage;
