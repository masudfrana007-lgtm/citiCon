import React from "react";
import "./TermsPage.css";

const TermsPage = () => {
  return (
    <div className="legal-page">
      <h1>Terms & Conditions</h1>

      <p className="legal-meta">
        <strong>Effective Date:</strong> [Insert Date]<br />
        <strong>Last Updated:</strong> [Insert Date]
      </p>

      <p>
        These Terms & Conditions (“Terms”) govern access to and use of the Citizen
        Connect website, applications, software, APIs, and related services
        (collectively, the “Services”). By accessing or using the Services, you
        agree to be legally bound by these Terms.
      </p>

      <p>
        <strong>
          If you do not agree to these Terms, you must immediately discontinue
          use of the Services.
        </strong>
      </p>

      <h2>1. About Citizen Connect</h2>
      <p>
        Citizen Connect is a global digital communication and content distribution
        platform designed to enable individuals, organizations, and enterprises
        to manage, publish, and analyze content across multiple third-party
        digital platforms through authorized integrations.
      </p>

      <h2>2. Eligibility</h2>
      <p>By using the Services, you represent and warrant that:</p>
      <ul>
        <li>You are at least 18 years old</li>
        <li>You have authority to act on behalf of an organization, if applicable</li>
        <li>You have the legal capacity to enter binding agreements</li>
        <li>
          Your use of the Services complies with all applicable local, national,
          and international laws
        </li>
      </ul>

      <h2>3. Account Registration & Authorization</h2>
      <p>
        Certain features require account registration and explicit authorization.
      </p>
      <p>You agree to:</p>
      <ul>
        <li>Provide accurate and lawful information</li>
        <li>Maintain confidentiality of your credentials</li>
        <li>Be responsible for all activities under your account</li>
      </ul>
      <p>
        Citizen Connect reserves the right to suspend or terminate accounts that
        violate these Terms.
      </p>

      <h2>4. Third-Party Platform Integrations & API Permissions</h2>
      <p>
        Citizen Connect integrates with third-party platforms through official
        APIs and SDKs.
      </p>
      <p>By connecting a platform, you explicitly authorize Citizen Connect to:</p>
      <ul>
        <li>Access APIs using user-granted permissions</li>
        <li>Read, write, publish, schedule, and manage content on your behalf</li>
        <li>Retrieve analytics, engagement, and performance data</li>
        <li>Display account-related information required for functionality</li>
        <li>Operate strictly within the scope of permissions you grant</li>
      </ul>

      <p>
        Citizen Connect:
      </p>
      <ul>
        <li>Uses only officially provided APIs</li>
        <li>Complies with all platform developer policies and data use rules</li>
        <li>Does not scrape, bypass, or misuse platform services</li>
        <li>Allows permission revocation at any time</li>
      </ul>

      <h2>5. User Consent & Control</h2>
      <ul>
        <li>All API access is explicitly consent-based</li>
        <li>Users control connected platforms</li>
        <li>Access is purpose-limited</li>
      </ul>
      <p>
        Revoking permissions immediately stops further API interactions.
      </p>

      <h2>6. Acceptable Use Policy</h2>
      <p>You agree not to use the Services to:</p>
      <ul>
        <li>Violate laws or regulations</li>
        <li>Publish illegal, misleading, defamatory, or harmful content</li>
        <li>Engage in hate speech, harassment, extremism, or violence</li>
        <li>Infringe intellectual property or privacy rights</li>
        <li>Abuse APIs or attempt unauthorized access</li>
      </ul>

      <p>
        Citizen Connect may remove content or restrict access to maintain legal
        and platform compliance.
      </p>

      <h2>7. User Content & Responsibility</h2>
      <p>
        Users retain ownership of their content.
      </p>
      <p>
        By using the Services, you grant Citizen Connect a non-exclusive,
        worldwide, royalty-free license to host, process, distribute, and display
        content solely to provide the Services.
      </p>
      <p>
        You are solely responsible for the legality, accuracy, and consequences
        of your content.
      </p>
      <p>
        Citizen Connect does not endorse user-generated content.
      </p>

      <h2>8. Privacy & Data Protection</h2>
      <p>
        Citizen Connect processes personal data in compliance with applicable
        global data protection laws, including GDPR and CCPA/CPRA where applicable.
      </p>
      <p>
        API data access is limited to authorized scopes, used only for declared
        functionality, and never sold or misused.
      </p>
      <p>
        Full details are provided in our{" "}
        <a href="#/privacy">Privacy Policy</a>.
      </p>

      <h2>9. Platform Availability & Disclaimer</h2>
      <p>
        Citizen Connect does not guarantee uninterrupted service, error-free
        operation, or specific performance outcomes.
      </p>
      <p>
        Third-party platform availability is governed by their own services and
        policies.
      </p>

      <h2>10. Intellectual Property Rights</h2>
      <p>
        All platform-related intellectual property, including software,
        architecture, UI designs, branding, and trademarks, is owned by or
        licensed to Citizen Connect and protected by international law.
      </p>

      <h2>11. Third-Party Responsibility Disclaimer</h2>
      <p>
        Citizen Connect is not responsible for third-party platform actions,
        policy changes, suspensions, or external data practices.
      </p>

      <h2>12. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, Citizen Connect shall not be
        liable for indirect, incidental, or consequential damages, loss of data,
        revenue, or third-party platform restrictions.
      </p>

      <h2>13. Indemnification</h2>
      <p>
        You agree to indemnify and hold harmless Citizen Connect and its partners
        from claims arising from your content, platform usage, or violation of
        these Terms.
      </p>

      <h2>14. Suspension & Termination</h2>
      <p>
        Access may be suspended or terminated for Terms violations, legal
        compliance, or platform security reasons.
      </p>

      <h2>15. Modifications to Terms</h2>
      <p>
        Citizen Connect may update these Terms. Continued use of the Services
        constitutes acceptance of revised Terms.
      </p>

      <h2>16. Governing Law & Jurisdiction</h2>
      <p>
        These Terms are governed by internationally recognized principles of
        contract law, subject to mandatory local legal requirements.
      </p>

      <h2>17. Contact Information</h2>
      <p>
        <strong>Citizen Connect</strong><br />
        📧 Email: official@yourdomain.com<br />
        🌐 Website: yourdomain.com
      </p>

      <h2>✅ Global Compliance & API Assurance</h2>
      <p className="legal-footer">
        Citizen Connect operates as a consent-driven, API-authorized platform,
        committed to transparency, data protection, and full compliance with
        global developer and platform regulations.
      </p>
    </div>
  );
};

export default TermsPage;
