"use client";

import { useState } from 'react';
import Link from "next/link";
import styles from "@/app/styles/Header.module.css";
import { useTranslation } from "@/contexts/TranslationContext";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";

export default function Header() {
    const { t } = useTranslation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className={styles.navBar}>
            <Link href="/">
                <div className={styles.logo}>ChatJS</div>
            </Link>
            <div className={styles.mobileNav}>
                <div className={`${styles.navButtons} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
                    <div className={styles.mobileMenuTop}>
                        <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                            <button className={styles.loginButton}>{t("login")}</button>
                        </Link>
                        <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                            <button className={styles.registerButton}>{t("register")}</button>
                        </Link>
                    </div>
                    <div className={styles.mobileMenuBottom}>
                        <LanguageSwitcher />
                    </div>
                </div>
                <button className={styles.hamburgerButton} onClick={toggleMobileMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </nav>
    );
} 