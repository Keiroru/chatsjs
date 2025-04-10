"use client";

import { useTranslation } from '../../contexts/TranslationContext';
import styles from "@/app/styles/languageSwitcher.module.css";

export default function LanguageSwitcher() {
    const { language, changeLanguage, t } = useTranslation();

    return (
        <select
            value={language}
            onChange={(e) => changeLanguage(e.target.value)}
            className={styles.languageSwitcher}
        >
            <option value="en">{t("en")}</option>
            <option value="hu">{t("hu")}</option>
        </select>
    );
} 