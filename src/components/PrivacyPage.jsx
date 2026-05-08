export default function PrivacyPage({ t }) {
  return (
    <section className="legal-page">
      <div className="legal-container">
        <h1>Privacy Policy</h1>
        <p className="legal-date">Last Updated: May 1, 2026</p>

        <section className="legal-section">
          <h2>1. Introduction</h2>
          <p>JobSeeker ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service.</p>
        </section>

        <section className="legal-section">
          <h2>2. Information We Collect</h2>
          
          <h3>2.1 Information You Provide</h3>
          <p><strong>Job Application Data:</strong></p>
          <ul>
            <li>Company names, job titles, and positions</li>
            <li>Job URLs and application links</li>
            <li>Application dates and stages</li>
            <li>Salary information (if provided)</li>
            <li>Job location details</li>
          </ul>

          <p><strong>CV/Resume Information:</strong></p>
          <ul>
            <li>Full CV/resume text content</li>
            <li>Analyzed skills and competencies</li>
            <li>Match scores for job positions</li>
          </ul>

          <p><strong>Account Information:</strong></p>
          <ul>
            <li>Email address (optional)</li>
            <li>Preferences and settings</li>
            <li>Language and theme preferences</li>
          </ul>

          <h3>2.2 Information Collected Automatically</h3>
          <p><strong>Technical Information:</strong></p>
          <ul>
            <li>Browser type and version</li>
            <li>Device type and operating system</li>
            <li>IP address</li>
            <li>Cookies and similar tracking technologies</li>
            <li>Usage data</li>
          </ul>

          <p><strong>Local Storage:</strong></p>
          <p>JobSeeker stores user data locally in browser localStorage. This data remains on your device and is not transmitted to our servers.</p>
        </section>

        <section className="legal-section">
          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect for:</p>
          <ul>
            <li>Service Provision: To create and maintain your account</li>
            <li>Functionality: To provide analytics and job matching features</li>
            <li>Improvement: To analyze usage patterns</li>
            <li>Communication: To respond to inquiries</li>
            <li>Security: To detect and prevent fraud</li>
            <li>Compliance: To comply with legal obligations</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>4. Data Storage and Security</h2>
          
          <h3>4.1 Local Storage</h3>
          <p>Most of your data is stored locally in your browser's localStorage. This data never leaves your device unless you explicitly export it. Clearing your browser data will delete your JobSeeker data.</p>

          <h3>4.2 Data Security</h3>
          <p>We implement encryption, firewalls, and other security technologies. However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security of your information.</p>
        </section>

        <section className="legal-section">
          <h2>5. Third-Party Services</h2>
          
          <h3>5.1 API Integrations</h3>
          <p>JobSeeker may integrate with third-party APIs (e.g., Groq for CV analysis). When using these services, your data may be processed by third parties. We recommend reviewing those services' privacy policies.</p>

          <h3>5.2 Analytics</h3>
          <p>We may use analytics services to understand usage patterns. These services may collect anonymized usage data.</p>
        </section>

        <section className="legal-section">
          <h2>6. Data Retention</h2>
          <ul>
            <li>Active Accounts: Your data is stored as long as your account is active</li>
            <li>Account Deletion: Upon deletion, your data is removed from active systems within 30 days</li>
            <li>Backup Data: Residual data may persist in backups for up to 90 days</li>
            <li>Legal Compliance: We may retain data longer if required by law</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>7. Your Privacy Rights</h2>
          
          <h3>7.1 Access</h3>
          <p>You have the right to access your personal data and receive a copy of the information we hold about you.</p>

          <h3>7.2 Correction</h3>
          <p>You have the right to correct inaccurate or incomplete information.</p>

          <h3>7.3 Deletion</h3>
          <p>You have the right to request deletion of your account and associated data. We will process deletion requests within 30 days.</p>

          <h3>7.4 Portability</h3>
          <p>You can export your data from JobSeeker at any time in standard formats.</p>
        </section>

        <section className="legal-section">
          <h2>8. GDPR Compliance (EU Users)</h2>
          <p>If you are located in the European Union, United Kingdom, or EEA:</p>
          <ul>
            <li>Legal Basis: We process your data based on consent and legitimate interests</li>
            <li>Data Protection: Contact support@jobseeker.app for inquiries</li>
            <li>Your Rights: You have the right to access, rectify, erase, and object to processing of your data</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>9. California Privacy Rights (CCPA)</h2>
          <p>If you are a California resident, you have the right to:</p>
          <ul>
            <li>Know what personal information is collected</li>
            <li>Know whether your information is sold or disclosed</li>
            <li>Access and delete your information</li>
            <li>Be free from discrimination for exercising your rights</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>10. Cookies and Tracking</h2>
          
          <h3>10.1 What are Cookies?</h3>
          <p>Cookies are small data files stored on your device. They help us recognize you and store preferences.</p>

          <h3>10.2 Types of Cookies We Use</h3>
          <ul>
            <li>Essential Cookies: Required for core functionality</li>
            <li>Preference Cookies: Store your language, theme, and settings</li>
            <li>Analytics Cookies: Help us understand usage patterns (anonymized)</li>
          </ul>

          <h3>10.3 Disabling Cookies</h3>
          <p>You can disable cookies through your browser settings. However, this may affect functionality.</p>
        </section>

        <section className="legal-section">
          <h2>11. Contact Us</h2>
          <p>For privacy inquiries, requests, or concerns:</p>
          <ul>
            <li>Email: privacy@jobseeker.app</li>
            <li>Support: support@jobseeker.app</li>
            <li>Website: https://jobseeker.app</li>
          </ul>
        </section>

        <p className="legal-footer">By using JobSeeker, you acknowledge that you have read and understood this Privacy Policy and agree to its terms.</p>
      </div>
    </section>
  );
}
