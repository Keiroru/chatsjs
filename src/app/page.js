"use client";

import Link from "next/link";
import styles from "@/app/styles/page.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faLock, faUserFriends, faGlobe } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "@/contexts/TranslationContext";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
export default function Home() {
  const { t } = useTranslation();

  return (
    <div className={styles.landingContainer}>
      <div className={styles.navBar}>
        <div className={styles.logo}>ChatJS</div>
        <div className={styles.navButtons}>
          <LanguageSwitcher />
          <Link href="/login">
            <button className={styles.loginButton}>{t("login")}</button>
          </Link>
          <Link href="/register">
            <button className={styles.registerButton}>{t("register")}</button>
          </Link>
        </div>
      </div>

      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{t("heroTitle")}</h1>
          <p className={styles.heroSubtitle}>
            {t("heroSubtitle")}
          </p>
          <Link href="/register">
            <button className={styles.heroButton}>{t("heroButton")}</button>
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
        <h2 className={styles.sectionTitle}>{t("featuresSectionTitle")}</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <FontAwesomeIcon icon={faUserFriends} className={styles.featureIcon} />
            <h3>{t("connectWithFriends")}</h3>
            <p>{t("connectWithFriendsSubtitle")}</p>
          </div>
          <div className={styles.featureCard}>
            <FontAwesomeIcon icon={faComments} className={styles.featureIcon} />
            <h3>{t("realTimeChat")}</h3>
            <p>{t("realTimeChatSubtitle")}</p>
          </div>
          <div className={styles.featureCard}>
            <FontAwesomeIcon icon={faLock} className={styles.featureIcon} />
            <h3>{t("secureChats")}</h3>
            <p>{t("secureChatsSubtitle")}</p>
          </div>
          <div className={styles.featureCard}>
            <FontAwesomeIcon icon={faGlobe} className={styles.featureIcon} />
            <h3>{t("groupChats")}</h3>
            <p>{t("groupChatsSubtitle")}</p>
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        <p>{t("footerTitle")}</p>
        <div className={styles.footerLinks}>
          <Link href="/terms">{t("terms")}</Link>
          <Link href="/privacy">{t("privacy")}</Link>
          <Link href="/contact">{t("contact")}</Link>
        </div>
      </footer>
    </div>
  );
}