import styles from '@/app/styles/chat.module.css';

export default function ChatLayout({ children }) {
    return (
        <div className={styles['chat-layout']}>
            {children}
        </div>
    );
}