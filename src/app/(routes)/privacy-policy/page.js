import styles from '@/app/styles/legal.module.css';

export default function PrivacyPolicyPage() {
    return (
        <div className={styles.container}>
            <h1 className={`${styles.heading} ${styles.gradientHeading}`}>Privacy Policy</h1>
            <p className={styles.paragraph}>Effective Date: 2025-04-13</p>
            <p className={styles.paragraph}>
                Your privacy is important to us. This Privacy Policy explains how ChatJS ("we", "our", or "us") collects, uses, shares, and protects your personal information when you use our app and related services (the "Service").
            </p>

            <h2 className={styles.subheading}>1. Information We Collect</h2>
            <p className={styles.paragraph}>We collect the following types of information to provide and improve our Service:</p>
            <h3 className={styles.subSubheading}>a. Account Information:</h3>
            <p className={styles.paragraph}>When you sign up, we collect information such as your username, email address, and other registration details.</p>
            <h3 className={styles.subSubheading}>b. Messages and Content:</h3>
            <p className={styles.paragraph}>Messages sent through the app are end-to-end encrypted. We cannot read or access your messages. However, we may store metadata (e.g., timestamps, sender/receiver IDs) to support app functionality.</p>
            <h3 className={styles.subSubheading}>c. Usage Data:</h3>
            <p className={styles.paragraph}>We collect information about how you interact with the app, such as app features used, crash logs, device type, and system information.</p>
            <h3 className={styles.subSubheading}>d. Optional Information:</h3>
            <p className={styles.paragraph}>You may choose to provide additional details such as a profile picture or status message.</p>

            <h2 className={styles.subheading}>2. How We Use Your Information</h2>
            <p className={styles.paragraph}>We use your information to:</p>
            <ul className={styles.list}>
                <li>Provide, maintain, and improve the Service</li>
                <li>Respond to customer inquiries and provide support</li>
                <li>Analyze app usage to enhance user experience</li>
                <li>Enforce our Terms of Service and prevent misuse</li>
                <li>Communicate updates and important notices</li>
            </ul>

            <h2 className={styles.subheading}>3. How We Share Your Information</h2>
            <p className={styles.paragraph}>We do not sell your personal information to third parties. We may share information only in the following situations:</p>
            <ul className={styles.list}>
                <li><strong>With service providers:</strong> Trusted partners who help us operate and maintain the app (under strict confidentiality).</li>
                <li><strong>Legal compliance:</strong> When required by law, regulation, legal process, or governmental request.</li>
                <li><strong>Business transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.</li>
            </ul>

            <h2 className={styles.subheading}>4. Security of Your Information</h2>
            <p className={styles.paragraph}>
                We use industry-standard encryption, secure servers, and access controls to protect your data. However, no method of transmission over the Internet is 100% secure, so we cannot guarantee absolute security.
            </p>

            <h2 className={styles.subheading}>5. Your Rights and Choices</h2>
            <p className={styles.paragraph}>Depending on your location, you may have the right to:</p>
            <ul className={styles.list}>
                <li>Access and review the personal data we hold about you</li>
                <li>Request correction or deletion of your information</li>
                <li>Object to or restrict certain processing</li>
                <li>Withdraw consent at any time</li>
            </ul>
            <p className={styles.paragraph}>To exercise these rights, contact us at support@chatjs.com.</p>

            <h2 className={styles.subheading}>6. Data Retention</h2>
            <p className={styles.paragraph}>
                We retain your information only as long as necessary to provide the Service and for legitimate legal and business purposes. When no longer needed, your data is securely deleted or anonymized.
            </p>

            <h2 className={styles.subheading}>7. Children's Privacy</h2>
            <p className={styles.paragraph}>
                ChatJS is not intended for users under the age of 14. We do not knowingly collect data from children. If you believe a child has provided us with personal information, please contact us immediately.
            </p>

            <h2 className={styles.subheading}>8. Changes to This Policy</h2>
            <p className={styles.paragraph}>
                We may update this Privacy Policy from time to time. If we make significant changes, we will notify you within the app or via email. Continued use of the Service after changes indicates your acceptance of the new policy.
            </p>
        </div>
    );
} 