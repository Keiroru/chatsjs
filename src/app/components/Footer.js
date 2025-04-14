import React from "react";
import styles from "@/app/styles/Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p>&copy; {new Date().getFullYear()} ChatJS. All rights reserved.</p>
        <div className={styles.footerLinks}>
          <a href="/tos" className={styles.link}>
            Terms of Service
          </a>
          <a href="/privacy-policy" className={styles.link}>
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
