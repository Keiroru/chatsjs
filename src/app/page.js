"use client";

import Link from "next/link";
import styles from "@/app/styles/page.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faPeopleGroup, faUserFriends, faGlobe } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "@/contexts/TranslationContext";
import Footer from "./components/Footer";
import Header from "./components/Header";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className={styles.landingContainer}>
      <Header />
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
            <FontAwesomeIcon icon={faPeopleGroup} className={styles.featureIcon} />
            <h3>{t("connectWithPeople")}</h3>
            <p>{t("connectWithPeopleSubtitle")}</p>
          </div>
          <div className={styles.featureCard}>
            <FontAwesomeIcon icon={faGlobe} className={styles.featureIcon} />
            <h3>{t("groupChats")}</h3>
            <p>{t("groupChatsSubtitle")}</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}