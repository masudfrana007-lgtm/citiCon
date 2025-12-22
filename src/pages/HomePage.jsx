// src/pages/HomePage.jsx
import React from 'react';
import './HomePage.css'; // Make sure this file exists or create it

const HomePage = () => {
  return (
    <div className="homepage-container">
      {/* ==================== HERO SECTION ==================== */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="logo-title">
            Citizen<span className="connect">Connect</span>
          </h1>
          <p className="tagline">
            OUR NEW DIGITAL MARKETING PACKAGES ARE HERE
          </p>
          <p className="features">
            SECURE • VERIFIED • CITIZEN-FIRST PLATFORM
          </p>
		<button 
		  className="get-started-btn"
		  onClick={() => window.location.href = '#/create-post'}
		>
		  GET STARTED
		</button>

        </div>
      </section>

      {/* ==================== PAIN POINTS SECTION ==================== */}
      <section className="pain-points-section">
        <div className="section-inner">
          <h2 className="main-headline">
            Digital marketing doesn't have to be difficult.<br />
            We're here to help.
          </h2>

          <div className="cards-grid">
            <div className="card">
              <h3>GETTING LOST IN THE DIGITAL MAZE?</h3>
              <p>
                At Creative Studio + Lab, we don't just offer a clear roadmap, we navigate the ins and outs of digital marketing alongside our clients.
              </p>
            </div>

            <div className="card">
              <h3>FRUSTRATED WITH CUT-AND-PASTE MODELS?</h3>
              <p>
                Every business is different. That's why we conceptualize strategies tailor-made for your company and its specific and evolving needs.
              </p>
            </div>

            <div className="card">
              <h3>FEELING LIKE YOU'RE LEFT IN THE DARK?</h3>
              <p>
                We work with complete transparency, and provide real-time updates through intuitive dashboards and a dedicated team.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
