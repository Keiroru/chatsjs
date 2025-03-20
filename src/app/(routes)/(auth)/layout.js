'use client';

import styles from '@/app/styles/auth.module.css';

export default function AuthLayout({ children }) {
    return (
        <div className={styles.authWrapper}>
            <div className={styles.background}>
                <div className={styles.down}>
                    <div className={styles["bg-box"]}></div>
                    <div className={`${styles["bg-box"]} ${styles.egy}`}></div>
                    <div className={`${styles["bg-box"]} ${styles.ketto}`}></div>
                    <div className={`${styles["bg-box"]} ${styles.harom}`}></div>
                </div>
                <div className={styles.up}>
                    <div className={`${styles["bg-box"]} ${styles.nulla}`}></div>
                    <div className={styles["bg-box"]}></div>
                    <div className={`${styles["bg-box"]} ${styles.egy}`}></div>
                    <div className={`${styles["bg-box"]} ${styles.ketto}`}></div>
                </div>
                <div className={styles.form}>
                    {children}
                </div>
            </div>
        </div>
    );
}