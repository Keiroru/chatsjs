'use client';

import styles from '@/app/styles/auth.module.css';

export default function AuthLayout({ children }) {
    return (
        <div className={styles.authWrapper}>
            <div className={styles.background}>
                <div className={styles.down}>
                    <div className={styles.bgBox}></div>
                    <div className={`${styles.bgBox} ${styles.firstBox}`}></div>
                    <div className={`${styles.bgBox} ${styles.secondBox}`}></div>
                    <div className={`${styles.bgBox} ${styles.thirdBox}`}></div>
                </div>
                <div className={styles.up}>
                    <div className={`${styles.bgBox} ${styles.zeroBox}`}></div>
                    <div className={styles.bgBox}></div>
                    <div className={`${styles.bgBox} ${styles.firstBox}`}></div>
                    <div className={`${styles.bgBox} ${styles.secondBox}`}></div>
                </div>
                <div className={styles.form}>
                    {children}
                </div>
            </div>
        </div>
    );
}