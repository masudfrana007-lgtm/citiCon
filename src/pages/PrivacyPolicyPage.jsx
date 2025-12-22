import React from "react";
import "./PrivacyPolicyPage.css";

const PrivacyPolicyPage = () => {
  return (
    <div className="legal-page">
      <h1>Privacy Policy</h1>

      <p className="legal-meta">
        <strong>Effective Date:</strong> [Insert Date]<br />
        <strong>Last Updated:</strong> [Insert Date]
      </p>

      <p>
        Citizen Connect (“we”, “our”, or “us”) is committed to protecting user
        privacy and personal data. This Privacy Policy explains how we collect,
        use, store, process, and protect information when you use the Citizen
        Connect website, applications, and integrated services (collectively,
        the “Services”).
      </p>

      <p>
        By using our Services, you consent to the practices described in this
        Privacy Policy.
      </p>

      <h2>1. Scope of This Privacy Policy</h2>
      <ul>
        <li>Website visitors</li>
        <li>Registered users</li>
        <li>Mobile and web application users</li>
        <li>Users connecting third-party digital platforms via APIs</li>
      </ul>
      <p>
        This policy applies globally and is designed to comply with international
        data protection laws.
      </p>

      <h2>2. Information We Collect</h2>

      <h3>2.1 Information You Provide Directly</h3>
      <ul>
        <li>Name</li>
        <li>Email address</li>
        <li>Phone number</li>
        <li>Organization details</li>
        <li>Account credentials</li>
        <li>Content you create or upload</li>
        <li>Communications with support</li>
      </ul>

      <h3>2.2 Information Collected via Third-Party APIs</h3>
      <p>
        When you explicitly connect a third-party platform (e.g., Facebook,
        Google, X, LinkedIn), we may access:
      </p>
      <ul>
        <li>Public profile information (name, username, profile image)</li>
        <li>Account identifiers (platform user ID)</li>
        <li>Content data (posts, media, captions) as permitted</li>
        <li>Engagement and analytics data</li>
        <li>Page or channel metadata</li>
      </ul>
      <p>
        <strong>
          We only access data scopes that are explicitly approved and authorized
          by the user.
        </strong>
      </p>

      <h3>2.3 Automatically Collected Information</h3>
      <ul>
        <li>IP address</li>
        <li>Device and browser type</li>
        <li>Log files</li>
        <li>Usage activity</li>
        <li>Cookies and similar technologies</li>
      </ul>

      <h2>3. How We Use Information</h2>
      <ul>
        <li>Provide and operate the Services</li>
        <li>Enable content publishing via authorized APIs</li>
        <li>Display analytics and performance insights</li>
        <li>Maintain platform security and integrity</li>
        <li>Improve service functionality</li>
        <li>Respond to support requests</li>
        <li>Comply with legal obligations</li>
      </ul>
      <p>
        <strong>We do NOT sell, rent, or trade personal data.</strong>
      </p>

      <h2>4. Legal Basis for Processing</h2>
      <ul>
        <li>User consent</li>
        <li>Contractual necessity</li>
        <li>Legitimate business interests</li>
        <li>Legal or regulatory obligations</li>
      </ul>

      <h2>5. User Consent & Control (API-Critical)</h2>
      <ul>
        <li>All third-party platform access is explicitly user-authorized</li>
        <li>Users can disconnect APIs at any time</li>
        <li>Revoking access immediately stops further data collection</li>
        <li>Users control what platforms are connected</li>
      </ul>

      <p>
        This fully aligns with Meta, Google, LinkedIn, and X developer policies.
      </p>

      <h2>6. Cookies & Tracking Technologies</h2>
      <p>
        We use cookies to improve user experience, maintain session security,
        and analyze traffic. Users can control cookies through browser settings.
      </p>

      <h2>7. Data Storage & Security</h2>
      <ul>
        <li>Encrypted data transmission (HTTPS)</li>
        <li>Secure server infrastructure</li>
        <li>Access control and authentication</li>
        <li>Regular system monitoring</li>
      </ul>

      <h2>8. Data Retention</h2>
      <ul>
        <li>Only as long as necessary to provide Services</li>
        <li>As required by law or regulation</li>
        <li>Until users revoke permissions or request deletion</li>
      </ul>

      <h2>9. Data Sharing & Disclosure</h2>
      <p>
        We may share data only with user consent, trusted service providers,
        or legal authorities when required.
      </p>
      <p>
        <strong>No data is sold or used for advertising resale.</strong>
      </p>

      <h2>10. International Data Transfers</h2>
      <p>
        When data is transferred across borders, lawful safeguards and
        compliance mechanisms are applied.
      </p>

      <h2>11. User Rights</h2>
      <ul>
        <li>Access personal data</li>
        <li>Correct inaccurate data</li>
        <li>Delete personal data</li>
        <li>Restrict or object to processing</li>
        <li>Withdraw consent</li>
        <li>Request data portability</li>
      </ul>

      <p>
        To request deletion of your personal data, please visit our{" "}
        <a href="#/data-deletion">User Data Deletion page</a>.
      </p>

      <h2>12. Children’s Privacy</h2>
      <p>
        Citizen Connect does not knowingly collect data from individuals under
        18 years of age.
      </p>

      <h2>13. Third-Party Platforms</h2>
      <p>
        Use of third-party platforms is governed by their own privacy policies.
      </p>

      <h2>14. Changes to This Policy</h2>
      <p>
        Updates will be posted on this page with a revised “Last Updated” date.
      </p>

      <h2>15. Contact Information</h2>
      <p>
        <strong>Citizen Connect</strong><br />
        📧 Email: privacy@yourdomain.com<br />
        🌐 Website: yourdomain.com
      </p>

      <h2>✅ API Compliance Statement</h2>
      <ul>
        <li>All API access is user-consented</li>
        <li>No scraping or unauthorized collection</li>
        <li>Purpose-limited data usage</li>
        <li>Users can revoke access at any time</li>
        <li>No data resale or misuse</li>
      </ul>

      <p className="legal-footer">
        Citizen Connect operates with transparency, global compliance, and
        ethical data governance at its core.
      </p>
    </div>
  );
};

export default PrivacyPolicyPage;
