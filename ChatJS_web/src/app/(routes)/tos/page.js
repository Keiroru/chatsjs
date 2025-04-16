"use client";

import styles from '@/app/styles/legal.module.css';
import { useTranslation } from '@/contexts/TranslationContext';

export default function TosPage() {
    const { t } = useTranslation();

    return (
        <div className={styles.container}>
            <h1 className={`${styles.heading} ${styles.gradientHeading}`}>{t('tosTitle')}</h1>
            <p className={styles.paragraph}>{t('tosEffectiveDate')}</p>
            <p className={styles.paragraph}>
                {t('tosIntro')}
            </p>

            <h2 className={styles.subheading}>{t('tosAcceptanceTitle')}</h2>
            <p className={styles.paragraph}>
                {t('tosAcceptance')}
            </p>

            <h2 className={styles.subheading}>{t('tosEligibilityTitle')}</h2>
            <p className={styles.paragraph}>
                {t('tosEligibility')}
            </p>

            <h2 className={styles.subheading}>{t('tosUsageRulesTitle')}</h2>
            <p className={styles.paragraph}>{t('tosUsageRules')}</p>
            <ul className={styles.list}>
                <li>{t('tosUsageRulesList1')}</li>
                <li>{t('tosUsageRulesList2')}</li>
                <li>{t('tosUsageRulesList3')}</li>
                <li>{t('tosUsageRulesList4')}</li>
                <li>{t('tosUsageRulesList5')}</li>
            </ul>
            <p className={styles.paragraph}>{t('tosUsageRulesFooter')}</p>

            <h2 className={styles.subheading}>{t('tosPrivacyTitle')}</h2>
            <p className={styles.paragraph}>
                {t('tosPrivacy')}
            </p>

            <h2 className={styles.subheading}>{t('tosTerminationTitle')}</h2>
            <p className={styles.paragraph}>
                {t('tosTermination')}
            </p>

            <h2 className={styles.subheading}>{t('tosLiabilityTitle')}</h2>
            <p className={styles.paragraph}>
                {t('tosLiability')}
            </p>

            <h2 className={styles.subheading}>{t('tosChangesTitle')}</h2>
            <p className={styles.paragraph}>
                {t('tosChanges')}
            </p>

            <h2 className={styles.subheading}>{t('tosGoverningLawTitle')}</h2>
            <p className={styles.paragraph}>
                {t('tosGoverningLaw')}
            </p>

            <h2 className={styles.subheading}>{t('tosContactTitle')}</h2>
            <p className={styles.paragraph}>
                {t('tosContact')}
            </p>
        </div>
    );
} 