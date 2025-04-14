"use client";

import styles from '@/app/styles/legal.module.css';
import { useTranslation } from '@/contexts/TranslationContext';

export default function PrivacyPolicyPage() {
    const { t } = useTranslation();

    return (
        <div className={styles.container}>
            <h1 className={`${styles.heading} ${styles.gradientHeading}`}>{t('ppTitle')}</h1>
            <p className={styles.paragraph}>{t('ppEffectiveDate')}</p>
            <p className={styles.paragraph}>
                {t('ppIntro')}
            </p>

            <h2 className={styles.subheading}>{t('ppInfoCollectTitle')}</h2>
            <p className={styles.paragraph}>{t('ppInfoCollect')}</p>
            <h3 className={styles.subSubheading}>{t('ppAccountInfoTitle')}</h3>
            <p className={styles.paragraph}>{t('ppAccountInfo')}</p>
            <h3 className={styles.subSubheading}>{t('ppMessagesTitle')}</h3>
            <p className={styles.paragraph}>{t('ppMessages')}</p>
            <h3 className={styles.subSubheading}>{t('ppUsageDataTitle')}</h3>
            <p className={styles.paragraph}>{t('ppUsageData')}</p>
            <h3 className={styles.subSubheading}>{t('ppOptionalInfoTitle')}</h3>
            <p className={styles.paragraph}>{t('ppOptionalInfo')}</p>

            <h2 className={styles.subheading}>{t('ppInfoUseTitle')}</h2>
            <p className={styles.paragraph}>{t('ppInfoUse')}</p>
            <ul className={styles.list}>
                <li>{t('ppInfoUseList1')}</li>
                <li>{t('ppInfoUseList2')}</li>
                <li>{t('ppInfoUseList3')}</li>
                <li>{t('ppInfoUseList4')}</li>
                <li>{t('ppInfoUseList5')}</li>
            </ul>

            <h2 className={styles.subheading}>{t('ppInfoShareTitle')}</h2>
            <p className={styles.paragraph}>{t('ppInfoShare')}</p>
            <ul className={styles.list}>
                <li dangerouslySetInnerHTML={{ __html: t('ppInfoShareList1') }}></li>
                <li dangerouslySetInnerHTML={{ __html: t('ppInfoShareList2') }}></li>
                <li dangerouslySetInnerHTML={{ __html: t('ppInfoShareList3') }}></li>
            </ul>

            <h2 className={styles.subheading}>{t('ppSecurityTitle')}</h2>
            <p className={styles.paragraph}>
                {t('ppSecurity')}
            </p>

            <h2 className={styles.subheading}>{t('ppRightsTitle')}</h2>
            <p className={styles.paragraph}>{t('ppRights')}</p>
            <ul className={styles.list}>
                <li>{t('ppRightsList1')}</li>
                <li>{t('ppRightsList2')}</li>
                <li>{t('ppRightsList3')}</li>
                <li>{t('ppRightsList4')}</li>
            </ul>
            <p className={styles.paragraph}>{t('ppRightsContact')}</p>

            <h2 className={styles.subheading}>{t('ppRetentionTitle')}</h2>
            <p className={styles.paragraph}>
                {t('ppRetention')}
            </p>

            <h2 className={styles.subheading}>{t('ppChildrenTitle')}</h2>
            <p className={styles.paragraph}>
                {t('ppChildren')}
            </p>

            <h2 className={styles.subheading}>{t('ppChangesTitle')}</h2>
            <p className={styles.paragraph}>
                {t('ppChanges')}
            </p>
        </div>
    );
} 