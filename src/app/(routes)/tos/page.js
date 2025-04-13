import styles from '@/app/styles/legal.module.css';

export default function TosPage() {
    return (
        <div className={styles.container}>
            <h1 className={`${styles.heading} ${styles.gradientHeading}`}>Terms of Service</h1>
            <p className={styles.paragraph}>Effective Date: 2025-04-13</p>
            <p className={styles.paragraph}>
                Welcome to ChatJS! Please read these Terms of Service ("Terms") carefully before using our application (the "Service"). By accessing or using ChatJS, you agree to be bound by these Terms.
            </p>

            <h2 className={styles.subheading}>1. Acceptance of Terms</h2>
            <p className={styles.paragraph}>
                By using our Service, you confirm that you have read, understood, and agreed to these Terms. If you do not agree with any part of the Terms, you must not use the app.
            </p>

            <h2 className={styles.subheading}>2. Eligibility</h2>
            <p className={styles.paragraph}>
                To use this app, you must be at least 14 years old or the age of legal majority in your jurisdiction. By registering, you represent and warrant that you meet this requirement.
            </p>

            <h2 className={styles.subheading}>3. Usage Rules</h2>
            <p className={styles.paragraph}>When using ChatJS, you agree to:</p>
            <ul className={styles.list}>
                <li>Communicate respectfully with other users.</li>
                <li>Refrain from sharing harmful, abusive, or illegal content.</li>
                <li>Not harass, threaten, or impersonate others.</li>
                <li>Not attempt to access or interfere with the app's infrastructure or security.</li>
                <li>Ensure any content you share complies with applicable laws and does not infringe upon the rights of others.</li>
            </ul>
            <p className={styles.paragraph}>We reserve the right to monitor and moderate content to enforce these rules.</p>

            <h2 className={styles.subheading}>4. Privacy and Security</h2>
            <p className={styles.paragraph}>
                We take user privacy seriously. All messages are encrypted during transmission to safeguard your data. For more details, please review our Privacy Policy.
            </p>

            <h2 className={styles.subheading}>5. Account Termination</h2>
            <p className={styles.paragraph}>
                We may suspend or permanently terminate your access to the Service if you violate these Terms or engage in harmful behavior. We reserve the right to take appropriate legal action where necessary.
            </p>

            <h2 className={styles.subheading}>6. Liability Limitations</h2>
            <p className={styles.paragraph}>
                To the fullest extent permitted by law, ChatJS and its operators are not liable for any direct, indirect, incidental, or consequential damages arising from your use of the Service.
            </p>

            <h2 className={styles.subheading}>7. Changes to Terms</h2>
            <p className={styles.paragraph}>
                We may revise these Terms at any time. If we make significant changes, we will notify you within the app or via email. Continued use of the Service after changes take effect constitutes your acceptance of the updated Terms.
            </p>

            <h2 className={styles.subheading}>8. Governing Law</h2>
            <p className={styles.paragraph}>
                These Terms shall be governed by and construed in accordance with the laws of Hungary, without regard to its conflict of law principles.
            </p>

            <h2 className={styles.subheading}>9. Contact Us</h2>
            <p className={styles.paragraph}>
                If you have any questions or concerns about these Terms, please contact us at support@chatjs.com.
            </p>
        </div>
    );
} 