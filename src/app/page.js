import Link from "next/link";
import styles from "@/app/styles/page.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faLock, faUserFriends, faGlobe } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  return (
    <div className={styles.landingContainer}>
      <div className={styles.navBar}>
        <div className={styles.logo}>ChatJS</div>
        <div className={styles.navButtons}>
          <Link href="/login">
            <button className={styles.loginButton}>Login</button>
          </Link>
          <Link href="/register">
            <button className={styles.registerButton}>Sign Up</button>
          </Link>
        </div>
      </div>

      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Connect with friends and the world</h1>
          <p className={styles.heroSubtitle}>
            A simple, secure, and reliable way to stay connected.
            Chat with anyone, anywhere.
          </p>
          <Link href="/register">
            <button className={styles.heroButton}>Get Started</button>
          </Link>
        </div>
        <div className={styles.heroImage}>
          <div className={styles.mockupContainer}>
            <div className={styles.mockupWindow}>
              <div className={styles.mockupHeader}>
                <div className={styles.profilePic}></div>
                <div className={styles.profileName}></div>
              </div>
              <div className={styles.mockupContent}>
                <div className={styles.mockupMessage1}></div>
                <div className={styles.mockupMessage2}></div>
                <div className={styles.mockupMessage1}></div>
              </div>
              <div className={styles.input}>
                <input className={styles.messageInput} type="text"></input>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.featuresSection}>
        <h2 className={styles.sectionTitle}>Key Features</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <FontAwesomeIcon icon={faUserFriends} className={styles.featureIcon} />
            <h3>Connect with Friends</h3>
            <p>Add friends and stay connected with people who matter.</p>
          </div>
          <div className={styles.featureCard}>
            <FontAwesomeIcon icon={faComments} className={styles.featureIcon} />
            <h3>Real-time Messaging</h3>
            <p>Instant message delivery.</p>
          </div>
          <div className={styles.featureCard}>
            <FontAwesomeIcon icon={faLock} className={styles.featureIcon} />
            <h3>Secure Chats</h3>
            <p>Your conversations are protected and private.</p>
          </div>
          <div className={styles.featureCard}>
            <FontAwesomeIcon icon={faGlobe} className={styles.featureIcon} />
            <h3>Group Conversations</h3>
            <p>Create group chats and collaborate with multiple people.</p>
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        <p>© 2025 ChatJS. All rights reserved.</p>
      </footer>
    </div>
  );
}