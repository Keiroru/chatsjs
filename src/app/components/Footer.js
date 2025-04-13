import Link from 'next/link';
import styles from '@/app/styles/Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <Link href="/tos" className={styles.link}>
                    Terms of Service
                </Link>
                <Link href="/privacy-policy" className={styles.link}>
                    Privacy Policy
                </Link>
            </div>
        </footer>
    );
} 