import React from "react";
import styles from "@/app/styles/Footer.module.css";
import { useTranslation } from "@/contexts/TranslationContext";

const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p>&copy; {new Date().getFullYear()}{t("footerTitle")}</p>
        <div className={styles.footerLinks}>
          <a href="/tos" className={styles.link}>
          {t("terms")}
          </a>
          <a href="/privacy-policy" className={styles.link}>
          {t("privacy")}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
