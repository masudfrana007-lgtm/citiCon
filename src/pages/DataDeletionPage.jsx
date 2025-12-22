import React, { useState } from "react";
import "./DataDeletionPage.css";

const DataDeletionPage = () => {
  const [confirmed, setConfirmed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleDeleteRequest = () => {
    if (!confirmed) return;
    setSubmitted(true);
  };

  return (
    <div className="data-deletion-container">
      <div className="data-deletion-card">
        <h1>User Data Deletion</h1>

        {!submitted ? (
          <>
            <p>
              You have the right to request deletion of your personal data from
              Citizen Connect.
            </p>

            <p>
              This includes your account information, posts, and related activity.
              Some data may be retained temporarily to comply with legal or
              security requirements.
            </p>

            <p className="warning">
              ⚠️ Data deletion is permanent and cannot be undone.
            </p>

            <label className="confirm-checkbox">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
              />
              I understand and want to request deletion of my data
            </label>

            <button
              className="delete-btn"
              disabled={!confirmed}
              onClick={handleDeleteRequest}
            >
              Request Data Deletion
            </button>
          </>
        ) : (
          <>
            <h2>Request Received</h2>
            <p>
              Your data deletion request has been recorded.
            </p>
            <p>
              The Citizen Connect team will contact you via your registered
              email address to verify your identity and complete the deletion
              process.
            </p>
            <p>
              This process may take a few business days.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default DataDeletionPage;
